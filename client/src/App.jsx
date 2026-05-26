import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import {signInWithPopup} from 'firebase/auth'
import { auth, provider } from './utils/firebase.js'

function App() {
  return (
   <Routes>
     <Route path='/' element={<Home />} /> // when the user visits the root path '/', the Home component will be rendered. This means that when the user navigates to the base URL of the application, they will see the content defined in the Home component.
     <Route path='/auth' element={<Auth />} /> // when the user visits the '/auth' path, the Auth component will be rendered.
   

   </Routes>
  )
}

export default App