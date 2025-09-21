import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleDetailsUpdate = () => {
    api.patch('/users/update-account', { fullName, email })
      .then(res => setUser(res.data.data));
  };

  const handlePasswordChange = () => {
    api.post('/users/change-password', { oldPassword, newPassword })
      .then(() => {
        alert('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
      })
      .catch(() => alert('Failed to change password.'));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <div className="mb-4">
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button onClick={handleDetailsUpdate} className="bg-blue-600 text-white p-2 rounded">Update Details</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="mb-4">
          <label>Old Password</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button onClick={handlePasswordChange} className="bg-green-600 text-white p-2 rounded">Change Password</button>
      </div>
    </div>
  );
};

export default Profile;