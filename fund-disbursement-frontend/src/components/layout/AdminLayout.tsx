import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { AuthService } from '@/api/services/auth.service';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: { name: string; href: string }[];
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>(['Disbursements']); // Auto-open disbursements
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Positions', href: '/admin/positions', icon: BuildingOfficeIcon },
    { name: 'Workers', href: '/admin/workers', icon: UserGroupIcon },
    { name: 'Payroll', href: '/admin/payroll', icon: CurrencyDollarIcon },
    { 
      name: 'Disbursements', 
      href: '/admin/disbursements', 
      icon: DocumentTextIcon,
      submenu: [
        // { name: 'Overview', href: '/admin/disbursements' },
        { name: 'Single', href: '/admin/disbursements/single' },
        { name: 'Batch', href: '/admin/disbursements/batch' },
        { name: 'Payouts', href: '/admin/disbursements/payouts' },
      ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  // Auto-open menu if current path matches submenu
  React.useEffect(() => {
    navigation.forEach((item) => {
      if (item.submenu && item.submenu.length > 0) {
        const isSubmenuActive = item.submenu.some((sub) =>
          location.pathname.startsWith(sub.href)
        );
        if (isSubmenuActive && !openMenus.includes(item.name)) {
          setOpenMenus((prev) => [...prev, item.name]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FD</span>
            </div>
            <div className="ml-3">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Fund
              </span>
              <br />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Disbursement
              </span>
            </div>
          </div>
          <button
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isOpen = openMenus.includes(item.name);
              const isSubmenuActive = hasSubmenu && item.submenu && item.submenu.some(
                (sub) => location.pathname === sub.href
              );

              return (
                <div key={item.name}>
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isSubmenuActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`mr-3 h-5 w-5 flex-shrink-0 ${
                              isSubmenuActive
                                ? 'text-blue-500 dark:text-blue-400'
                                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                            }`}
                          />
                          {item.name}
                        </div>
                        {isOpen ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronRightIcon className="w-4 h-4" />
                        )}
                      </button>
                      {isOpen && item.submenu && (
                        <div className="ml-11 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
          <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.sub?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.sub}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative transition-colors duration-200" aria-label="Notifications">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-none mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};