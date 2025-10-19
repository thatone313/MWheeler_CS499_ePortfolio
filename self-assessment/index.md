---
layout: default
title: Professional Self-Assessment
---

<link rel="stylesheet" href="../assets/css/custom.css">

# Professional Self-Assessment

I used my **Travlr Getaways** project to demonstrate the skills I’ve built across the CS program and how I apply them in a realistic, full-stack app. Over the capstone I moved the app from a classroom prototype toward something production-ready by tightening security, improving data handling, and adding an algorithms-driven feature that helps users in a meaningful way.

![Travlr Getaways Homepage](../artifacts/software-design/images/TravlrHomePage.jpg)

*Homepage view of the Travlr Getaways web application.*

---

## Collaboration & Communication

I treated this like a small team project: I logged problems clearly (HTTP 401s, schema issues, routing mismatches), tested fixes with Postman, and documented changes in code comments and commit messages. I also kept the user-facing pages focused and consistent—short messages, clear buttons, and predictable flows—so someone else could pick up the app and understand how it works.



---

## Software Engineering & Databases

I refactored backend routes and controllers (Node/Express/MongoDB) to be more predictable and secure. This included implementing JWT authentication with role-based access for admin endpoints, cleaner error handling, and a
dedicated `/api` routing structure. On the data side, I restructured user schema fields (arrays vs. strings), added an **EventLog collection** for auditable login events, and built endpoints that update user history in a controlled way—moving “add to history” logic from the cart step to checkout. On the frontend (Angular), I organized services and components, implemented a working search feature with debounced queries, and clarified admin/user behavior by hiding features such as **Similar** and **Recommend** where they didn’t apply.



---

## Data Structures & Algorithms

I implemented a simple but effective recommendation algorithm. It tokenizes trip names/resorts, builds sets of words, and scores similarity using straightforward overlap logic. Results are ranked (by score, then start date) and capped so they’re useful. It’s not machine learning, but it’s a clean, explainable algorithm with sensible data structures (Sets/arrays) and tradeoffs (speed, simplicity, transparency).



---

## Security Mindset

I added TOTP-based **2FA (Speakeasy)** with recovery codes, **rate limiting** on `/login`, and **event logging** for successful and failed authentication attempts. I handled edge cases (missing OTP, invalid recovery codes, clock drift via a small verification window), removed debug output, and kept secrets and token verification server-side. Role checks gate admin endpoints, and the Angular app respects the same boundaries in the UI.



---

## Growth & Next Steps

The biggest lessons I learned were to design schemas correctly, keep routes predictable, log only what matters, and build new features incrementally while ensuring usability. If given more time, I would expand automated testing, improve input validation, and enhance the recommendation engine to support weighted scoring and adaptive learning. Overall, this work demonstrates all five **CS outcomes** cohesively:  
I **planned**, **communicated**, **implemented**, **secured**, and **iterated** on a full-stack application that delivers real value.

## Final Project Download
The complete, fully enhanced version of the Travlr Getaways application can be downloaded below.

- [Travlr Getaways Full Final Version (ZIP on Google Drive)](https://drive.google.com/file/d/1ntbJnwLSFvVU1hsqGzuvbalb1Zog1KmY/view?usp=drive_link)



