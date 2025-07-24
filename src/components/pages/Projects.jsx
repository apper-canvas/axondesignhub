import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ProjectGallery from "@/components/organisms/ProjectGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
  const { projects, loading, error, loadProjects } = useProjects();

  const handleProjectClick = (project) => {
    toast.info(`Viewing project: ${project.name}`);
  };

  const handleAddProject = () => {
    toast.info("Add new project functionality would open here");
  };

  const handleSearch = (query) => {
    // Implement project search functionality
    toast.info(`Searching projects for: ${query}`);
  };

  if (error) {
    return (
      <div>
        <Header title="Projects" showSearch={false} />
        <div className="p-6">
          <Error message={error} onRetry={loadProjects} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Projects" 
        onSearch={handleSearch}
        actions={
          <Button onClick={handleAddProject}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            New Project
          </Button>
        }
      />
      
      <div className="p-6">
        <ProjectGallery
          projects={projects}
          loading={loading}
          onProjectClick={handleProjectClick}
          onAddProject={handleAddProject}
        />
      </div>
    </div>
  );
};

export default Projects;