import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--modal-opacity)) 4%,hsla(266,50%,80%,calc(var(--modal-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--modal-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const round = (value, precision = 3) =>
  parseFloat(value.toFixed(precision));

const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const UserModal = ({ show, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const wrapRef = useRef(null);
  const modalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        password: ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        role: 'user',
        password: ''
      });
    }
  }, [user]);

  // Animation handler for pointer movement (tilt effect)
  const updateTransform = useCallback((offsetX, offsetY, modal, wrap) => {
    const width = modal.clientWidth;
    const height = modal.clientHeight;

    const percentX = clamp((100 / width) * offsetX);
    const percentY = clamp((100 / height) * offsetY);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      "--pointer-x": `${percentX}%`,
      "--pointer-y": `${percentY}%`,
      "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
      "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
      "--rotate-x": `${round(-(centerY / 8))}deg`,
      "--rotate-y": `${round(centerX / 8)}deg`,
    };

    Object.entries(properties).forEach(([prop, val]) => {
      wrap.style.setProperty(prop, val);
    });
  }, []);

  const handlePointerMove = useCallback((e) => {
    const modal = modalRef.current;
    const wrap = wrapRef.current;
    if (!modal || !wrap) return;
    const rect = modal.getBoundingClientRect();
    updateTransform(e.clientX - rect.left, e.clientY - rect.top, modal, wrap);
  }, [updateTransform]);

  const handlePointerLeave = useCallback(() => {
    const wrap = wrapRef.current;
    const modal = modalRef.current;
    if (!modal || !wrap) return;
    wrap.style.setProperty("--pointer-x", "50%");
    wrap.style.setProperty("--pointer-y", "50%");
    wrap.style.setProperty("--background-x", "50%");
    wrap.style.setProperty("--background-y", "50%");
    wrap.style.setProperty("--rotate-x", "0deg");
    wrap.style.setProperty("--rotate-y", "0deg");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="umodal-wrapper fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      style={{
        "--modal-opacity": 0.7,
        "--behind-gradient": DEFAULT_BEHIND_GRADIENT,
        "--inner-gradient": DEFAULT_INNER_GRADIENT,
      }}
    >
      <section
        ref={modalRef}
        className="umodal-card bg-gradient-to-br from-[#60496e8c] to-[#71c4ff44] rounded-2xl shadow-2xl p-8 w-full max-w-lg relative text-white"
        style={{
          backgroundImage: `var(--behind-gradient), var(--inner-gradient)`,
          transformStyle: 'preserve-3d',
          transition: "transform 0.2s ease",
        }}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-white hover:text-purple-300 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-extrabold mb-6 select-none">
          {user ? "Edit User" : "Create New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter email"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none">
              {user ? "New Password (optional)" : "Password"}
            </label>
            <input
              type="password"
              required={!user}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={user ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-purple-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold transition"
            >
              {user ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UserModal;
