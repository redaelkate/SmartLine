import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  CreditCard,
  ShoppingCart,
  Package,
  History,
  Bell,
  Bot,
  Contact2,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext'; // Adjust the import path as needed

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Clients', id: 'users' },
  { icon: Package, label: 'Orders', id: 'orders' },
  { icon: Contact2, label: 'Leads', id: 'leads' },
  { icon: History, label: 'Support', id: 'support' },
  { icon: Bot, label: 'Agents', id: 'settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use the logout function from AuthContext

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigation = (id: string) => {
    if(id === 'settings') {
      alert("The agents generation and customization is coming soon, thank you for your understanding"); // Navigate to the AI Agent Manager page
      return;
    }
    else{
      navigate(`/${id}`);
    }
     // Navigate to the corresponding route
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div
      className={`flex flex-col h-screen  text-gray-900 shadow-md font-medium sticky top-0 left-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`} style={{ backgroundColor: '#fffbf7' }}
    >
      <div className={`p-5 b order-b border-gray-300 flex justify-${isCollapsed ? 'center' : 'between'} items-center`}>
        {!isCollapsed &&<img src={Logo} alt="Logo" border="0" className='w-36' />}
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavigation(item.id)}
                className="flex items-center text-xl gap-3 px-4 py-3 text-gray-600 font-bold hover:bg-orange-400 hover:text-purple-800  00 rounded-lg transition-colors w-full text-left"
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-100 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}