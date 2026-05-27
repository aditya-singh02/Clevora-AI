import React, { useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice.js';


export const ServerURL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function App() {

  const dispatch = useDispatch(); // useDispatch is a hook provided by react-redux that allows you to dispatch actions to the Redux store. It returns a reference to the dispatch function from the Redux store, which you can use to send actions that will update the state in the store.

  useEffect(() => { 
    const getUser = async () => {
      try{
        const response = await axios.get(`${ServerURL}/api/v1/user/current-user`, 
          { withCredentials: true });
        dispatch(setUserData(response.data)); // Dispatch the setUserData action with the fetched user data to update the Redux store.
      }catch(error){
        console.error("Error fetching current user details:", error);
        dispatch(setUserData(null)); // If there's an error fetching the user data, dispatch setUserData with null to clear any existing user data in the Redux store.
      }
    } 
    getUser();  
  }, [dispatch])

  return (
   <Routes>
     <Route path='/' element={<Home />} /> // when the user visits the root path '/', the Home component will be rendered. This means that when the user navigates to the base URL of the application, they will see the content defined in the Home component.
     <Route path='/auth' element={<Auth />} /> // when the user visits the '/auth' path, the Auth component will be rendered.
   

   </Routes>
  )
}

export default App