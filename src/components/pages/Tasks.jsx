import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const { tasks, loading, error, loadTasks, updateTaskStatus } = useTasks();
  const [filter, setFilter] = useState("all");

  const statusFilters = [
    { value: "all", label: "All Tasks", count: tasks.length },
    { value: "pending", label: "Pending", count: tasks.filter(t => t.status === "pending").length },
    { value: "in-progress", label: "In Progress", count: tasks.filter(t => t.status === "in-progress").length },
    { value: "completed", label: "Completed", count: tasks.filter(t => t.status === "completed").length }
  ];

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddTask = () => {
    toast.info("Add new task functionality would open here");
  };

  const handleSearch = (query) => {
    toast.info(`Searching tasks for: ${query}`);
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Tasks" 
          onSearch={handleSearch}
          actions={
            <Button onClick={handleAddTask}>
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add Task
            </Button>
          }
        />
        <div className="p-6">
          <Loading type="list" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Tasks" showSearch={false} />
        <div className="p-6">
          <Error message={error} onRetry={loadTasks} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Tasks" 
        onSearch={handleSearch}
        actions={
          <Button onClick={handleAddTask}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Task
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {statusFilters.map((statusFilter) => (
            <motion.button
              key={statusFilter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(statusFilter.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === statusFilter.value
                  ? 'bg-gradient-to-r from-accent to-warning text-white shadow-lg'
                  : 'bg-surface text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <span>{statusFilter.label}</span>
              <Badge variant={filter === statusFilter.value ? "default" : "primary"} size="sm">
                {statusFilter.count}
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Empty
            title={filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            description={
              filter === "all" 
                ? "Create your first task to get started with project management"
                : `No tasks found with ${filter} status`
            }
            actionLabel={filter === "all" ? "Add Task" : "View All Tasks"}
            onAction={filter === "all" ? handleAddTask : () => setFilter("all")}
            icon="CheckSquare"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TaskCard task={task} onStatusChange={handleTaskStatusChange} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tasks;