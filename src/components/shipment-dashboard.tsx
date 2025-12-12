import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/use-auth";
import { ShipmentTable } from "./shipment-table";

export const ShipmentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar maxWidth="xl" isBordered>
        <NavbarBrand>
          <Icon icon="lucide:package" className="h-6 w-6 text-primary" />
          <p className="ml-2 font-bold text-inherit">Shipment Tracker</p>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex items-center gap-2">
              <Icon icon="lucide:user" className="h-5 w-5 text-default-500" />
              <span className="text-sm font-medium">{user?.username}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {user?.role}
              </span>
            </div>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="danger"
              variant="flat"
              startContent={<Icon icon="lucide:log-out" className="h-4 w-4" />}
              onPress={logout}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      
      <div className="container mx-auto max-w-7xl p-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Shipment Management</h1>
          <p className="text-foreground-500">Track and manage your shipment records</p>
        </div>
        
        <ShipmentTable />
      </div>
    </div>
  );
};