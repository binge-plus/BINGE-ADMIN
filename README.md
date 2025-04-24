# Binge+ Movie Submission Admin Panel

## Overview
A simple web application for submitting movie details to a MongoDB database.

## Features
- Add new movies with comprehensive details
- Dynamic cast member input
- MongoDB integration

## Prerequisites
- Node.js
- MongoDB

## Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   MONGODB_URL=mongodb://localhost:27017/binge_movies
   PORT=3000
   ```

## Running the Application
- Development mode: `npm run dev`
- Production mode: `npm start`

## API Endpoints
- `POST /movies`: Submit a new movie
- `GET /movies`: Retrieve all movies

## Technologies
- Express.js
- Mongoose
- MongoDB
