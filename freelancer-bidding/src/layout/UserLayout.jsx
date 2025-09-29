import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserLayout = ({ children, userRole }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar userRole={userRole} />
      
      {/* Main Content */}
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
