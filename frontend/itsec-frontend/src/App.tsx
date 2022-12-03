import { SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppUser, CAFFs, defaultCaff, User } from './appProps';
import BrowsePage from './components/BrowsePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  const [user, setUser] = useState<User>({Email: '', Token: ''});
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
          <Route path="login" element={<LoginPage LoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="register" element={<RegisterPage LoggedIn={isLoggedIn} />} />
          <Route path="/" element={<BrowsePage CAFFs={caffs} loggedIn={isLoggedIn} user={user}/>} />
          <Route path="profile" element={<ProfilePage User={user} LoggedIn={isLoggedIn}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
