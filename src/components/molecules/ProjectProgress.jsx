import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ProjectProgress = ({ phase, showDetails = false }) => {
  const phases = [
    { name: "consultation", label: "Consultation", icon: "MessageCircle" },
    { name: "concept", label: "Concept", icon: "Lightbulb" },
    { name: "design", label: "Design", icon: "Palette" },
    { name: "procurement", label: "Procurement", icon: "ShoppingCart" },
    { name: "installation", label: "Installation", icon: "Hammer" },
    { name: "completion", label: "Completion", icon: "CheckCircle" }
  ];

  const currentIndex = phases.findIndex(p => p.name === phase);
  const progress = ((currentIndex + 1) / phases.length) * 100;

  const getPhaseStatus = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'active': return 'text-primary';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'active': return 'bg-primary';
      default: return 'bg-gray-200';
    }
  };

  if (showDetails) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <Badge variant="info">{Math.round(progress)}% Complete</Badge>
        </div>
        
        <div className="space-y-3">
          {phases.map((phaseItem, index) => {
            const status = getPhaseStatus(index);
            return (
              <div key={phaseItem.name} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusBg(status)}`}>
                  <ApperIcon 
                    name={status === 'completed' ? 'Check' : phaseItem.icon} 
                    size={16} 
                    className="text-white" 
                  />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${status === 'active' ? 'text-primary' : status === 'completed' ? 'text-success' : 'text-gray-600'}`}>
                    {phaseItem.label}
                  </p>
                </div>
                {status === 'active' && (
                  <Badge variant="warning" size="sm">Current</Badge>
                )}
                {status === 'completed' && (
                  <ApperIcon name="CheckCircle" size={16} className="text-success" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Started</span>
        <span className="capitalize font-medium text-primary">{phase}</span>
        <span>Complete</span>
      </div>
    </div>
  );
};

export default ProjectProgress;