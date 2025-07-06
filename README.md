# Learning Webdev

![HTML](https://img.shields.io/badge/HTML5-Complete-orange?logo=html5)
![CSS](https://img.shields.io/badge/CSS3-Complete-blue?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6_Complete-yellow?logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-Complete-green?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express.js-Complete-gray?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Used-in-blue?logo=postgresql)
![MongoDB](https://img.shields.io/badge/MongoDB-Used-in-brightgreen?logo=mongodb)
![React](https://img.shields.io/badge/React-Complete-61dafb?logo=react)
![DApps](https://img.shields.io/badge/DApps-Built-black?logo=ethereum)

## Introduction

This repository documents my journey through Web Development. The primary reference for this journey is [The Complete Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/). The journey covers multiple facets of webdev, going from frontend to backend, and touching on some concepts of decentralized applications on the web.
I had some experience with Web Development prior to this, but I decided to embark on this from base level as a test.

## 🧰 Development Environment

-   **Editor:** VS Code
-   **Browser:** Chrome
-   **Languages/Frameworks:** HTML5, CSS3, JS (ES6), Node.js, Express.js, React
-   **Package Manager:** npm
-   **Databases:** PostgreSQL, MongoDB
-   **Other Tools:** nodemon, EJS, MongoDB Compass, pgAdmin, DFX (for DApps)

## 📊 Progress Tracker

### Primary Course Progress

-   ![Course](https://img.shields.io/badge/Progress-100%25-orange)
-   **Current Status:** Complete

### Repository Progress

-   ![Repo](https://img.shields.io/badge/Status-Ongoing-blue)
-   **Last Updated(Readme):** Jul 6, 2025
-   **Current Status:** Continuous Updates

## 🤯 Learning Progress

-   **✅ Day 1-3:** HTML
-   **✅ Day 3-9:** CSS and Bootstrap
-   **✅ Day 10-12:** JavaScript and jQuery
-   **✅ Day 13-16:** Node.JS, Express.JS, EJS
-   **✅ Day 17-20:** Database(PostgreSQL and MongoDB) and Authentication
-   **✅ Day 21-24:** React
-   **✅ Day 25-27:** DApps with Dfinity's Internet Computer
-   **▶️ Day 28 onwards:** Other learning

> _Note:_ The progress over all days in terms of learning output is recorded in progress.txt located at this level

## 🖼️ Projects Included

### 1. HTML

-   **Movie Ranking** [(Day 2)](./day%202%20-%20html%20elements/2.2%20Movie%20Ranking%20Project/)
-   **Portfolio** [(Day 3)](./day%203%20-%20html%20and%20css/3.3%20HTML%20Porfolio%20Project/)

### 2. CSS

-   **Motivational Meme** [(Day 5)](./day%205%20-%20css%20box%20model/5.2%20Motivation%20Meme%20Project/)
-   **Web Design Agency** [(Day 7)](./day%207%20-%20css%20responsiveness/7.4%20Web%20Design%20Agency%20Project/)
-   **Flexbox Pricing Table** [(Day 8)](./day%208%20-%20css%20flex%20and%20grid/8.2%20Flexbox%20Pricing%20Table%20Project/)
-   **Mondrian Painting** [(Day 9)](./day%209%20-%20css%20and%20bootstrap/9.2%20Mondrian%20Project/)
-   **Personal Site** [(Day 9)](./day%209%20-%20css%20and%20bootstrap/9.5%20Capstone%20-%20Personal%20Website/)

### 3. Vanilla JS

-   **Dicee Game** [(Day 11)](./day%2011%20-%20javascript%20dom/11.3%20Dicee%20Game%20Challenge/)
-   **The Simon Game** [(Day 12)](./day%2012%20-%20javascript%20and%20jQuery/12.3%20The%20Simon%20Game/)

### 4. ExpressJS and Database

-   **Band Name Generator** [(Day 14)](./day%2014%20-%20expressjs%20ejs/14.8%20Band%20Generator%20Project/)
-   **Blog Page** [(Day 15)](./day%2015%20-%20backend%20and%20api/15.1%20Capstone%20Blog%20Project/)
-   **Random Anime Picture** [(Day 16)](./day%2016%20-%20api%20capstone/16.1%20Capstone%20API%20Project/)
-   **Blog API** [(Day 17)](./day%2017%20-%20database/17.1%20Blog%20API%20Project/)
-   **Family Travel Tracker** [(Day 18)](./day%2018%20-%20database/18.1%20Relationships/Family%20Travel%20Tracker/)
-   **Book Review Page** [(Day 19)](./day%2019%20-%20database/19.2%20Book%20Review%20Capstone/)
-   **Secret Sharing** [(Day 20)](./day%2020%20-%20authentication%20and%20mongodb/20.1%20Secrets%20Project/)

### 5. React

-   **To-Do List** [(Day 23)](./day%2023%20-%20react/23.6%20ToDo%20List%20Project%20and%20Managing%20Component%20Tree/)
-   **Note Keeper** [(Day 24)](./day%2024%20-%20react%20and%20DApp/24.1%20Keeper%20App%20Final/)

### 6. Decentralized Apps

-   **Decentralized Bank** [(Day 25)](./day%2025%20-%20building%20DApps/dbank/)
-   **Decentralized Tokens** [(Day 26)](./day%2026%20-%20ICP%20Token%20and%20NFT%20Marketplace/)
-   **NFT Marketplace** [(Day 27)](./day%2027%20-%20NFT%20Marketplace/)

### Next Steps

> Larger, more self-contained projects, those that deserve their own repositories

## 📂 Repository Structure

The repository is divided into folders for each day of learning. Some days cover multiple modules from the course, some might not cover a single module completely (like the React module which is split to 4 days). The structure follows:

-   A **folder for each day** of learning. A single day might cover a vast array of topics, or just a few.
    -   day 1 - html
    -   ...
-   A `progress.txt` file:
    -   This will be updated daily after completing tasks for the day.
    -   It summarizes what has been done so far on that particular day and helps keep myself accountable.
-   This **README.md** file.

## 🏃‍➡️ How To Run

### **Step 1:** Clone the repo

```bash
git clone https://github.com/aruncbhusal/learning-webdev.git
```

### **Step 2:**

#### a. For HTML, CSS and vanilla JS files (day 1-11)

These files can simply be opened on the browser from the project directory. Some files may have multiple associations. The source code can be visited in such cases

#### b. For ExpressJS (day 13-20)

These have node_modules folder inside each project folder (light enough because of low number of dependencies). We can run the project using `npm start`. If not available/outdated, try:

```bash
nodemon index.js
```

#### c. For React and DApps (day 20-27)

The node modules folder is too large to include for each instance. Before running the program, ensure you are in the project folder and install before running. From the root git directory (example):

```bash
cd "day 22 - react/22.9 useState hook Timer Challenge"
npm install
npm start
```

> For DApps: follow the markdown files in day 24 and 25 folders as there are multiple steps

### 🗓️ Timeline

| Date                      | Event          | Remarks                                             |
| ------------------------- | -------------- | --------------------------------------------------- |
| 10 Magh, 2081 (23/1/2025) | **Started**    | Started while on a break                            |
| 19 Magh, 2081 (1/2/2025)  | **Paused**     | Halted the project to be continued later            |
| 3 Ashad, 2082 (17/6/2025) | **Resumed**    | Resumed from day 8 as a part of 60 Days of Learning |
| 22 Ashad, 2082 (6/7/2025) | **Checkpoint** | Completed the primary course, onto others           |

## 📝 License

This project is licensed under the [MIT License](./LICENSE).
