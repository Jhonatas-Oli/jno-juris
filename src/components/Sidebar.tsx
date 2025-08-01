import { NavLink } from "react-router-dom";
import { FaUser, FaBalanceScale, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? "bg-indigo-700 text-white" : "text-gray-300 hover:bg-indigo-600 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 h-full w-52 bg-gradient-to-b from-indigo-900 to-black text-gray-300 shadow-lg p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white mb-8">JNO Juris</h1>
      <NavLink to="/painel" className={({ isActive }) => linkClasses(isActive)}>
        <FaTachometerAlt /> Dashboard
      </NavLink>
      <NavLink to="/clientes" className={({ isActive }) => linkClasses(isActive)}>
        <FaUser /> Clientes
      </NavLink>
      <NavLink to="/processos" className={({ isActive }) => linkClasses(isActive)}>
        <FaBalanceScale /> Processos
      </NavLink>
      <button onClick={handleLogout} className="mt-8 flex items-center gap-3 px-4 py-3 w-full bg-red-600 hover:bg-red-700 text-white rounded-lg">
        <FaSignOutAlt /> Sair
      </button>
    </nav>
  );
}
