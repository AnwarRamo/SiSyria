import React, { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--modal-opacity)) 4%,hsla(266,50%,80%,calc(var(--modal-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--modal-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

// const easeInOutCubic = (x) =>
//   x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "user",
  });

  const wrapRef = useRef(null);
  const modalRef = useRef(null);
  // const rafIdRef = useRef(null);

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "user",
    });
  }, [user]);

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

  const handlePointerMove = useCallback(
    (e) => {
      const modal = modalRef.current;
      const wrap = wrapRef.current;
      if (!modal || !wrap) return;
      const rect = modal.getBoundingClientRect();
      updateTransform(e.clientX - rect.left, e.clientY - rect.top, modal, wrap);
    },
    [updateTransform]
  );

  const resetTransform = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.setProperty("--pointer-x", "50%");
    wrap.style.setProperty("--pointer-y", "50%");
    wrap.style.setProperty("--background-x", "50%");
    wrap.style.setProperty("--background-y", "50%");
    wrap.style.setProperty("--rotate-x", "0deg");
    wrap.style.setProperty("--rotate-y", "0deg");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) return null; // or loading state

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTransform}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-6 z-50"
      style={{
        "--modal-opacity": 0.8,
        "--behind-gradient": DEFAULT_BEHIND_GRADIENT,
        "--inner-gradient": DEFAULT_INNER_GRADIENT,
      }}
    >
      <section
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl shadow-2xl p-8 text-white"
        style={{
          backgroundImage: `var(--behind-gradient), var(--inner-gradient)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease",
          boxShadow:
            "0 10px 40px rgba(193,55,255,0.5), 0 10px 80px rgba(7,198,255,0.4)",
        }}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-purple-300 transition"
          type="button"
        >
          ×
        </button>

        <h2 className="text-3xl font-extrabold mb-8 select-none">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold select-none text-white">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-6 mt-8">
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
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditUserModal;
