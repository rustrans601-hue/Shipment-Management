import React from "react";
import { Card, Input, Button, Checkbox } from "@heroui/react";
import { useHistory, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/use-auth";
import { motion } from "framer-motion";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  const from = (location.state as any)?.from || { pathname: "/dashboard" };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        history.replace(from);
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-md">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Icon icon="lucide:package" className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Shipment Tracking System</h1>
            <p className="text-sm text-foreground-500">Sign in to access your dashboard</p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-medium bg-danger-50 p-3 text-sm text-danger">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:alert-circle" className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onValueChange={setUsername}
              startContent={
                <Icon icon="lucide:user" className="h-4 w-4 text-default-400" />
              }
              isRequired
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              type="password"
              startContent={
                <Icon icon="lucide:lock" className="h-4 w-4 text-default-400" />
              }
              isRequired
            />
            
            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={rememberMe}
                onValueChange={setRememberMe}
                size="sm"
              >
                <span className="text-sm">Remember me</span>
              </Checkbox>
              
              <Button
                variant="light"
                color="primary"
                size="sm"
                className="font-medium"
              >
                Forgot password?
              </Button>
            </div>
            
            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-foreground-500">
            <p>Demo credentials:</p>
            <p className="font-mono">Username: admin | Password: admin123</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};