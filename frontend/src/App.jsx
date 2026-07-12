import React from 'react';
import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {

  return (
    <div className="App">
      {/* <Navbar />
      <Home />
      <Footer /> */}
      <Login />
      {/* <SignUp /> */}
    </div>
  )
}

export default App;


