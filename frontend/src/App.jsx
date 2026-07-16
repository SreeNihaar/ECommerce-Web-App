import React, { Suspense } from 'react';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import router from './components/route/router.jsx';
import Loading from './components/Loading.jsx';

function App() {

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router}></RouterProvider>
      </Suspense>
    </div> 
  )
}

export default App;
