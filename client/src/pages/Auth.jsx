import React from 'react'
import { motion } from "motion/react"
import { auth, provider } from '../utils/firebase.js';
import { signInWithPopup } from "firebase/auth";
import axios from 'axios';
import { ServerURL } from '../App.jsx';
import { useDispatch } from 'react-redux';


function Auth() {

  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      let User = response.user; // The authenticated user's information returned by Firebase Authentication after a successful sign-in with Google.
      let name = User.displayName;
      let email = User.email;

      // Send the user's name and email to the backend server for authentication and token generation.
      const result = await axios.post(`${ServerURL}/api/v1/auth/google`,
        { name, email }, { withCredentials: true });
      dispatch(setUserData(result.data))

    } catch (error) {
      console.error("Error during Google authentication:", error);
      dispatch(setUserData(null))
    }
  }

  return (
    <div>
      <button onClick={handleGoogleAuth}>Sign in with Google</button>
    </div>
  )
}

export default Auth
