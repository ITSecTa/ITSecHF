import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppUser } from './appProps';
import BrowsePage from './components/BrowsePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  const [user, setUser] = useState({ Name: "", Password: ""});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setUser(AppUser);
  });

  return (
    <div className="App">  
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/" element={<BrowsePage setUser={setUser}/>} />
          <Route path="profile" element={<ProfilePage User={user}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
