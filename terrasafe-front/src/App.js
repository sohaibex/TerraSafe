import {
  Route,
  Routes,
} from "react-router-dom";

import Header from './components/header';
import Login from './components/login';
import Signup from './components/signup';
import Home from './pages/home';
import About from './pages/about';


function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
