import React from 'react'
import { motion } from "motion/react"
import { auth, provider } from '../utils/firebase.js';
import { signInWithPopup } from "firebase/auth";


function Auth() {

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
       console.log(result.user);
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
