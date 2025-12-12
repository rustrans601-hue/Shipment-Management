import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "./components/login-page";
import { ShipmentDashboard } from "./components/shipment-dashboard";
import { AuthProvider, useAuth } from "./hooks/use-auth";

// Protected route component
const ProtectedRoute = ({ children, ...rest }: any) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute path="/dashboard">
              <ShipmentDashboard />
            </ProtectedRoute>
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;