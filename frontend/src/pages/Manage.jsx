import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import NewTaskModal from '../components/NewTaskModal';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { use } from 'react';
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const Manage = () => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [event, setEvent] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [attendees, setAttendees] = useState([]);

    const [chartData, setChartData] = useState({
        labels: ['Pending Tasks', 'Completed Tasks'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#f44336', '#4caf50'],
            hoverBackgroundColor: ['#e25850', '#45a047'],
        }]
    });

    const countTasks = () => {
        let pending = 0;
        let completed = 0;

        tasks.forEach(task => {
            if (task.status === 'Pending') {
                pending += 1;
            } else if (task.status === 'Completed') {
                completed += 1;
            }
        });

        setChartData(prevData => ({
            ...prevData,
            datasets: [{
                ...prevData.datasets[0],
                data: [pending, completed],
            }],
        }));
    };

    const fetchEvent = async () => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const accessToken = localStorage.getItem('accessToken');
        try{
            const res = await axios.get(`http://${apiUrl}/api/v1/event/get-event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setEvent(res.data.data);
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while fetching event');
            console.error(err);
        } finally{
            setLoading(false);
        }
    }
    
    const fetchTasks = async () => {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const accessToken = localStorage.getItem('accessToken');
        try{
            const res = await axios.get(`http://${apiUrl}/api/v1/task/get-tasks/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTasks(res.data.data);
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while fetching tasks');
        } finally{
            setLoading(false);
        }
    };

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
        countTasks();
    }, [tasks]);

    useEffect(() => {
        fetchEvent();
        fetchTasks();
        fetchAttendees();
        
    }, []);

    const handleStatusChange = async (taskId) => {
        try{
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const accessToken = localStorage.getItem('accessToken');
            await axios.patch(`http://${apiUrl}/api/v1/task/update-task-status/${taskId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchTasks();
        } catch(err){
            setError(err.response?.data?.message || 'An error occurred while updating task status');
        } finally{
            setLoading(false);
        }
    };


    const handleSaveTask = async (task) => {
        try{
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL;
            const accessToken = localStorage.getItem('accessToken');
            await axios.post(`http://${apiUrl}/api/v1/task/create-task/${eventId}/${task.assignedTo}`, task, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchTasks();
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
            {!event ? (
                <LoadingSpinner />
            ):(
                <div className="flex flex-col space-y-6 mt-20">
                <div className="space-y-2 mb-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold">{event.name}</h1>
                        
                        <button
                            className="bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 
                                    px-6 py-3 flex items-center justify-center text-sm sm:text-base"
                            onClick={() => setModalOpen(true)}
                        >
                            Add Task
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">Location:</span> {event.location}
                                </p>
                            </div>
                            <div className="mt-2">
                                <h3 className="text-sm text-gray-500">
                                    <span className="font-semibold">Description:</span> {event.description}
                                </h3>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="my-8 w-full max-w-md mx-auto h-[200px]">
                                <Doughnut 
                                    data={chartData} 
                                    options={{ 
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    padding: 20,
                                                    font: {
                                                        size: 14
                                                    }
                                                }
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <NewTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveTask}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    attendees={attendees}
                />
                <div className="mb-8 w-full max-w-md mx-auto h-[200px] sm:h-[400px] lg:hidden">
                    <Doughnut 
                        data={chartData} 
                        options={{ 
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 20,
                                        font: {
                                            size: 14
                                        }
                                    }
                                }
                            }
                        }} 
                    />
                </div>
                <div className="overflow-x-auto sm:overflow-x-visible">
                    <h1 className="text-2xl font-bold">Pending Tasks</h1>
                    <table className="w-full table-auto border-collapse mb-10">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Unchecked</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Task Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Deadline</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Assigned To</th>
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
                                tasks.filter(task => task.status === 'Pending').map(task => (
                                    <tr key={task._id} className="border-b">
                                        <td className="px-4 py-4 text-sm text-center">
                                            <input
                                                type="checkbox"
                                                checked={task.status === "Completed"}
                                                onChange={() => handleStatusChange(task._id)}
                                                className="h-5 w-5 text-yellow-600 rounded focus:ring-yellow-500"
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-center">{task.name}</td>
                                        <td className="px-4 py-4 text-sm text-center">{new Date(task.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-4 py-4 text-sm text-center">{task.assignedTo.name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <h1 className="text-2xl font-bold mt-10">Completed Tasks</h1>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Task Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Deadline</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Assigned To</th>
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
                                tasks.filter(task => task.status === 'Completed').map(task => (
                                    <tr key={task._id} className="border-b">
                                        <td className="px-4 py-4 text-sm text-center">{task.name}</td>
                                        <td className="px-4 py-4 text-sm text-center">{new Date(task.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-4 py-4 text-sm text-center">{task.assignedTo.name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
        </main>
    );
};

export default Manage;