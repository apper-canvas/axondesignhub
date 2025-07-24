import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const VendorCard = ({ vendor, onClick }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "furniture": return "primary";
      case "lighting": return "warning";
      case "textiles": return "secondary";
      case "accessories": return "accent";
      default: return "default";
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card 
        className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick(vendor)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">
              {vendor.name}
            </h3>
            <Badge variant={getCategoryColor(vendor.category)}>
              {vendor.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="User" size={16} />
            <span>{vendor.contact}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Mail" size={16} />
            <span>{vendor.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Phone" size={16} />
            <span>{vendor.phone}</span>
          </div>
          {vendor.website && (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Globe" size={16} />
              <span className="text-accent">{vendor.website}</span>
            </div>
          )}
        </div>

        {vendor.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{vendor.notes}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
        </div>
      </Card>
    </motion.div>
  );
};

export default VendorCard;