import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import {logout as authLogout} from '../store/authSlice';
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.auth.status);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        const token = localStorage.getItem('accessToken');
        if(!token){
            Toast.show('We ran into some error , refresh the page','red');
            return;
        }
        const apiUrl = import.meta.env.VITE_API_URL;
        axios.post(`http://${apiUrl}/api/v1/user/logout`,{},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            dispatch(authLogout())
            navigate('/');
        })
        .catch(err => {
            Toast.show(err?.response?.data?.message,'red');
            alert('Error', err); 
        });
    };
    return (
        <header className="fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-800 z-50">
        <Toast/>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">Event Manager</h1>
              </div>
              <div className="flex items-center space-x-4">
                {authStatus ? (
                    <>
                    <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition" onClick={() => navigate('/')}>
                        Home
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition" onClick={handleLogout}>
                        Logout
                    </button>
                    </>
                ) :(
                    <>
                        <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition" onClick={handleLogin}>
                        Login
                        </button>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition" onClick={handleSignup}>
                        Sign Up
                        </button>
                    </>
                )}
                
                
              </div>
            </div>
          </div>
        </header>
    );
};

export default Header;