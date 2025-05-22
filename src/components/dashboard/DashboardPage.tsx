import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import DashboardGrid from "./DashboardGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Chatbot from "../chatbot/Chatbot";
import { MessageSquareText } from "lucide-react";
import {
  getRequestorCount,
  getResponderCount,
  getActiveEmergencyCount,
} from "@/lib/database";

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [requestorCount, setRequestorCount] = useState<number>(0);
  const [responderCount, setResponderCount] = useState<number>(0);
  const [activeEmergencyCount, setActiveEmergencyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const [requestors, responders, activeEmergencies] = await Promise.all([
          getRequestorCount(),
          getResponderCount(),
          getActiveEmergencyCount(),
        ]);

        setRequestorCount(requestors);
        setResponderCount(responders);
        setActiveEmergencyCount(activeEmergencies);
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
                {isLoading ? (
                  <div className="text-3xl font-bold">Loading...</div>
                ) : (
                  <div className="text-3xl font-bold">{requestorCount}</div>
                )}
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
                {isLoading ? (
                  <div className="text-3xl font-bold">Loading...</div>
                ) : (
                  <div className="text-3xl font-bold">{responderCount}</div>
                )}
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
                {isLoading ? (
                  <div className="text-3xl font-bold">Loading...</div>
                ) : (
                  <div className="text-3xl font-bold">
                    {activeEmergencyCount}
                  </div>
                )}
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

      {/* Chatbot */}
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="fixed bottom-20 right-4 rounded-full h-12 w-12 shadow-lg"
        size="icon"
      >
        <MessageSquareText size={20} />
      </Button>
    </div>
  );
};

export default DashboardPage;
