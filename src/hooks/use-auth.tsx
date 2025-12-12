import React from "react";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = React.useMemo(() => user !== null, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (foundUser) {
          const userData = { username: foundUser.username, role: foundUser.role };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};