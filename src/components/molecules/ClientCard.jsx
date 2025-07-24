import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ClientCard = ({ client, onClick }) => {
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "default";
      case "prospect": return "warning";
      default: return "default";
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card 
        className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick(client)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials(client.name)}
              </span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-gray-900">
                {client.name}
              </h3>
              <p className="text-gray-600 text-sm">{client.email}</p>
            </div>
          </div>
          <Badge variant={getStatusColor(client.status)}>
            {client.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Phone" size={16} />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" size={16} />
            <span className="truncate">{client.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={16} />
            <span>Last contact: {format(new Date(client.lastContact), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {Math.floor(Math.random() * 5) + 1} active projects
          </span>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientCard;