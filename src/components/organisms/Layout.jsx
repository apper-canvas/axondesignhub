import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  return (
<div className="min-h-screen bg-background">
<div className="flex">
        <div className="border-r border-gray-200">
          <Sidebar />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Layout;