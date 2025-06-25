import React from 'react';
import Router from './router/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router />
      <ToastContainer position="top-right" autoClose={3000} />
      
    </>
  );
}

export default App;
