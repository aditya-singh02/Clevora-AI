import React from 'react'
import { motion } from "motion/react"
import { auth, provider } from '../utils/firebase.js';
import { signInWithPopup } from "firebase/auth";
import axios from 'axios';
import { ServerURL } from '../App.jsx';


function Auth() {

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      let User = response.user; // The authenticated user's information returned by Firebase Authentication after a successful sign-in with Google.
      let name = User.displayName;
      let email = User.email;

      // Send the user's name and email to the backend server for authentication and token generation.
      const result = await axios.post(`${ServerURL}/api/v1/auth/google`,
        { name, email }, { withCredentials: true });

      console.log(result.data.data); // Log the response from Firebase Authentication to see the user information and credentials returned after a successful sign-in.

    } catch (error) {
      console.error("Error during Google authentication:", error);
    }
  }

  return (
    <div>
      <button onClick={handleGoogleAuth}>Sign in with Google</button>
    </div>
  )
}

export default Auth
