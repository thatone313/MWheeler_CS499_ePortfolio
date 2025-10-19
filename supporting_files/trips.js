const mongoose = require('mongoose');
const Trip = require('../models/travlr'); //Register model
const Model = mongoose.model('trips');

// GET /api/trips?q=searchText
// Returns all trips if q is missing/blank. Otherwise filters by code, name, resort, or description (case-insensitive).

const tripsList = async(req, res) => {
    try {
        const q = (req.query.q || '').trim();
        const category = (req.query.category || '').trim().toLowerCase();
        let filter = {};

        if (q) {
            const rx = new RegExp(q, 'i'); // 'i' for case-insensitive
            filter = {
                $or: [  
                    { code: rx },
                    { name: rx },
                    { resort: rx },     
                    { description: rx }
                ]
            };
        }

        if (category) {
            if(category === 'beach') filter.code = /^BO/i; //Beach trips start with BO
            else if(category === 'cruise') filter.code = /^CO/i; //Cruise trips start with CO
            else if(category === 'mountains') filter.code = /^MO/i; //Mountain trips start with MO
        }
        
     //Return matching trips, sorted by start date if available
    const trips = await Trip.find(filter).sort({ start: 1 }).exec();
    
    return res
                .status(200)    
                .json(trips);
    }
    catch (err) {
        console.error('tripList error:', err);
        return res
                .status(500)
                .json({ message: 'Internal Server Error' });
    }  
};

//Get: /trips/:tripCode - list a single trip
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    try {
        const trip = await Trip
            .findOne({code : req.params.tripCode }) // Return single record
            .exec();

        
         if(!trip) { //Database returned no data
             return res
                .status(404)
                .json({ message: 'Trip not found' });
            }

             return res
                .status(200)    
                .json(trip);
             }
    catch (err) {
        console.error('tripsFindByCode error:', err);
        return res
                .status(500)
                .json({ message: 'Internal Server Error' });
    }
};

//POST: /trips - Adds a new Trip
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    try {
     const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name, 
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

     const added = await newTrip.save();
        return res
            .status(201)
            .json(added)
}
    catch (err) {
        console.error('tripsAddTrip error:', err);
        
        return res
            .status(400)
            .json({ message: 'Unable to create trip' });
        } 
            
    };

        //Uncomment the following line to show results off operation
        //on the console
        //console.log(q);

const tripsUpdateTrip = async(req, res) => {
    
    // Uncomment for debugging
    //console.log(req.params, req.body);
    
    try{
     const updated = await Model
        .findOneAndUpdate(
            { 'code' : req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            } 
        )
        .exec();
        
        if(!updated)
        { // Database returned no data
            return res
                .status(404)
                .json({ message: 'Trip not found' });

            } 
            return res
                .status(200)
                .json(updated);
            } 
        catch (err) {
        console.error('tripsUpdateTrip error:', err);
        return res 
            .status(400)
            .json({ message: 'Unable to update trip' });
    }   
                   
            // Uncomment the following line to show results of operation
            // on the console
            // console.log(updated);
    };

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
// DELETE: /trips/:tripCode - Deletes a trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async(req, res) => {
    try{
        const deleted = await Trip
            .findOneAndDelete({ 'code': req.params.tripCode })
            .exec();

         if (!deleted) { // Database returned no data
            return res
                .status(404)
                .json({ message: 'Trip not found' });
    } 
             return res
                .status(200)
                .json({ message: 'Trip deleted'});
}
        catch (err) {
        console.error('tripsDeleteTrip error:', err);
        return res 
            .status(500)
            .json({ message: 'Internal Server Error' });
    }


  
};

const tripsRecommendSimilar = async (req, res) => {
    try {
        const baseCode = String(req.params.tripCode || '').trim();
        if (!baseCode) {
            return res.status(400).json({ message: 'Trip code is required' });
        }
        
        const base = await Trip.findOne({ code: baseCode }).exec();
        if (!base) {
            return res.status(404).json({ message: `Base trip not found for code ,'${baseCode}'` });
        }
        const all = await Trip.find({}).exec();

        const toWords = (s) => // Convert a string to an array of lowercase words
            String(s || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(Boolean);

        const baseWords = new Set([ // Unique words from base trip
            ...toWords(base.name),
            ...toWords(base.resort)
            ]);

         const scored = all
            .filter(t => t.code !== base.code) // Exclude the base trip itself
            .map(t => { 
                const tWords = new Set([
                    ...toWords(t.name),
                    ...toWords(t.resort),
                ]);
                
                let score = 0;
                for (const w of tWords) {
                    if (baseWords.has(w)) score++;
                }
                return { trip: t, score };
            })

            .sort((a, b) => {
                // Sort by score descending, then by start date ascending
                if (b.score !== a.score) return b.score - a.score;
                const ad = a.trip.start ? new Date(a.trip.start).getTime() :Number.POSITIVE_INFINITY;
                const bd = b.trip.start ? new Date(b.trip.start).getTime() :Number.POSITIVE_INFINITY;
                return ad - bd;
            })
            .slice(0, 3) // Take top 3
            .map(x => x.trip); // Extract trip from {trip, score} object

        return res.status(200).json(scored);
    }
    catch (err) {
        console.error('tripsRecommendSimilar error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    tripsRecommendSimilar,
};