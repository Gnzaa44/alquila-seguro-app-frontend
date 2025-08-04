import React from 'react';
import Navbar from '../components/navbar/NavBar'; 
import Footer from '../components/footer/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar /> 
            <main className="flex-fill container mt-4 mb-5"> 
                {children} 
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;