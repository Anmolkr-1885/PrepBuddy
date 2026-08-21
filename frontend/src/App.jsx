import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignIn, UserAvatar,SignOutButton, SignInButton } from '@clerk/react'

function App() {
  

  return (
    <>
    <h1>Welcome to the App</h1>
    <SignInButton/>

    </>
  )
}

export default App
