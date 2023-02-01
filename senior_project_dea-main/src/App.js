import './App.css';
import MyNavbar from './components/Navbar';
import MyWelcomePage from './components/Welcome';
import LearnPage from './components/Learn';
import GamePage from './components/Game';
import ProfilePage from './components/Profile';
import { Routes, Route } from "react-router-dom"
import Login from './components/Login'
import SignUp from './components/SignUp'
import Logout from './components/Logout'
import UserInfo from './components/UserInfo'
import Admin from './components/Admin'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useLocation } from 'react-router-dom';
import QuestionCRUD from './components/QuestionCRUD';
import { useEffect } from 'react';


function App() {
  
  const { pathname } = useLocation();

  useEffect(() => {
    async function getAdminStatus() {
      fetch("http://localhost:5000/checkPrivileges", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
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
