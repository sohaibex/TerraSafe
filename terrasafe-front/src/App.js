import {
  Route,
  Routes,
} from "react-router-dom";

import Header from './components/header';
import Login from './components/login';
import Signup from './components/signup';
import Home from './pages/home';


function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;
