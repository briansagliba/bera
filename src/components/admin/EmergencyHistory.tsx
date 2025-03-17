import React, { useState, useEffect } from "react";
import { getEmergencies, Emergency } from "@/lib/database";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  AlertTriangle,
  Ambulance,
  Shield,
  MessageSquare,
} from "lucide-react";
import EmergencyDetailsDialog from "../emergency/EmergencyDetailsDialog";
import MessageDialog from "../messaging/MessageDialog";

interface EmergencyHistoryProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    type?: string;
  };
}

interface EmergencyRecord {
  id: string;
  type: string;
  status: string;
  address: string;
  location: { lat: number; lng: number };
  reportedAt: string;
  priority: string;
  description?: string;
  requestorId?: string;
  requestorName?: string;
  requestorPhone?: string;
  requestorImage?: string;
}

const EmergencyHistory: React.FC<EmergencyHistoryProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [emergencies, setEmergencies] = useState<EmergencyRecord[]>([
    {
      id: "e1",
      type: "medical",
      status: "pending",
      address: "123 Main St, Bilar",
      location: { lat: 9.6282, lng: 124.0935 },
      reportedAt: "2023-06-15T10:30:00Z",
      priority: "high",
      requestorId: "req1",
      requestorName: "Juan Dela Cruz",
      requestorPhone: "+63 912 345 6789",
      requestorImage:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80",
      description:
        "Patient experiencing severe chest pain and difficulty breathing.",
    },
    {
      id: "e2",
      type: "fire",
      status: "responding",
      address: "456 Oak Ave, Bilar",
      location: { lat: 9.6312, lng: 124.0965 },
      reportedAt: "2023-06-15T11:15:00Z",
      priority: "high",
      requestorId: "req2",
      requestorName: "Armando C. Jumawid",
      requestorPhone: "+63 923 456 7890",
      requestorImage:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
      description:
        "Building fire in residential area, multiple floors affected.",
    },
    {
      id: "e3",
      type: "police",
      status: "resolved",
      address: "789 Pine St, Bilar",
      location: { lat: 9.6252, lng: 124.0915 },
      reportedAt: "2023-06-15T12:00:00Z",
      priority: "medium",
      requestorId: "req3",
      requestorName: "Maria Santos",
      requestorPhone: "+63 934 567 8901",
      description: "Suspicious activity reported in neighborhood.",
    },
  ]);

  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyRecord | null>(null);
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] =
    useState<any>(null);

  useEffect(() => {
    const loadEmergencies = async () => {
      setIsLoading(true);
      try {
        const data = await getEmergencies();
        if (data.length > 0) {
          // Convert database format to component format
          const formattedData = data.map((emergency) => ({
            id: emergency.id,
            type: emergency.type,
            status: emergency.status,
            address: emergency.address,
            location: emergency.location || { lat: 9.6282, lng: 124.0935 },
            reportedAt: emergency.reported_at,
            priority: emergency.priority,
            description: emergency.description,
            requestorId: emergency.user_id,
            requestorName: "User", // Would need to fetch user details in a real app
            requestorPhone: "", // Would need to fetch user details in a real app
          }));
          if (formattedData.length > 0) {
            setEmergencies(formattedData);
          }
        }
      } catch (error) {
        console.error("Error loading emergencies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmergencies();
  }, []);

  const filteredEmergencies = emergencies.filter(
    (emergency) =>
      emergency.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emergency.requestorName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emergency.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleViewDetails = (emergency: EmergencyRecord) => {
    setSelectedEmergency(emergency);
    setShowEmergencyDetails(true);
  };

  const handleUpdateEmergencyStatus = (status: string) => {
    if (selectedEmergency) {
      // In a real app, this would call an API to update the status
      console.log(
        `Updating emergency ${selectedEmergency.id} status to ${status}`,
      );

      // For demo purposes, update the local state
      const updatedEmergencies = emergencies.map((e) =>
        e.id === selectedEmergency.id ? { ...e, status } : e,
      );
      setEmergencies(updatedEmergencies);
      setSelectedEmergency({ ...selectedEmergency, status });
      alert(`Emergency status updated to: ${status}`);
    }
  };

  const handleAssignResponder = () => {
    // In a real app, this would open a dialog to select a responder
    alert("This would open a responder selection dialog");
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Ambulance className="h-5 w-5 text-red-600" />;
      case "fire":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "police":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "disaster":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>;
      case "responding":
        return <Badge>Responding</Badge>;
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Emergency History | Bilar Emergency Response Admin</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Emergency History</h1>
              <p className="text-muted-foreground">
                View past emergency reports and responses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search emergencies..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading emergency history...
                </p>
              </div>
            ) : filteredEmergencies.length > 0 ? (
              filteredEmergencies.map((emergency) => (
                <Card key={emergency.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/4 mb-4 md:mb-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-slate-100">
                          {getEmergencyIcon(emergency.type)}
                        </div>
                      </div>
                      <div className="flex-1 md:ml-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">
                                {emergency.type.charAt(0).toUpperCase() +
                                  emergency.type.slice(1)}{" "}
                                Emergency
                              </h3>
                              {getStatusBadge(emergency.status)}
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">Location:</span>{" "}
                              {emergency.address}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Requestor:</span>{" "}
                              {emergency.requestorName}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Description:</span>{" "}
                              {emergency.description}
                            </p>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>
                                Reported:{" "}
                                {new Date(
                                  emergency.reportedAt,
                                ).toLocaleString()}
                              </span>
                              <span>
                                Priority:{" "}
                                {emergency.priority.charAt(0).toUpperCase() +
                                  emergency.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 mr-2"
                            onClick={() => {
                              setSelectedMessageRecipient({
                                id: emergency.requestorId,
                                name: emergency.requestorName,
                                type: "Requestor",
                                imageUrl: emergency.requestorImage,
                              });
                              setShowMessageDialog(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message Requestor
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(emergency)}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No emergency records found
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 border-t bg-background mb-16 md:mb-0">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2023 Bilar Emergency Response Application. All rights reserved.
          </p>
        </div>
      </footer>

      <BottomBar user={user} />

      {/* Emergency Details Dialog */}
      {selectedEmergency && (
        <EmergencyDetailsDialog
          open={showEmergencyDetails}
          onOpenChange={setShowEmergencyDetails}
          emergency={selectedEmergency}
          onMessageRequestor={() => {
            setShowEmergencyDetails(false);
            setSelectedMessageRecipient({
              id: selectedEmergency.requestorId,
              name: selectedEmergency.requestorName,
              type: "Requestor",
              imageUrl: selectedEmergency.requestorImage,
            });
            setShowMessageDialog(true);
          }}
          onAssignResponder={handleAssignResponder}
          onUpdateStatus={handleUpdateEmergencyStatus}
        />
      )}

      {/* Message Dialog */}
      {selectedMessageRecipient && (
        <MessageDialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          recipient={selectedMessageRecipient}
        />
      )}
    </div>
  );
};

export default EmergencyHistory;
