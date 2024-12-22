import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fullName:'',
        username:'',
        password:''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false)
        setLoading(true);

        try{
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await axios.post(`http://${apiUrl}/api/v1/user/register`, formData);
            const { accessToken, refreshToken } = res.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            dispatch(authLogin(res.data));
            navigate('/events');
        }
        catch(err){
            setError(err.response?.data?.message || 'An error occurred while logging in');
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className="flex-grow mt-5 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ">
            <div className="w-full max-w-md m-auto bg-gray-800 rounded-lg border border-gray-700 p-8">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <LoadingSpinner/>
                    </div>
                )}
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    Welcome 
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2">Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            id="fullName" 
                            placeholder="Enter your full name" 
                            onChange={handleChange}
                            className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-white text-sm font-medium mb-2">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            placeholder="Enter your username" 
                            onChange={handleChange}
                            minLength={6}
                            className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="Enter your password" 
                            onChange={handleChange}
                            minLength={8}
                            className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
