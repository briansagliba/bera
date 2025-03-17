import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import DashboardGrid from "./DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardPageProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
  },
}) => {
  const navigate = useNavigate();

  // Handlers
  const handleEmergencySelect = (emergencyId: string) => {
    console.log(`Emergency selected: ${emergencyId}`);
    navigate(`/status?emergency=${emergencyId}`);
  };

  const handleViewEmergencyDetails = (id: string) => {
    console.log(`View emergency details: ${id}`);
    navigate(`/status?emergency=${id}`);
  };

  const handleContactSelect = (contactId: string) => {
    console.log(`Contact selected: ${contactId}`);
    navigate(`/directory?contact=${contactId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Dashboard | Bilar Emergency Response</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user?.name || "Admin"} (Admin)
            </p>
          </div>

          {/* Dashboard Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Requestors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">
                  Total registered requestors
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate("/manage-users")}
                  className="w-full"
                >
                  Manage Users
                </Button>
              </div>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Responders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">
                  Active emergency responders
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate("/manage-users?tab=responders")}
                  className="w-full"
                >
                  Manage Responders
                </Button>
              </div>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg">Active Emergencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">
                  Ongoing emergency situations
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate("/emergency-history")}
                  className="w-full"
                >
                  View Emergency History
                </Button>
              </div>
            </Card>
          </div>

          {/* Dashboard Grid */}
          <DashboardGrid
            onEmergencySelect={handleEmergencySelect}
            onViewEmergencyDetails={handleViewEmergencyDetails}
            onContactSelect={handleContactSelect}
          />
        </div>
      </main>

      <BottomBar user={user} />
    </div>
  );
};

export default DashboardPage;
