import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ProjectCard = ({ project, onClick }) => {
  const getPhaseColor = (phase) => {
    switch (phase) {
      case "consultation": return "warning";
      case "concept": return "info";
      case "design": return "primary";
      case "procurement": return "secondary";
      case "installation": return "success";
      default: return "default";
    }
  };

  const getProgressPercentage = (phase) => {
    const phases = ["consultation", "concept", "design", "procurement", "installation"];
    const currentIndex = phases.indexOf(phase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const sampleImage = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop`;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick(project)}
      >
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={sampleImage} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute top-4 right-4">
            <Badge variant={getPhaseColor(project.phase)}>
              {project.phase}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <div className="flex justify-between text-white text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage(project.phase))}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent to-warning h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(project.phase)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">
            {project.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} />
                <span>Due: {format(new Date(project.targetDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500">Budget</div>
              <div className="font-semibold text-gray-900">
                ${project.budget.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Spent</div>
              <div className="font-semibold text-gray-900">
                ${project.spent.toLocaleString()}
              </div>
            </div>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;