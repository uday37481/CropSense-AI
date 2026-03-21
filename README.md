
# CropSense AI

CropSense AI is a modern full-stack application designed for farmers to manage their crops efficiently using data-driven insights.

## Features

- **User Authentication**: Secure login and registration for farmers.
- **Crop Management**: Add, view, and track crops planted in the farm.
- **Executive Dashboard**: Real-time monitoring of regional agricultural metrics.
- **Modern UI**: Clean, professional, and responsive interface.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, and a React-based Dashboard.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.
- **Security**: JWT (JSON Web Tokens) for session handling and bcryptjs for password hashing.

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB running locally or on Atlas.

### Installation

1. Clone the repository.
2. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
3. Install dependencies for the dashboard:
   ```bash
   cd frontend/dashboard
   npm install
   ```
4. Set up your `.env` file in the `server` folder with your `MONGO_URI` and `JWT_SECRET`.

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
2. Start the dashboard (optional):
   ```bash
   cd frontend/dashboard
   npm run dev
   ```
3. Open `frontend/index.html` in your browser to access the main application.

## License

This project is licensed under the ISC License.
