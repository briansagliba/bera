import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "./layout/Navbar";
import DashboardGrid from "./dashboard/DashboardGrid";

interface HomeProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const Home: React.FC<HomeProps> = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
  },
}) => {
  // Handlers for various actions
  const handleLogin = () => {
    console.log("Login clicked");
    // In a real app, this would navigate to login page or open login modal
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // In a real app, this would handle logout logic
  };

  const handleRegister = () => {
    console.log("Register clicked");
    // In a real app, this would navigate to registration page or open registration modal
  };

  const handleEmergencySelect = (emergencyId: string) => {
    console.log(`Emergency selected: ${emergencyId}`);
    // In a real app, this would show details of the selected emergency
  };

  const handleReportEmergency = (type: string) => {
    console.log(`Report emergency of type: ${type}`);
    // In a real app, this would navigate to emergency reporting form
  };

  const handleViewEmergencyDetails = (id: string) => {
    console.log(`View emergency details: ${id}`);
    // In a real app, this would show detailed view of the emergency
  };

  const handleContactSelect = (contactId: string) => {
    console.log(`Contact selected: ${contactId}`);
    // In a real app, this would show details of the selected contact
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Bilar Emergency Response Application</title>
        <meta
          name="description"
          content="Emergency response application for Bilar municipality"
        />
      </Helmet>

      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
      />

      <main className="flex-1 container mx-auto">
        <DashboardGrid
          onEmergencySelect={handleEmergencySelect}
          onReportEmergency={handleReportEmergency}
          onViewEmergencyDetails={handleViewEmergencyDetails}
          onContactSelect={handleContactSelect}
        />
      </main>

      <footer className="py-4 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2023 Bilar Emergency Response Application. All rights reserved.
          </p>
          <p className="mt-1">
            For emergencies requiring immediate assistance, please call the
            national emergency hotline: <span className="font-medium">911</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
