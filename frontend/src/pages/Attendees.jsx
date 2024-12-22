import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import NewAttendeeModal from '../components/NewAttendeeModal';

const Attendees = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    
    const fetchAttendees = async () => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const accessToken = localStorage.getItem('accessToken');
        try{
            const res = await axios.get(`http://${apiUrl}/api/v1/attendee/get-attendees/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setAttendees(res.data.data);
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while fetching attendees');
        } finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAttendees();
    }, []);

    const handleDeleteAttendee = async (attendeeId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this attendee? Deleting this attendee will delete associated tasks as well.");
        
        if (userConfirmed) {
            try {
                setLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL;
                const accessToken = localStorage.getItem('accessToken');
                const res = await axios.delete(`http://${apiUrl}/api/v1/attendee/delete-attendee/${attendeeId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                fetchAttendees();
            } catch (error) {
                console.error(`Error deleting attendee: ${error.message}`);
            }
        } else {
            console.log(`Deleting aborted for attendee with ID: ${attendeeId}`);
        }
    };
    

    const handleSaveAttendee = async (attendee) => {
        try{
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.post(`http://${apiUrl}/api/v1/attendee/create-attendee/${eventId}`, attendee, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchAttendees();
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
                    <h1 className="text-4xl font-bold">Attendees List</h1>
                    <button
                        className="bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 
                                w-12 h-12  flex items-center justify-center"
                        onClick={() => setModalOpen(true)}
                    >
                        +
                    </button>
                </div>
                <h4 className="text-xl text-gray-500">Total number of Attendees : {attendees.length}</h4>
                <NewAttendeeModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveAttendee}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                />
                
                <div className="overflow-x-auto">
                    <table className="w-full ">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-center text-left text-sm font-semibold text-gray-600">Attendee Name</th>
                                <th className="px-4 py-3 text-center text-left text-sm font-semibold text-gray-600">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8">
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-red-500 font-semibold">{error}</td>
                                </tr>
                            ) : (
                                attendees.map(attendee => (
                                    <tr key={attendee._id} className=" border-y border-gray-400">
                                        <td className="px-4 py-4 text-sm text-center">{attendee.name}</td>
                                        <td className="px-4 py-4 text-sm text-center">
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 text-xs sm:text-sm rounded-lg hover:bg-red-600 w-full sm:w-auto"
                                                    onClick={() => handleDeleteAttendee(attendee._id)}
                                                >
                                                    Remove
                                                </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Attendees;