import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AppProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
