import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { UserService } from "../../api/services/user.service";
import Button from "../../components/ui/button";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import EditUserModal  from "../../components/admin/EditUserModal"
const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const round = (value, precision = 3) =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value,
  fromMin,
  fromMax,
  toMin,
  toMax
) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const UserCard = ({
  user,
  onPromote,
  onEdit,
  onDelete,
  index,
  enableTilt = true,
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;

    const updateCardTransform = (
      offsetX,
      offsetY,
      card,
      wrap
    ) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--rotate-x": `${round(-(centerY / 5))}deg`,
        "--rotate-y": `${round(centerX / 5)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration,
      startX,
      startY,
      card,
      wrap
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        600,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    card.addEventListener("pointerenter", handlePointerEnter);
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    const initialX = wrap.clientWidth / 2;
    const initialY = wrap.clientHeight / 2;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      1500,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", handlePointerEnter);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
      animationHandlers.cancelAnimation();
    };
  }, [animationHandlers, handlePointerEnter, handlePointerLeave, handlePointerMove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        ref={wrapRef}
        className="user-card-wrapper rounded-3xl shadow-xl p-6 cursor-pointer select-none"
        style={{
          "--behind-gradient": DEFAULT_BEHIND_GRADIENT,
          "--inner-gradient": DEFAULT_INNER_GRADIENT,
          backgroundImage: "var(--behind-gradient), var(--inner-gradient)",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <div
          ref={cardRef}
          className="user-card rounded-3xl p-6 bg-white text-gray-900"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease",
            boxShadow:
              "0 10px 40px rgba(193,55,255,0.2), 0 10px 80px rgba(7,198,255,0.15)",
          }}
        >
          <h3 className="text-2xl font-bold mb-1">{user.username}</h3>
          <p className="text-gray-600 mb-2">{user.email}</p>
          <p className="font-semibold mb-4">Role: {user.role}</p>
          <div className="flex gap-3 justify-end">
            {user.role !== "admin" && (
              <Button
                onClick={() => onPromote(user._id)}
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Promote
              </Button>
            )}
            <Button
              onClick={() => onEdit(user)}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(user._id)}
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers(controller.signal);
        setUsers(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, []);

  const handlePromote = async (id) => {
    try {
      await UserService.updateUser(id, { role: "admin" });
      toast.success("User promoted!");
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role: "admin" } : user))
      );
    } catch (err) {
      toast.error(err.message || "Promotion failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id);
      toast.success("User deleted!");
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "newuserpassword",
      role: "user",
    };
    try {
      const createdUser = await UserService.addUser(newUser);
      toast.success("User added!");
      setUsers((prev) => [...prev, createdUser]);
    } catch (err) {
      toast.error(err.message || "Failed to add user");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={handleAddUser} className="bg-green-500 hover:bg-green-600">
          Add New User
        </Button>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={closeEditModal}
          onSave={async (updatedUser) => {
            try {
              if (!updatedUser._id || updatedUser._id.length !== 24) {
                toast.error("Invalid user ID format");
                return;
              }

              await UserService.updateUser(updatedUser._id, updatedUser);
              toast.success("User updated!");
              setUsers((prev) =>
                prev.map((user) =>
                  user._id === updatedUser._id ? { ...user, ...updatedUser } : user
                )
              );
            } catch (err) {
              toast.error(err.message || "Update failed");
            }
            closeEditModal();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))
          : users.map((user, i) => (
              <UserCard
                key={user._id}
                user={user}
                index={i}
                onPromote={handlePromote}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>
    </div>
  );
};

export default UserManagement;
