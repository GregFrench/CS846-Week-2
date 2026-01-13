import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login setUser={setUser} setToken={setToken} />;
  }

  return (
    <Router>
      <div style={styles.app}>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.logo}>
            <h1>🐦 MicroBlog</h1>
          </Link>
          <div style={styles.navRight}>
            <Link to={`/profile/${user?.id}`} style={styles.navLink}>
              {user?.username}
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e1e8ed',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logo: {
    textDecoration: 'none',
    color: '#1DA1F2',
  },
  navRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#1DA1F2',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default App;
