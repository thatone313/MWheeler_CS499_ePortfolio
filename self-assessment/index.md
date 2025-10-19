---
layout: default
title: Professional Self-Assessment
---

<link rel="stylesheet" href="../assets/css/custom.css">

# Program Reflection and Introduction

Throughout the computer science program, each course has helped me build and strengthen the technical and professional skills that shaped both my career goals and personal values. The projects, labs, and team collaborations provided hands-on experiences that prepared me to apply my knowledge confidently in the workplace. Developing this ePortfolio has allowed me to bring together those skills to demonstrate my growth and readiness to contribute meaningfully to the computer science field.

Collaboration and communication have been central to my success in this program. Working on group assignments and peer reviews taught me how to exchange ideas, track progress, and use tools such as GitHub and Trello to stay organized. These experiences reinforced the importance of clear documentation, version control, and constructive feedback when working within a team or reporting to stakeholders. Outside of class, my professional work with Xfinity and in my construction business also strengthened my ability to communicate technical issues to nontechnical audiences, ensuring that projects stay on track and clients remain informed.

Through courses such as CS-260 and CS-340, I gained a strong foundation in **data structures and algorithms**, learning how efficiency, scalability, and accuracy directly affect system performance. Applying these principles to my later projects—particularly the recommendation algorithm in **Travlr Getaways**—helped me understand how to select the right approach for real-world constraints. My **software engineering** experience deepened in CS-465, where I learned full-stack development and modern design patterns to create maintainable, modular applications. In **database management**, I built and optimized schemas using MongoDB, applied normalization and indexing, and implemented secure data handling practices. Finally, the coursework in **computer systems security** (IT-253) and my professional experience with network controls and firewalls helped me develop a strong **security mindset** focused on risk mitigation, encryption, and safe authentication.

Together, these experiences have helped me identify my strengths in problem-solving, system design, and secure development while reinforcing values of integrity, accountability, and continuous learning. The artifacts that follow demonstrate these capabilities in action, showing how I combine technical skill with professional discipline to deliver effective, reliable solutions. Collectively, they tell the story of my progression from student to confident professional, ready to advance in the computer science field.

> I want to thank my professors and mentors for their guidance and patience as I worked through these final two classes while managing life’s challenges, including the recent loss of my father. Their encouragement helped me finish strong and stay focused on my goal of completing this degree.

---

# Professional Self-Assessment

I used my **Travlr Getaways** project to demonstrate the skills I have built across the Computer Science program and how I apply them in a realistic, full-stack environment. Over the capstone, I moved the app from a classroom prototype toward something production-ready by tightening security, improving data handling, and adding an algorithm-driven feature that provides meaningful recommendations to users.

![Travlr Getaways Homepage](../artifacts/software-design/images/TravlrHomePage.jpg)
*Homepage view of the Travlr Getaways web application.*

---

## Collaboration and Communication

I approached this project as if I were part of a small development team. I logged problems clearly, tested fixes with Postman, and documented changes in code comments and commit messages. I also kept the user-facing pages simple and consistent with clear messages, predictable navigation, and focused content so that another developer or user could easily understand the system. This aligns with the **Professional Communication** outcome because I documented progress clearly and communicated updates in ways that supported collaboration and continuity.

---

## Software Engineering and Databases

I refactored backend routes and controllers using Node, Express, and MongoDB to make the system more predictable and secure. I implemented JSON Web Token (JWT) authentication with a role claim for admin-only endpoints, improved error handling, and organized all routes under a dedicated `/api` structure. On the database side, I redefined schema fields, added an **EventLog** collection for audit tracking, and built endpoints that manage user history in a controlled way. On the front end, I organized Angular services, implemented a responsive search with debounced queries, and clearly separated admin and user functionality.

---

## Data Structures and Algorithms

I implemented a simple but effective recommendation algorithm that tokenizes trip names and resorts, builds sets of words, and scores similarity through overlap logic. The results are ranked by score and start date to ensure relevance. I kept the logic simple and efficient by using set operations and pattern matching, which maintained fast and predictable performance even as data volumes increased. This balance of speed, accuracy, and simplicity demonstrates strong algorithmic reasoning and attention to scalability.

---

## Security Mindset

Security was a major focus throughout my capstone project. I added **TOTP-based two-factor authentication (2FA)** using the Speakeasy library, created secure recovery codes, and implemented **rate limiting** on the login route to prevent brute-force attacks. I handled potential edge cases like missing or invalid codes and time drift, kept all verification logic server-side, and enforced role-based access both in the backend and within the Angular UI. These changes demonstrate the strong **security mindset** I developed throughout IT-253 and CS-465, with a focus on proactive protection and risk awareness.

---

## Growth and Next Steps

This experience taught me the importance of designing schemas correctly, keeping routes predictable, logging meaningful events, and implementing new features gradually while maintaining usability. If I had additional time, I would add automated testing, strengthen input validation, and evolve the recommendation algorithm with adaptive learning or weighted scoring. Overall, this project demonstrates all five **Computer Science program outcomes** cohesively: I planned, communicated, implemented, secured, and iterated on a full-stack system that delivers real-world value.

---

## Final Project Download

- [**Travlr Getaways – Full Final Version (Google Drive)**](https://drive.google.com/file/d/1ntbJnwLSFvVU1hsqGzuvbalb1Zog1KmY/view?usp=drive_link)


