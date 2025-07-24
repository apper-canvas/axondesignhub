import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const ClientPortalLogin = ({ onLogin, loading }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  const handleDemoLogin = () => {
    setCredentials({
      email: 'sarah.johnson@email.com',
      password: 'demo123'
    });
    onLogin({
      email: 'sarah.johnson@email.com',
      password: 'demo123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="UserCheck" size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Client Portal</h1>
            <p className="text-gray-600 mt-2">Access your design projects and communicate with our team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <ApperIcon name="LogIn" size={16} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <ApperIcon name="Play" size={16} className="mr-2" />
              Try Demo Login
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Demo credentials: sarah.johnson@email.com / demo123
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="text-primary hover:underline">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientPortalLogin;