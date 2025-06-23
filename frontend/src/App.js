import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Feed from './components/Feed';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Modal from './components/Modal';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [refreshFeedKey, setRefreshFeedKey] = useState(0);

  const handlePostCreated = useCallback(() => {
    setCreatePostModalOpen(false);
    setRefreshFeedKey(prevKey => prevKey + 1); 
  }, []);

  return (
    <Router>
      <Modal show={isCreatePostModalOpen} onClose={() => setCreatePostModalOpen(false)}>
        <CreatePost onPostCreated={handlePostCreated} />
      </Modal>

      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route path="/">
          <Sidebar onOpenCreatePostModal={() => setCreatePostModalOpen(true)} />
          <div className="main-content-wrapper">
            <main className="app-container">
              <Switch>
                <ProtectedRoute path="/profile" component={Profile} />
                <ProtectedRoute 
                  path="/" 
                  exact
                  render={(props) => <Feed {...props} key={refreshFeedKey} />} 
                />
              </Switch>
            </main>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;