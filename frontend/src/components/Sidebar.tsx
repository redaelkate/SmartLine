import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  CreditCard,
  History,
  Bell,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Users, label: 'Agents', id: 'users' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: History, label: 'support', id: 'callHistory' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white sticky top-0 left-0 ">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-xl font-bold">SmartLine</h1>
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
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}