import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/button';
import Modal from '../../components/ui/Modal'; // Assuming a Modal component is available

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData); // Pass the updated user data to the parent
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold">Edit User</h2>
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600">
              Save
            </Button>
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
