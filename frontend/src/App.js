import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Userdashboard from './Components/Userdashboard';
import Home from './Home';
import { ToastContainer } from 'react-toastify';
import Login from './Login';
import SearchDogs from './Components/SearchDogs';

function App() {
  return (
    <>

    <div className="App">
         <BrowserRouter>
         <ToastContainer />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/Userdashboard" element={<Userdashboard />}>
                    <Route path="SearchDogs" element={<SearchDogs />} />
                    </Route>
                    
                </Routes>
                </BrowserRouter>
        </div>
    
       </>
  );
}

export default App;
