import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useClients } from "@/hooks/useClients";
import Tasks from "@/components/pages/Tasks";
import Projects from "@/components/pages/Projects";
import Header from "@/components/organisms/Header";
import CalendarWidget from "@/components/organisms/CalendarWidget";
import DashboardStats from "@/components/organisms/DashboardStats";
import TaskCard from "@/components/molecules/TaskCard";
import ProjectCard from "@/components/molecules/ProjectCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const Dashboard = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, updateTaskStatus, loading: tasksLoading } = useTasks();
  const { clients, loading: clientsLoading } = useClients();
  const [stats, setStats] = useState({
    activeClients: 0,
    ongoingProjects: 0,
    pendingTasks: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    if (!projectsLoading && !tasksLoading && !clientsLoading) {
      setStats({
        activeClients: clients.filter(c => c.status === "active").length,
        ongoingProjects: projects.filter(p => p.phase !== "completed").length,
        pendingTasks: tasks.filter(t => t.status !== "completed").length,
        monthlyRevenue: projects.reduce((sum, p) => sum + p.spent, 0)
      });
    }
  }, [projects, tasks, clients, projectsLoading, tasksLoading, clientsLoading]);

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const recentProjects = projects.slice(0, 3);
  const urgentTasks = tasks
    .filter(t => t.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

if (projectsLoading || tasksLoading || clientsLoading) {
  return (
    <div>
      <Header title="Dashboard" showSearch={false} />
      <div className="p-6">
        <Loading />
      </div>
    </div>
  );
}

return (
  <div>
    <Header title="Dashboard" showSearch={false} />
    
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
          Welcome to DesignHub
        </h1>
        <p className="text-gray-600">
          Manage your interior design projects with elegance and efficiency
        </p>
      </motion.div>

      <DashboardStats stats={stats} />

<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Widget */}
        <div className="xl:col-span-1">
          <CalendarWidget />
        </div>
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <h2 className="text-2xl font-display font-semibold gradient-text mb-6">
            Recent Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ProjectCard 
                  project={project} 
                  onClick={() => {}} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-display font-semibold gradient-text mb-6">
            Urgent Tasks
          </h2>
          <div className="space-y-4">
            {urgentTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <TaskCard 
                  task={task} 
                  onStatusChange={handleTaskStatusChange}
                />
              </motion.div>
            ))}
</div>
        </motion.div>
      </div>
    </div>
  </div>
  </div>
);
};

export default Dashboard;