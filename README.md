# Social Media App

## Project Overview
This project is a simplified social media platform that allows users to interact by creating profiles, posting content, and reacting to posts. The application is built using a Flask backend and a React frontend, with MongoDB as the database.

## Features
- **User Authentication**: Secure login and signup functionality.
- **User Profiles**: Users can create and update their profiles, including name, profile picture, and bio.
- **Post Creation and Feed**: Users can create and publish posts, and view a global feed of posts from other users.
- **Post Reactions**: Users can like posts multiple times, with the total number of likes stored for each post.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Flask
- **Database**: MongoDB

## Project Structure
```
social-media-app
├── backend
│   ├── app.py
│   ├── models.py
│   ├── requirements.txt
│   └── routes
│       ├── auth.py
│       ├── posts.py
│       └── users.py
├── frontend
│   ├── package.json
│   ├── public
│   │   └── index.html
│   └── src
│       ├── App.js
│       ├── index.js
│       └── components
│           ├── Feed.js
│           ├── Login.js
│           ├── Post.js
│           ├── Profile.js
│           └── Signup.js
└── README.md
```

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage
- Visit the frontend application in your browser to create an account, log in, and start interacting with the platform.
- Users can create posts, view the global feed, and manage their profiles.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.