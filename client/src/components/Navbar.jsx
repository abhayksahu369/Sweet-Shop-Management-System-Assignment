import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 shadow-md flex justify-between items-center">
      <div className="text-white font-extrabold text-xl">
        <Link to="/">🍬 Sweet Heaven</Link> 
      </div>

      <div className="flex items-center gap-4">
        {user?.isAdmin && (
          <button
            onClick={() => (navigate("/admindashboard"))}
            className="bg-white text-pink-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-pink-50 transition"
          >
            Admin Dashboard
          </button>
        )}

        <button
          onClick={onLogout}
          className="bg-white text-pink-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-pink-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
