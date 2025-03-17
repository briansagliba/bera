import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import StatusTracker from "../emergency/StatusTracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Search,
} from "lucide-react";

interface StatusPageProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const StatusPage: React.FC<StatusPageProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("report");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock emergency data
  const [emergencies, setEmergencies] = useState([
    {
      id: "e-001",
      type: "medical",
      status: "responding",
      location: "123 Main St, Bilar",
      reportedAt: "2023-06-15T10:30:00",
      updatedAt: "2023-06-15T10:45:00",
      description: "Medical emergency requiring ambulance",
    },
    {
      id: "e-002",
      type: "fire",
      status: "pending",
      location: "45 Oak Avenue, Bilar",
      reportedAt: "2023-06-15T11:20:00",
      updatedAt: "2023-06-15T11:20:00",
      description: "Small fire reported in residential area",
    },
    {
      id: "e-003",
      type: "police",
      status: "resolved",
      location: "78 Pine Road, Bilar",
      reportedAt: "2023-06-14T18:15:00",
      updatedAt: "2023-06-14T19:30:00",
      description: "Suspicious activity reported",
    },
  ]);

  // Add the new report if it exists in the URL
  useEffect(() => {
    if (reportId && !emergencies.some((e) => e.id === reportId)) {
      const newEmergency = {
        id: reportId,
        type: "medical",
        status: "pending",
        location: "Current Location, Bilar",
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: "New emergency report",
      };
      setEmergencies([newEmergency, ...emergencies]);
    }
  }, [reportId]);

  // Filter emergencies based on search query and active tab
  const filteredEmergencies = emergencies.filter((emergency) => {
    const matchesSearch =
      emergency.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || emergency.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleViewDetails = (id: string) => {
    console.log(`View details for emergency ${id}`);
    // In a real app, this would navigate to a detailed view or open a modal
  };

  const handleRefresh = () => {
    console.log("Refreshing emergency statuses");
    // In a real app, this would fetch the latest data from the server
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Status Tracker | Bilar Emergency Response</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Emergency Status Tracker</h1>
              <p className="text-muted-foreground">
                Track the status of reported emergencies
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search emergencies..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full md:w-auto grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="responding">Responding</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <EmergencyList
                emergencies={filteredEmergencies}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <EmergencyList
                emergencies={filteredEmergencies}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="responding" className="mt-6">
              <EmergencyList
                emergencies={filteredEmergencies}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="resolved" className="mt-6">
              <EmergencyList
                emergencies={filteredEmergencies}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
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

interface EmergencyListProps {
  emergencies: any[];
  onViewDetails: (id: string) => void;
}

const EmergencyList: React.FC<EmergencyListProps> = ({
  emergencies,
  onViewDetails,
}) => {
  if (emergencies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No emergencies found</h3>
        <p className="text-muted-foreground mt-1">
          No emergency reports match your current filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {emergencies.map((emergency) => (
        <Card key={emergency.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {emergency.type.charAt(0).toUpperCase() +
                    emergency.type.slice(1)}{" "}
                  Emergency
                </CardTitle>
                <CardDescription>{emergency.location}</CardDescription>
              </div>
              <Badge
                variant={
                  emergency.status === "pending"
                    ? "destructive"
                    : emergency.status === "responding"
                      ? "default"
                      : "outline"
                }
                className="ml-2"
              >
                {emergency.status === "pending" && (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {emergency.status === "responding" && (
                  <AlertCircle className="mr-1 h-3 w-3" />
                )}
                {emergency.status === "resolved" && (
                  <CheckCircle className="mr-1 h-3 w-3" />
                )}
                {emergency.status.charAt(0).toUpperCase() +
                  emergency.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{emergency.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <p className="font-medium">Reported:</p>
                <p>{new Date(emergency.reportedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Last Update:</p>
                <p>{new Date(emergency.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewDetails(emergency.id)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StatusPage;
