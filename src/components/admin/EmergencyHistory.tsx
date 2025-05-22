import React, { useState, useEffect } from "react";
import {
  getEmergencies,
  Emergency,
  getUserById,
  getRequestors,
  updateEmergencyStatus,
  assignResponderToEmergency,
} from "@/lib/database";
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
  responderId?: string;
  responderName?: string;
}

const EmergencyHistory: React.FC<EmergencyHistoryProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [emergencies, setEmergencies] = useState<EmergencyRecord[]>([]);

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
          const formattedData = await Promise.all(
            data.map(async (emergency) => {
              // Try to get user details for the requestor
              let requestorName = "Unknown User";
              let requestorPhone = "";
              let requestorImage = "";

              try {
                // First get all requestors to find the one matching this emergency
                const requestors = await getRequestors();

                // Try to match by user_id first
                let requestor = requestors.find(
                  (r) => r.user_id === emergency.user_id,
                );

                // If not found, try to match directly by id (emergency.user_id might be the requestor.id)
                if (!requestor) {
                  requestor = requestors.find(
                    (r) => r.id === emergency.user_id,
                  );
                }

                if (requestor) {
                  // If we found a matching requestor, use their details
                  requestorName = requestor.name || "Unknown User";
                  requestorPhone = requestor.phone || "";
                  console.log(
                    `Found requestor for emergency ${emergency.id}: ${requestorName}`,
                  );
                } else {
                  // If no requestor found, try to get basic user details
                  const user = await getUserById(emergency.user_id);
                  if (user) {
                    requestorName = user.name || "Unknown User";
                    requestorPhone = user.phone || "";
                    console.log(
                      `Found user for emergency ${emergency.id}: ${requestorName}`,
                    );
                  } else {
                    console.log(
                      `No user or requestor found for emergency ${emergency.id} with user_id ${emergency.user_id}`,
                    );
                  }
                }
              } catch (err) {
                console.error("Error fetching requestor details:", err);
              }

              return {
                id: emergency.id,
                type: emergency.type,
                status: emergency.status,
                address: emergency.address || "Unknown location",
                location:
                  typeof emergency.location === "object"
                    ? emergency.location
                    : { lat: 9.6282, lng: 124.0935 },
                reportedAt: emergency.reported_at || new Date().toISOString(),
                priority: emergency.priority,
                description: emergency.description || "",
                requestorId: emergency.user_id,
                requestorName,
                requestorPhone,
                requestorImage:
                  requestorImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${emergency.user_id}`,
                responderId: emergency.responder_id,
                responderName: emergency.responder || "",
              };
            }),
          );

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

  const handleUpdateEmergencyStatus = async (status: string) => {
    if (selectedEmergency) {
      try {
        console.log(
          `Updating emergency ${selectedEmergency.id} status to ${status}`,
        );

        setIsLoading(true);

        // Update the emergency status in the database
        const success = await updateEmergencyStatus(
          selectedEmergency.id,
          status as any,
        );

        if (success) {
          // Update the local state
          const updatedEmergencies = emergencies.map((e) =>
            e.id === selectedEmergency.id ? { ...e, status } : e,
          );
          setEmergencies(updatedEmergencies);
          setSelectedEmergency({ ...selectedEmergency, status });

          // Close the dialog after successful update
          setShowEmergencyDetails(false);

          // Show success message
          alert(`Emergency status updated to: ${status}`);

          // Reload the page to refresh all data
          window.location.reload();
        } else {
          alert("Failed to update emergency status. Please try again.");
        }
      } catch (error) {
        console.error("Error updating emergency status:", error);
        alert("An error occurred while updating the emergency status.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAssignResponder = async (
    emergencyId: string,
    responderId: string,
  ) => {
    try {
      console.log(
        `EmergencyHistory: Attempting to assign responder ${responderId} to emergency ${emergencyId}`,
      );

      // Show loading indicator
      setIsLoading(true);

      const success = await assignResponderToEmergency(
        emergencyId,
        responderId,
      );

      if (success) {
        console.log("Assignment successful in EmergencyHistory");

        // Update the local state
        const updatedEmergencies = emergencies.map((e) =>
          e.id === emergencyId ? { ...e, status: "responding" } : e,
        );
        setEmergencies(updatedEmergencies);

        if (selectedEmergency && selectedEmergency.id === emergencyId) {
          setSelectedEmergency({ ...selectedEmergency, status: "responding" });
        }

        // Close the dialog after successful assignment
        setShowEmergencyDetails(false);

        alert("Responder successfully assigned to the emergency.");

        // Force reload the page to refresh all data
        window.location.reload();
      } else {
        console.error("Assignment returned false in EmergencyHistory");
        alert("Failed to assign responder. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning responder in EmergencyHistory:", error);
      alert("An error occurred while assigning the responder.");
    } finally {
      setIsLoading(false);
    }
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
                            {emergency.responderName && (
                              <p className="text-sm">
                                <span className="font-medium">Responder:</span>{" "}
                                {emergency.responderName}
                              </p>
                            )}
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
          onAssignResponder={(responderId) => {
            console.log(
              `EmergencyHistory: onAssignResponder called with responderId ${responderId}`,
            );
            handleAssignResponder(selectedEmergency.id, responderId);
          }}
          onUpdateStatus={(status) => {
            console.log(
              `EmergencyHistory: onUpdateStatus called with status ${status}`,
            );
            handleUpdateEmergencyStatus(status);
          }}
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
