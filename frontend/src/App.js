import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Chatpage from "./components/Chatpage";
import Homepage from "./components/Homepage";
import ChatProvider from './Context/ChatProvider';
import SignUp from './components/Authentication/Signup';
import Login from './components/Authentication/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <div className='container-fluid'>
        <Routes>
         <Route path="/" element={<Homepage/>}/>
         <Route path="/chat" element={<Chatpage/>} />
         <Route path="/" element={<SignUp/>} />
         <Route path="/" element={<Login/>} />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
