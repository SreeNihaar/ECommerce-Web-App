import { Suspense } from 'react';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import router from './components/route/router.jsx';
import Loading from './components/Loading.jsx';
import { CheckoutProvider } from './context/CheckoutContext.jsx';
import { PaginationProvider } from './context/PaginationContext.jsx';

function App() {

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <CheckoutProvider>
          <PaginationProvider>
            <RouterProvider router={router}></RouterProvider>
          </PaginationProvider>
        </CheckoutProvider>
      </Suspense>
    </div> 
  )
}

export default App;
