import './css/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useLocation, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

import GetConfig from './Config.js';
import MyNavbar from './components/Navbar';
import MyWelcomePage from './components/Welcome';
import LearnPage from './components/questions/Learn';
import GamePage from './components/questions/Game';
import GameTraditionalPage from './components/questions/GameTraditional';
import GameAdventurePage from './components/questions/GameAdventure';
import ProfilePage from './components/users/Profile';
import Login from './components/users/Login'
import SignUp from './components/users/SignUp'
import Logout from './components/users/Logout'
import UserInfo from './components/users/UserInfo'
import Admin from './components/users/Admin'
import QuestionCRUD from './components/questions/QuestionCRUD';
import DragNDrop from './components/questions/dragDrop/DragNDrop';
import Matching from "./components/questions/Matching/Matching";

function App() {
  
  const { pathname } = useLocation();

  useEffect(() => {
    async function getAdminStatus() {
      fetch(GetConfig().SERVER_ADDRESS + "/users/checkPrivileges", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
        },
        body:JSON.stringify({
          token:window.localStorage.getItem("token"),
        }),
        }).then((res)=>res.json())
        .then(data=>{
          if(data.status !== 200) {
            window.location.href = "./welcome";
          }
        });
    }

    if(pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/' || pathname === '/log-out') return;
    if(window.localStorage.getItem("token") === null) {
      window.location.href = "./sign-in";
    }
    if(pathname === '/admin' || pathname === '/modify_questions') {
      getAdminStatus();
    }
  }, [pathname]);
  
  return (
    <>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
          { (pathname !== '/sign-in' && pathname !== '/sign-up' && pathname !== '/') && <MyNavbar /> }
            <Routes>
              <Route path="/welcome" element={<MyWelcomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/gameTraditional" element={<GameTraditionalPage />} />
              <Route path="/gameAdventure/:id" element={<GameAdventurePage />} />
              <Route path="/gameDND/:id" element={<DragNDrop/>} />
              <Route path="/gameMatching/:id" element={<Matching/>} />
              <Route path="/myprofile" element={<ProfilePage />} />
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-out" element={<Logout />} />
              <Route path="/userInfo" element={<UserInfo />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/modify_questions" element={<QuestionCRUD/>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default App;
