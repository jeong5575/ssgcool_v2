import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/views/LoginPage/LoginPage';
import Footer from './components/views/Footer/Footer';
import NavBar from './components/views/NavBar/NavBar';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import LandingPage from './components/views/LandingPage/LandingPage';
import Auth1 from './hoc/Auth1';
import DashBoardPage from './components/views/DashBoardPage/DashBoardPage';

function App() {
  return (
    <Router>
      <div>
    <Routes>
      <Route path="/" exact element={Auth1(LandingPage,false)} />
      <Route path="/login" element={Auth1(LoginPage)} />
      <Route path="/register" element={Auth1(RegisterPage)} />
      <Route path="/dashboard" element={Auth1(DashBoardPage,true)} />
    </Routes>
    </div>
  </Router>
  );
}

export default App;
  