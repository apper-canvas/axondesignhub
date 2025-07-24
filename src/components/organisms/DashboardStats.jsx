import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Active Clients",
      value: stats.activeClients,
      icon: "Users",
      gradient: "from-primary to-primary/80",
      change: "+12%"
    },
    {
      title: "Ongoing Projects",
      value: stats.ongoingProjects,
      icon: "FolderOpen",
      gradient: "from-accent to-warning",
      change: "+8%"
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: "CheckSquare",
      gradient: "from-secondary to-secondary/80",
      change: "-5%"
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: "DollarSign",
      gradient: "from-success to-success/80",
      change: "+15%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                <ApperIcon name={stat.icon} size={24} className="text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-success' : 'text-error'
              }`}>
                {stat.change}
              </span>
            </div>
            
            <div>
              <p className="text-2xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;