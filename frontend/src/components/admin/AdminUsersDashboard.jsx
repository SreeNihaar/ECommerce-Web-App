import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserService from "../../api/user/UserService.js";
import { usePagination } from "../../context/PaginationContext.jsx";

const AdminUsersDashboard = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const {totalPages,setTotalPages} = usePagination();

    const [users, setUsers] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 8;

    useEffect(() => {
        fetchUsers();
    }, [page, size]);

    const fetchUsers = async () => {
        try {
            setError("");
            
            UserService.getAllUsers(page,size)
                .then((res)=>{
                    const data=res.body.content;
                    setUsers(data);
                    setTotalPages(res.body.totalPages);
                    setTotalElements(res.body.totalElements);
                })
                .catch((err)=>{
                    console.error(err);
                    setError(
                        error.response?.data?.message ||
                        "Failed to fetch users"
                    );
                })

        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to fetch users"
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };


    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

return (
  <div className="p-6">
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Users</h1>
          <p className="text-gray-500 mt-1">Total Users: {totalElements}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Username</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total Orders</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Created At</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Updated At</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/admin/users/${user.userId}`)}
                >
                  <td className="px-6 py-4">{user.userId}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.totalOrders}</td>
                  <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">{formatDate(user.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminUsersDashboard;