import React, { useState } from 'react';
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

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Clients', id: 'users' },
  { icon: Package, label: 'Orders', id: 'orders' },
  { icon: Contact2, label: 'Leads', id: 'leads' },
  { icon: History, label: 'support', id: 'callHistory' },
  { icon: Bot, label: 'Agents ', id: 'settings' },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-gray-900 text-white sticky top-0 left-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-5 border-b border-gray-800 flex justify-between items-center">
        {!isCollapsed && <h1 className="text-xl font-bold">SmartLine</h1>}
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors w-full text-left"
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}