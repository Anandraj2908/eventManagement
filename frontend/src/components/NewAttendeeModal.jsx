import React, { useState } from 'react';

const NewAttendeeModal = ({ isOpen, onClose, onSave }) => {
  const [attendee, setAttendee] = useState({ 
    name: '', 
   });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendee({ ...attendee, [name]: value });
  };

  const handleSave = () => {
    onSave(attendee);
    setAttendee({ name: ''}); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-slate-800 border-b border-slate-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Add New Attendee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium ">
              Attendee Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={attendee.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm px-3 py-2 "
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAttendeeModal;
