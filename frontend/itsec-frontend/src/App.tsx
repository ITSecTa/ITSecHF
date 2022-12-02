import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppUser, CAFFs, defaultCaff } from './appProps';
import BrowsePage from './components/BrowsePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  const [user, setUser] = useState({ Name: "", Password: ""});
  const [caffs, setCaffs] = useState([defaultCaff]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setUser(AppUser);
    setCaffs(CAFFs);
  });

  return (
    <div className="App">  
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/" element={<BrowsePage CAFFs={caffs} loggedIn={isLoggedIn} user={user}/>} />
          <Route path="profile" element={<ProfilePage User={user}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
