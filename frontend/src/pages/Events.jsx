import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { use } from 'react';
import axios from 'axios';
import NewTaskModal from '../components/NewTaskModal';
import NewEventModal from '../components/NewEventModal';
import EditEventModal from '../components/EditEventModal';

const Events = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const accessToken = localStorage.getItem('accessToken');
        try{
            const res = await axios.get(`http://${apiUrl}/api/v1/event/get-all-events`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(res.data);
            setEvents(res.data.data);
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while fetching events');
        } finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleManage = (eventId) => {
        console.log(`Viewing attendees for event with ID: ${eventId}`);
        navigate(`/events/${eventId}/manage`);
    };
    const handleViewAttendees = (eventId) => {
        console.log(`Viewing attendees for event with ID: ${eventId}`);
        navigate(`/events/${eventId}/attendees`);
    };
    
    const handleDelete = async (eventId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this event? Deleting this event will delete associated attendees and tasks as well.");
        try{
            if (userConfirmed) {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL;
                const accessToken = localStorage.getItem('accessToken');
                await axios.delete(`http://${apiUrl}/api/v1/event/delete-event/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                fetchEvents();
            } else {
                console.log(`Deleting aborted for event with ID: ${eventId}`);
            }
        } catch (error) {
            console.error(`Error deleting event: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handleEditEvent = async (event) => {
        try{
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const accessToken = localStorage.getItem('accessToken');
            await axios.patch(`http://${apiUrl}/api/v1/event/update-event/${event._id}`, event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchEvents();
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while updating event');
        } finally{
            setLoading(false);
        }
    }
    const handleSaveEvent = async (event) => {
        try{
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.post(`http://${apiUrl}/api/v1/event/create-event`, event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(res.data);
            fetchEvents();
        }
        catch(err){
            console.error(err);
        }
        finally{
            setLoading(false);
        }
    };


    return (
        <main className="flex-grow container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-6 mt-20">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Upcoming Events</h1>
                    <button
                        className="bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 
                                w-12 h-12  flex items-center justify-center"
                        onClick={() => setModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                <NewEventModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveEvent}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                />
                
                
                <div className="overflow-x-auto sm:overflow-x-visible">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-8">
                        <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center text-red-500 font-semibold">
                        {error}
                        </div>
                    ) : (
                        events
                        .sort((a, b) => {
                            const now = Date.now();
                            const dateA = new Date(a.date).getTime();
                            const dateB = new Date(b.date).getTime();
                            return Math.abs(dateA - now) - Math.abs(dateB - now);
                        })
                        .map(event => (
                            <div key={event._id} className="bg-slate-500 rounded-lg shadow-lg p-6 relative">
                                <EditEventModal
                                    isOpen={isEditModalOpen}
                                    onClose={() => setEditModalOpen(false)}
                                    onSave={handleEditEvent}
                                    presentEvent={event}
                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                                />
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        className="p-3 bg-yellow-600 rounded-full hover:bg-yellow-700 transition-colors"
                                        onClick={() => setEditModalOpen(true)}
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                            <path d="m15 5 4 4"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                                        onClick={() => handleDelete(event._id)}
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </div>
                            
                                <h3 className="text-xl font-semibold mb-4 pr-20">{event.name}</h3>
                                <div className="space-y-2">
                                    <p className="text-sm flex">
                                        <span className="font-semibold w-24">Date:</span>
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                    </p>
                                    <p className="text-sm flex">
                                        <span className="font-semibold w-24">Description:</span>
                                        <span>{event.description}</span>
                                    </p>
                                    <p className="text-sm flex">
                                        <span className="font-semibold w-24">Location:</span>
                                        <span>{event.location}</span>
                                    </p>
                                </div>
                            
                                <div className="mt-6 flex space-x-3">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => handleViewAttendees(event._id)}
                                    >
                                        Attendees
                                    </button>
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition-colors"
                                        onClick={() => handleManage(event._id)}
                                    >
                                        Tasks
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Events;