// components/UserTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/users', {
          headers: { 'x-auth-token': token }
        });
        
        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Last Login</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{new Date(user.lastLogin).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;