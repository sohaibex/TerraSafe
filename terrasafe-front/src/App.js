import {
  Route,
  Routes,
} from "react-router-dom";

import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';


function App() {
  return (
    <>
      <Header />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
