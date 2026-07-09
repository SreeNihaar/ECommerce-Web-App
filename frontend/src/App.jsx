import React from 'react';
import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {

  return (
    <div className="App">
      <Navbar />
      <Home />
      <Footer />
    </div> 
  )
}

export default App
