NeighborLink
NeighborLink is a secure and user-friendly neighborhood help platform that connects people who need assistance with those willing to offer help—making local social support as easy as booking a ride. It integrates with Google Calendar to schedule and manage help events seamlessly.

Features
Secure user authentication and OAuth integration with Descope

Create, accept, and manage neighborhood help requests

Google Calendar integration for event scheduling and reminders

User rating system to build community trust

Scalable backend built with Node.js and Express

Responsive frontend built with React and TypeScript

Technologies Used
React & TypeScript

Node.js & Express

Descope (Authentication & OAuth)

Google Calendar API

dotenv for environment management

Installation
Clone the repository

bash
git clone [repository-url]
Install backend dependencies

bash
cd backend
npm install
Install frontend dependencies

bash
cd ../frontend
npm install
Create .env files in both backend and frontend with required keys (Descope tokens, Google OAuth credentials)

Running the Project
Start the backend server:

bash
cd backend
npm run start
Start the frontend app:

bash
cd frontend
npm run start
Open your browser at http://localhost:3000 to use the app.

Usage
Sign up or log in securely via Descope

Connect Google account to allow calendar access

Create or accept help requests in your neighborhood

Manage events and receive reminders via Google Calendar

Future Enhancements
Real-time chat for helpers and requesters

Location-based matching of helpers

Support for multiple calendar and communication providers
