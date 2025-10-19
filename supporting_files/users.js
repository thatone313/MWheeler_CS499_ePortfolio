const User = require('../models/user');
const Trip = require('../models/travlr'); 

const toWords = (s) => // Convert a string to an array of lowercase words
    String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

const scoreLike = (base, other) => {
    const baseWords = new Set([
        ...toWords(base.name),
        ...toWords(base.resort)        
    ]);

    let score = 0;
    for (const w of [
        ...toWords(other.name),
        ...toWords(other.resort)])
    if (baseWords.has(w)) score++;
    return score;
};

// Add the given tripCode to the authenticated user's history
const addHistory = async (req, res) => {
    try {
        const uid = req.auth && req.auth._id;
        const code = String(req.params.tripCode || '').trim();
        if (!uid || !code) return res.status(400).json({ message: 'Missing user or Trip code' });
        const user = await User.findById(uid).exec();

        if (!user) return res.status(404).json({ message: 'User not found' });
        user.pastTrips = (user.pastTrips || []).filter(c => c !== code); // Remove if already present
        user.pastTrips.unshift(code); // Add to front
        if (user.pastTrips.length > 10) {user.pastTrips = user.pastTrips.slice(0, 10); // Keep only last 10
            user.pastTrips = user.pastTrips.slice(0, 10); // Keep only last 10
        }
        await user.save();
        return res.status(204).send(); // No content
    }
    catch (e) {
        console.error('addHistory error:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const recommendForUser = async (req, res) => {
    try {
        const uid = req.auth && req.auth._id;
        if (!uid) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findById(uid).exec();
        const lastCode = (user && user.pastTrips && user.pastTrips[0]) || ''; 
        if (!lastCode) return res.status(200).json([]);

        const base = await Trip.findOne({ code: lastCode}).exec();
        if (!base) return res.status(200).json([]);

        const all = await Trip.find({}).exec();
        const scored = all
            .filter(t=> t.code !== base.code)
            .map(t => ({ trip: t, score: scoreLike(base, t) }))
            .sort((a,b) => b.score - a.score || ((a.trip.start?new Date(a.trip.start).getTime():Infinity)
                - (b.trip.start?new Date(b.trip.start).getTime():Infinity)))
            .slice(0,5)
            .map(x => x.trip);

        return res.status(200).json(scored);
    }
    catch (e) {
        console.error('recommendForUser error', e);
        return res.status(503).json({message: 'Internal Server Error'})
    }
};

module.exports = {
    addHistory,
    recommendForUser
};
