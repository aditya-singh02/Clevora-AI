import React, { useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import axios from 'axios';


export const ServerURL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function App() {

  useEffect(() => { 
    const getUser = async () => {
      try{
        const response = await axios.get(`${ServerURL}/api/v1/user/current-user`, 
          { withCredentials: true });
        console.log(response.data.data); // Log the response from the backend to see the current user details.
      }catch(error){
        console.error("Error fetching current user details:", error);
      }
    } 
    getUser();  
  }, [])

  return (
   <Routes>
     <Route path='/' element={<Home />} /> // when the user visits the root path '/', the Home component will be rendered. This means that when the user navigates to the base URL of the application, they will see the content defined in the Home component.
     <Route path='/auth' element={<Auth />} /> // when the user visits the '/auth' path, the Auth component will be rendered.
   

   </Routes>
  )
}

export default App