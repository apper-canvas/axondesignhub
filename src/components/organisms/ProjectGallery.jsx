import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const ProjectGallery = ({ projects, loading, onProjectClick, onAddProject }) => {
  const [filter, setFilter] = useState("all");

  const phases = ["all", "consultation", "concept", "design", "procurement", "installation"];
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.phase === filter);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (projects.length === 0) {
    return (
      <Empty
        title="No projects yet"
        description="Start your first interior design project and bring your vision to life"
        actionLabel="Create Project"
        onAction={onAddProject}
        icon="FolderOpen"
      />
    );
  }

  return (
    <div>
      {/* Phase Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {phases.map((phase) => (
          <motion.button
            key={phase}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(phase)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === phase
                ? 'bg-gradient-to-r from-accent to-warning text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={`No ${filter} projects`}
          description={`No projects found in the ${filter} phase`}
          actionLabel="View All Projects"
          onAction={() => setFilter("all")}
          icon="Filter"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} onClick={onProjectClick} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectGallery;