import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { CAFFFile, DefaultCaffs, defaultCaff, User } from './appProps';
import BrowsePage from './components/BrowsePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import { backendURL } from './globalVars';

const App = () => {
  const [user, setUser] = useState<User>({Email: '', Token: ''});
  const [caffs, setCaffs] = useState([defaultCaff]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCAFFPreviews();
        if(response.ok) {
          const caffResponse: CAFFFile[] = await response.json();
          setCaffs(caffResponse);
        } else {
          setCaffs(DefaultCaffs);
        }
      } catch (error) {
        setCaffs(DefaultCaffs);
        console.error(error);
      }
    };
 
    fetchData(); 
  }, [])

  const getCAFFPreviews = async () => {
    const response = await fetch(backendURL + '/caff/preview', {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      }
    });
    return response;
  };

  const addCaffToList = async (caff: CAFFFile) => {
    setCaffs([...caffs, caff]);
  };

  return (
    <div className="App">  
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage LoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="register" element={<RegisterPage LoggedIn={isLoggedIn} />} />
          <Route path="/" element={<BrowsePage CAFFs={caffs} loggedIn={isLoggedIn} user={user} token={user.Token} addCaffToList={addCaffToList}/>} />
          <Route path="profile" element={<ProfilePage User={user} LoggedIn={isLoggedIn} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
