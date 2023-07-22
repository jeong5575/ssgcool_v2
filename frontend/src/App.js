import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/views/LoginPage/LoginPage';
import Footer from './components/views/Footer/Footer';
import NavBar from './components/views/NavBar/NavBar';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LandingPage from './components/views/LandingPage/LandingPage';
import Auth1 from './hoc/Auth1';
import DashBoardPage from './components/views/DashBoardPage/DashBoardPage';
import Boardpage from './components/views/Board/Boardpage';
import PostBoardPage from './components/views/Board/PostBoardPage';
import PostDetailPage from './components/views/Board/PostDetailPage';

function App() {
  return (
    <Router>
      <div>
    <Routes>
      <Route path="/" exact element={Auth1(LandingPage,false)} />
      <Route path="/login" element={Auth1(LoginPage)} />
      <Route path="/register" element={Auth1(RegisterPage)} />
      <Route path="/dashboard" element={Auth1(DashBoardPage,true)} />
      <Route path="/board" element={Auth1(Boardpage,true)} />
      <Route path="/postboard" element={Auth1(PostBoardPage,true)} />
      <Route path="/postdetail" element={Auth1(PostDetailPage,true)} />
     
    </Routes>
    </div>
  </Router>
  );
}

export default App;
  