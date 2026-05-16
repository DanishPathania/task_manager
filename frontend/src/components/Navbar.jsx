import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Menu, Bell, Check, Trash2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getInitials, formatDateTime } from '../utils/helpers';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to TaskVita!',
      message: 'Your account has been created successfully.',
      time: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Profile Update',
      message: 'Please complete your profile information.',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="h-16 bg-dark-900/60 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left — Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
          id="mobile-menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-dark-800/50 border border-dark-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500/50 w-64 transition-colors"
          />
        </div>
      </div>

      {/* Right — Notifications + User */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            className="p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800/50 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 glass-card z-50 animate-slide-down flex flex-col max-h-[400px]">
                <div className="p-4 border-b border-dark-700/50 flex items-center justify-between">
                  <h3 className="font-semibold text-dark-100">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="p-1.5 text-dark-400 hover:text-primary-400 hover:bg-dark-800 rounded-md transition-colors tooltip" title="Mark all as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearNotifications} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-md transition-colors tooltip" title="Clear all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1 p-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-dark-400 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-3 rounded-lg transition-colors ${notification.read ? 'bg-transparent hover:bg-dark-800/50' : 'bg-dark-800/80 hover:bg-dark-700/50'}`}>
                          <h4 className="text-sm font-medium text-dark-200 mb-1">{notification.title}</h4>
                          <p className="text-xs text-dark-400 mb-2">{notification.message}</p>
                          <span className="text-[10px] text-dark-500">{formatDateTime(notification.time)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-dark-700/50 text-center">
                    <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">
                      View All Activity
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-dark-800/50 transition-colors"
            id="user-dropdown-toggle"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-dark-200">{user?.name}</p>
              <p className="text-xs text-dark-500">{user?.role}</p>
            </div>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50 animate-slide-down">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 transition-colors"
                >
                  My Profile
                </button>
                <hr className="border-dark-700/50 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  id="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
