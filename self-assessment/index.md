---
layout: default
title: Professional Self-Assessment
---

# Professional Self-Assessment

Professional Self-Assessment
I used my Travlr Getaways project to demonstrate the skills I’ve built across the CS program and how I apply them in a realistic, full-stack app. Over the capstone I moved the app from a classroom prototype toward something production-ish by tightening security, improving data handling, and adding an algorithms-driven feature that actually helps users.
Collaboration & Communication
I treated this like a small team project: I logged problems clearly (HTTP 401s, schema issues, routing mismatches), tested fixes with Postman, and documented changes in code comments and simple commit messages. I also kept the user-facing pages focused and consistent—short messages, clear buttons, and predictable flows—so someone else could pick up the app and understand how it works.
Software Engineering & Databases
I refactored backend routes and controllers (Node/Express/MongoDB) to be more predictable and secure: JWT auth with a role claim for admin-only endpoints, cleaner error handling, and a proper /api routing structure. On the data side, I corrected user schema fields (arrays vs strings), added an EventLog collection for auditable login events, and built endpoints that update user history in a controlled way (moved “add to history” from add-to-cart to checkout). On the frontend (Angular), I organized services and components, added a working search with debounced queries, and made admin/user behavior clear (e.g., hiding Similar/Recommend where it doesn’t make sense).
Data Structures & Algorithms
I implemented a simple but effective recommendation algorithm. It tokenizes trip names/resorts, builds sets of words, and scores similarity with straightforward overlap logic. Results are ranked (by score, then start date) and capped so they’re useful. It’s not ML, but it’s a clean, explainable algorithm with sensible data structures (Sets/arrays) and tradeoffs (speed, simplicity, transparency).
Security Mindset
I added TOTP-based 2FA (speakeasy) with recovery codes, rate limiting on /login, and event logging for successful/failed auth attempts. I handled edge cases (missing OTP, invalid recovery codes, clock drift via a small verification window), removed debug output, and kept secrets and token verification server-side. Role checks gate admin endpoints, and the Angular app respects the same boundaries in the UI.
Growth & Next Steps
The biggest lessons were: get the schema right, keep routes predictable, log what matters, and build features incrementally while keeping the site usable. If I had more time, I’d add automated tests, harden input validation, and refactor recommendations to support weighted fields and learned preferences. Overall, this work demonstrates the five CS outcomes in a cohesive way: I planned, communicated, implemented, secured, and iterated on a full-stack solution that delivers real value.
