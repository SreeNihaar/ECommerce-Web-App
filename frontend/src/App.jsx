import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './components/route/router.jsx';
import Loading from './components/Loading.jsx';
import { CheckoutProvider } from './context/CheckoutContext.jsx';
import { PaginationProvider } from './context/PaginationContext.jsx';
import ErrorBoundary from './components/errors/ErrorBoundary.jsx';

function App() {

  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <CheckoutProvider>
            <PaginationProvider>
              <RouterProvider router={router}></RouterProvider>
            </PaginationProvider>
          </CheckoutProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App;
