import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Clients from "@/components/pages/Clients";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Vendors from "@/components/pages/Vendors";
import ClientPortal from "@/components/pages/ClientPortal";
const App = () => {
  return (
    <Router>
      <Routes>
<Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="client-portal" element={<ClientPortal />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;