import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Vendors", href: "/vendors", icon: "Building2" },
    { name: "Client Portal", href: "/client-portal", icon: "UserCheck" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-display font-bold gradient-text">
          DesignHub CRM
        </h1>
        <p className="text-sm text-gray-600 mt-1">Interior Design Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={() => setIsMobileOpen(false)}
          >
            <ApperIcon name={item.icon} size={20} className="mr-3" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Design Studio</p>
            <p className="text-xs text-gray-600">Premium Account</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface shadow-lg"
      >
        <ApperIcon name="Menu" size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen bg-surface border-r border-gray-100 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-surface shadow-xl z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;