import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
