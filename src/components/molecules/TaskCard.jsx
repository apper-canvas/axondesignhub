import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ task, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "primary";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className={`p-4 ${isOverdue ? 'border-l-4 border-l-error' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
            <Badge variant={getStatusColor(task.status)} size="sm">
              {task.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ApperIcon name="User" size={14} />
              <span>{task.assignee}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span className={isOverdue ? 'text-error font-medium' : ''}>
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            </div>
          </div>
          
          {task.status !== "completed" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onStatusChange(task.Id, "completed")}
              className="text-gray-400 hover:text-success transition-colors"
            >
              <ApperIcon name="CheckCircle" size={18} />
            </motion.button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;