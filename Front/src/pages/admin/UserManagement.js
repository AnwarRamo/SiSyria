import { useEffect, useState } from "react";
import { UserService } from "../../api/services/user.service";
import Button from "../../components/ui/button";
import Card, { CardContent } from "../../components/ui/card";
import Skeleton from "../../components/ui/Skeleton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import EditUserModal from "../../components/admin/EditUserModal";

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
              // Validate ID format
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
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <p className="text-sm">Role: {user.role}</p>
                      </div>
                      <div className="flex gap-2">
                        {user.role !== "admin" && (
                          <Button
                            onClick={() => handlePromote(user._id)}
                            size="sm"
                            className="bg-indigo-500 hover:bg-indigo-600"
                          >
                            Promote
                          </Button>
                        )}
                        <Button
                          onClick={() => handleEdit(user)}
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(user._id)}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default UserManagement;
