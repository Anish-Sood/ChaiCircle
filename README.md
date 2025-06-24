# ChaiCircle - Social Media Platform

## Project Overview
ChaiCircle is a full-stack social media platform that allows users to connect, share thoughts, and interact with each other's content. Built with modern web technologies, it provides a clean and intuitive interface for social networking.

## 🌟 Key Features Implemented

### User Authentication & Management
- **Secure Registration**: Users can create accounts with email verification
- **Login System**: JWT-based authentication with persistent sessions
- **Profile Management**: Users can update their profile information, bio, and profile pictures
- **Profile Picture Upload**: Integration with Cloudinary for image storage

### Content Creation & Management
- **Post Creation**: Users can create text posts with optional image attachments
- **Image Upload**: Seamless integration with Cloudinary for media storage
- **Character Limit**: 500 character limit for posts with real-time counter
- **Post Deletion**: Users can delete their own posts

### Social Interactions
- **Global Feed**: View all posts from users in chronological order
- **Like System**: Users can like posts (multiple likes allowed)
- **User Posts**: Dedicated section to view individual user's posts
- **Real-time Updates**: Dynamic content loading and updates

### User Interface & Experience
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Modern UI**: Clean, Twitter-inspired design with smooth interactions
- **Loading States**: Skeleton loading screens for better user experience
- **Modal Dialogs**: Elegant modals for post creation and confirmations

## 🛠 Technologies Used

### Frontend
- **React.js** (v17.0.2) - JavaScript library for building user interfaces
- **React Router DOM** (v5.2.0) - Client-side routing
- **React Icons** (v5.5.0) - Icon library for UI components
- **CSS3** - Custom styling with CSS variables for theming
- **HTML5** - Semantic markup

### Backend
- **Flask** - Python web framework
- **Flask-JWT-Extended** - JWT token management
- **Flask-CORS** - Cross-origin resource sharing
- **MongoEngine** - MongoDB object-document mapper
- **bcrypt** - Password hashing
- **Python-dotenv** - Environment variable management

### Database & Cloud Services
- **MongoDB Atlas** - Cloud database for user and post data
- **Cloudinary** - Image storage and optimization service

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **pip** - Python package management

## 📁 Project Structure
```
social-media-app/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── models.py              # Database models (User, Post)
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (not in repo)
│   └── routes/
│       ├── auth.py           # Authentication routes
│       ├── posts.py          # Post management routes
│       └── users.py          # User management routes
├── frontend/
│   ├── package.json          # npm dependencies and scripts
│   ├── .env                  # React environment variables
│   ├── public/
│   │   ├── index.html        # HTML template
│   │   ├── logo.png          # Application logo
│   │   └── manifest.json     # PWA manifest
│   └── src/
│       ├── App.js            # Main React component
│       ├── App.css           # Global styles and theme variables
│       ├── index.js          # React DOM entry point
│       ├── config/
│       │   └── api.js        # API configuration
│       ├── context/
│       │   └── AuthContext.js # Authentication context
│       └── components/
│           ├── Auth.css      # Authentication styles
│           ├── CreatePost.js # Post creation component
│           ├── CreatePost.css
│           ├── Feed.js       # Main feed component
│           ├── Login.js      # Login form
│           ├── Modal.js      # Reusable modal component
│           ├── Post.js       # Individual post component
│           ├── Post.css
│           ├── Profile.js    # User profile management
│           ├── Profile.css
│           ├── Sidebar.js    # Navigation sidebar
│           ├── Sidebar.css
│           ├── Signup.js     # Registration form
│           ├── SkeletonPost.js # Loading skeleton
│           ├── ThemeToggle.js  # Theme switcher
│           └── UserPosts.js    # User's posts display
└── README.md
```

## 🚀 Project Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **MongoDB Atlas** account
- **Cloudinary** account

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**
   ```bash
   # Create .env file in backend directory
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

5. **Run the Flask application:**
   ```bash
   python app.py
   ```
   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install npm dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file in frontend directory
   REACT_APP_API_BASE_URL=http://localhost:5000
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start the React application:**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET_KEY=your-super-secret-jwt-key
```

#### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🌐 Deployment

### Backend (Render)
- **Live URL**: https://chaicircle-backend-6s0c.onrender.com
- Deployed using Render's web service
- Environment variables configured in Render dashboard

### Frontend (Render)
- Deployed as a static site
- Environment variables configured for production API endpoints

## 📱 Usage Instructions

1. **Registration**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Profile Setup**: Update your profile information and upload a profile picture
4. **Create Posts**: Share your thoughts with text and optional images
5. **Browse Feed**: View posts from all users on the home page
6. **Interact**: Like posts and view user profiles
7. **Manage Content**: Delete your own posts from your profile page
8. **Theme Toggle**: Switch between light and dark modes

## ⚠️ Limitations & Known Issues

### Current Limitations
- **File Size Limits**: Image uploads limited by Cloudinary free tier (10MB)

### Known Issues
- **Mobile Responsiveness**: Some UI elements may need refinement on smaller screens
- **Error Handling**: Limited error messages for network failures

## 📄 License

This project is created for educational purposes as part of a Future University assignment.

## 👨‍💻 Developer

**Anish Sood**
- GitHub: [@Anish-Sood](https://github.com/Anish-Sood)
- Project Repository: [ChaiCircle](https://github.com/Anish-Sood/ChaiCircle)

---