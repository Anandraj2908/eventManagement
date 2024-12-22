import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/signup');
    }
    return (
        <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
            <div className="mt-16 text-center ">
            <h1 className="text-4xl font-bold sm:text-6xl">
                Create Unforgettable Events
            </h1>
            <p className="m-6 text-lg leading-8 text-gray-300">
                Plan, manage, and host amazing events with Event Manager.
                <button className="bg-indigo-600 px-6 py-3 m-6 rounded-xl text-white font-semibold hover:bg-indigo-700 transition" onClick={handleGetStarted}>
                Get Started
                </button>
            </p>
            </div>
        </main>
    )
}

export default Home;