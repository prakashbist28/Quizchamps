
# QuizChamps

A full-stack quiz platform where users can create, manage, discover, and attempt quizzes while tracking their performance through detailed analytics and attempt history.

---

## Links

* Live = [https://quizchamps.vercel.app/] . Initially server might take time to respond please be patient.


## Features

### Authentication & User Accounts

* User Registration
* User Login & Logout
* JWT-based Authentication
* Protected Routes
* Profile Management
* Avatar Upload Support
* Default Avatar Selection
* Change Password Functionality

---

### Home Page

* Modern Landing Page
* Interactive Carousel
* Light & Dark Mode Support
* Quick Access to Quiz Creation and Quiz Discovery

---

### Quiz Creation

Authenticated users can create and manage quizzes with:

* Quiz Title
* Quiz Description
* Category Selection
* Difficulty Selection (Easy, Medium, Hard)
* Public / Private Visibility
* Unlimited Questions
* Multiple Options per Question
* Correct Answer Selection
* Per-Question Timer
* Optional Answer Explanations

---

### Quiz Management

* My Quizzes Dashboard
* Edit Owned Quizzes
* Delete Owned Quizzes
* Visibility Controls
* Public and Private Quizzes

---

### Quiz Discovery

* Search Quizzes
* Filter by Category
* Filter by Difficulty
* Public / Private Quiz Filtering
* Dedicated Access to User's Private Quizzes
* Category-Themed Quiz Cards

Supported Categories:

* JavaScript
* React
* Node.js
* HTML
* CSS
* Science
* History
* General Knowledge

---

### Quiz Attempt System

* Timed Quiz Attempts
* Automatic Result Calculation
* Persistent Attempt Storage
* Detailed Attempt Records
* User-Specific Attempt History

---

### Analysis Report

After quiz completion users can view:

* Final Score
* Percentage Score
* Correct Answers
* Incorrect Answers
* Question-by-Question Analysis
* User Answer vs Correct Answer
* Answer Explanations

---

### User Dashboard

Track learning progress with:

* Total Quizzes Taken
* Total Quizzes Created
* Average Score
* Best Score
* Recent Activity
* Attempt History

---

### Creator Analytics

Quiz creators can view:

* Total Attempts
* Average Score
* Highest Score
* Lowest Score
* Completion Count

---

### Celebration System

Performance-based completion screens:

* 100% Score
* 75–99% Score
* 50–74% Score
* Below 50% Score

Each range displays unique animations, emojis, and feedback messages.

---

### Theme Support

* Light Mode
* Dark Mode
* Responsive Design

---

### Performance Optimizations

* Reusable Components
* Context API
* Lazy Loading
* Route-Based Code Splitting
* Reduced Code Duplication
* Improved Maintainability

---

## Tech Stack

### Frontend

* React.js
* Context API
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Tokens)

---

## Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd quizchamps
```

### Install Dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run Development Servers

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

---
















  

  

