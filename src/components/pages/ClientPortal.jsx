import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import { projectService } from "@/services/api/projectService";
import { clientService } from "@/services/api/clientService";
import ClientPortalLogin from "@/components/molecules/ClientPortalLogin";
import ProjectProgress from "@/components/molecules/ProjectProgress";

const ClientPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Simulate authentication
  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find client by email (demo)
      const client = await clientService.getById(1); // Demo: Sarah Johnson
      setCurrentUser(client);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${client.name}!`);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('projects');
    setSelectedProject(null);
    toast.info("You have been logged out.");
  };

  // Load user projects
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadUserProjects();
    }
  }, [isAuthenticated, currentUser]);

  const loadUserProjects = async () => {
    setLoading(true);
    try {
      const userProjects = await projectService.getByClientId(currentUser.Id);
      setProjects(userProjects);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'projects', name: 'My Projects', icon: 'FolderOpen' },
    { id: 'documents', name: 'Documents', icon: 'FileText' },
    { id: 'messages', name: 'Messages', icon: 'MessageCircle' },
    { id: 'settings', name: 'Settings', icon: 'Settings' }
  ];

  if (!isAuthenticated) {
    return <ClientPortalLogin onLogin={handleLogin} loading={loading} />;
  }

  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">My Projects</h2>
          <p className="text-gray-600 mt-1">Track progress and view details of your design projects</p>
        </div>
        <Badge variant="success" className="px-3 py-1">
          {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedProject(project)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Started {format(new Date(project.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant={project.phase === 'installation' ? 'warning' : 'info'}>
                    {project.phase}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <ProjectProgress phase={project.phase} />

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                    <span>Spent: ${project.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Eye" size={16} />
                    <span className="text-sm text-gray-600">View Details</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Project Documents</h2>
        <p className="text-gray-600 mt-1">Access contracts, designs, and project files</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {['Floor Plans', 'Design Concepts', 'Material Samples', 'Contracts', 'Invoices', 'Progress Photos'].map((docType, index) => (
          <Card key={docType} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon 
                  name={index % 2 === 0 ? 'FileText' : 'Image'} 
                  size={20} 
                  className="text-primary" 
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{docType}</h3>
                <p className="text-xs text-gray-600">{Math.floor(Math.random() * 10) + 1} files</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-display font-semibold text-lg mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {[
            { name: 'Living Room Concept v3.pdf', date: '2024-03-15', size: '2.4 MB' },
            { name: 'Material Swatches.jpg', date: '2024-03-12', size: '1.8 MB' },
            { name: 'Updated Floor Plan.dwg', date: '2024-03-10', size: '5.2 MB' }
          ].map((file, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Download" size={16} className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-600">{file.date} • {file.size}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success('Download started')}>
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const MessagesTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Messages</h2>
        <p className="text-gray-600 mt-1">Communicate with your design team</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[
                { from: 'Design Team', message: 'Hi Sarah! The fabric samples have arrived. Would you like to schedule a time to review them?', time: '2 hours ago', isTeam: true },
                { from: 'You', message: 'That sounds great! I\'m available this Friday afternoon.', time: '1 hour ago', isTeam: false },
                { from: 'Design Team', message: 'Perfect! I\'ll send you a calendar invite for Friday at 2 PM.', time: '45 minutes ago', isTeam: true }
              ].map((msg, index) => (
                <div key={index} className={`flex ${msg.isTeam ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isTeam 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-primary text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isTeam ? 'text-gray-600' : 'text-primary-100'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-4 pt-4 border-t">
              <Input 
                placeholder="Type your message..." 
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && toast.success('Message sent!')}
              />
              <Button onClick={() => toast.success('Message sent!')}>
                <ApperIcon name="Send" size={16} />
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Meeting request sent')}
              >
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Schedule Meeting
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Support ticket created')}
              >
                <ApperIcon name="HelpCircle" size={16} className="mr-2" />
                Request Support
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.success('Feedback submitted')}
              >
                <ApperIcon name="Star" size={16} className="mr-2" />
                Leave Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Account Settings</h2>
        <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input defaultValue={currentUser?.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input defaultValue={currentUser?.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input defaultValue={currentUser?.phone} />
            </div>
            <Button onClick={() => toast.success('Profile updated successfully!')}>
              Update Profile
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Project Updates', defaultChecked: true },
              { label: 'New Messages', defaultChecked: true },
              { label: 'Document Uploads', defaultChecked: false },
              { label: 'Meeting Reminders', defaultChecked: true }
            ].map((setting, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  defaultChecked={setting.defaultChecked}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  onChange={() => toast.info('Notification preference updated')}
                />
                <label className="text-gray-700">{setting.label}</label>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsTab />;
      case 'documents': return <DocumentsTab />;
      case 'messages': return <MessagesTab />;
      case 'settings': return <SettingsTab />;
      default: return <ProjectsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-sm text-gray-600">Client Portal</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <ApperIcon name="LogOut" size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-surface">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    {selectedProject.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="info">{selectedProject.phase}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{format(new Date(selectedProject.startDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Date:</span>
                      <span>{format(new Date(selectedProject.targetDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span>${selectedProject.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spent:</span>
                      <span>${selectedProject.spent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Progress</h3>
                  <ProjectProgress phase={selectedProject.phase} showDetails />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => toast.info('Message sent to design team')}>
                  <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                  Contact Team
                </Button>
                <Button onClick={() => toast.success('Meeting request sent')}>
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPortal;