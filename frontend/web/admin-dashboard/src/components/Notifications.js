import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This assumes the user ID is available. We'll get it from the AuthContext.
    // For now, let's just make sure the component loads.
    // You would typically fetch notifications when the component mounts.
  }, []);

  const fetchNotifications = () => {
    // In a real app, you'd get the user ID from your AuthContext
    // const { user } = useContext(AuthContext);
    // api.get(`/notifications/${user._id}`).then(res => {
    //   setNotifications(res.data.data);
    // });
    
    // Using mock data for now
    setNotifications([
        { _id: 1, message: 'Your issue "Pothole" was updated.' },
        { _id: 2, message: 'The issue "Broken streetlight" has been resolved.' },
    ]);
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative">
        <Bell className="text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
          <div className="p-4 font-bold border-b">Notifications</div>
          <ul className="py-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif._id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  {notif.message}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-500">No new notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;