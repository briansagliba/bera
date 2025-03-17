import React, { useState, useEffect } from "react";
import MessageDialog from "../messaging/MessageDialog";
import {
  getRequestors,
  getResponders,
  deleteRequestor,
  deleteResponder,
  Requestor as RequestorType,
  Responder as ResponderType,
} from "@/lib/database";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Pencil, Trash2, MessageSquare, MapPin } from "lucide-react";

interface ManageUsersProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    type?: string;
  };
}

const ManageUsers: React.FC<ManageUsersProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Combined state for both requestors and responders
  const [requestors, setRequestors] = useState<RequestorType[]>([
    {
      id: "1",
      name: "Juan Dela Cruz",
      email: "juandelacruz@gmail.com",
      phone: "09276382662",
      situation: "gsjsjsb",
      concern: "Medical",
      formattedDate: "4/9/2024 11:30 PM",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80",
    },
    {
      id: "2",
      name: "Armando C. Jumawid",
      email: "armando.jumawid@gmail.com",
      phone: "09066910713",
      situation: "motorcycle accident in bisu",
      concern: "Fire, Police",
      formattedDate: "4/9/2024 11:42 PM",
      imageUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
    },
  ]);

  const [responders, setResponders] = useState<ResponderType[]>([
    {
      id: "1",
      name: "Warlito Responder",
      email: "responder@gmail.com",
      phone: "09662826687",
      concern: "No data available",
      formattedDate: "4/9/2024 7:26 PM",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      status: "available",
    },
    {
      id: "2",
      name: "Armando Jumawid Jr.",
      email: "armando.jumawid01@gmail.com",
      phone: "09066910713",
      concern: "No data available",
      formattedDate: "4/9/2024 11:42 PM",
      imageUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
      status: "responding",
    },
  ]);

  // Filter based on search query and active tab
  const filteredRequestors = requestors.filter(
    (requestor) =>
      (activeTab === "all" || activeTab === "requestors") &&
      (requestor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requestor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        requestor.phone.includes(searchQuery)),
  );

  const filteredResponders = responders.filter(
    (responder) =>
      (activeTab === "all" || activeTab === "responders") &&
      (responder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        responder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        responder.phone.includes(searchQuery)),
  );

  // Get active emergencies (requestors with situation and concern)
  const activeEmergencies = requestors.filter(
    (r) =>
      r.concern &&
      r.situation &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)),
  );

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // Load both requestors and responders
        const requestorData = await getRequestors();
        const responderData = await getResponders();

        if (requestorData.length > 0) {
          setRequestors(requestorData);
        }

        if (responderData.length > 0) {
          setResponders(responderData);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDeleteRequestor = async (id: string) => {
    if (confirm("Are you sure you want to delete this requestor?")) {
      try {
        const success = await deleteRequestor(id);
        if (success) {
          setRequestors(requestors.filter((requestor) => requestor.id !== id));
        }
      } catch (error) {
        console.error("Error deleting requestor:", error);
      }
    }
  };

  const handleDeleteResponder = async (id: string) => {
    if (confirm("Are you sure you want to delete this responder?")) {
      try {
        const success = await deleteResponder(id);
        if (success) {
          setResponders(responders.filter((responder) => responder.id !== id));
        }
      } catch (error) {
        console.error("Error deleting responder:", error);
      }
    }
  };

  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] =
    useState<any>(null);

  const handleMessageUser = (user: any) => {
    console.log(`Messaging user: ${user.name}`);
    setSelectedMessageRecipient({
      id: user.id,
      name: user.name,
      type: user.status ? `Responder (${user.status})` : "Requestor",
      imageUrl: user.imageUrl,
    });
    setShowMessageDialog(true);
  };

  const handleViewOnMap = (user: any) => {
    console.log(`Viewing user on map: ${user.name}`);
    // In a real app, this would highlight the user on the map
    alert(`Highlighting ${user.name} on the map`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "responding":
        return <Badge className="bg-blue-100 text-blue-800">Responding</Badge>;
      case "unavailable":
        return <Badge className="bg-gray-100 text-gray-800">Unavailable</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Manage Users | Bilar Emergency Response Admin</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <p className="text-muted-foreground">
                View and manage emergency requestors and responders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() =>
                  alert("Add responder functionality would open here")
                }
              >
                Add Responder
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-3">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="requestors">Requestors</TabsTrigger>
              <TabsTrigger value="responders">Responders</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                      Loading users...
                    </p>
                  </div>
                ) : filteredRequestors.length > 0 ||
                  filteredResponders.length > 0 ? (
                  <>
                    {/* Responders Section */}
                    {filteredResponders.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">
                          Responders
                        </h2>
                        {filteredResponders.map((responder) => (
                          <Card
                            key={`responder-${responder.id}`}
                            className="overflow-hidden mb-4"
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row items-center">
                                <div className="w-full md:w-1/6 mb-4 md:mb-0">
                                  <img
                                    src={
                                      responder.imageUrl ||
                                      "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                        responder.id
                                    }
                                    alt={responder.name}
                                    className="w-24 h-24 object-cover rounded-md mx-auto"
                                  />
                                </div>
                                <div className="flex-1 md:ml-4">
                                  <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">
                                          {responder.name}
                                        </h3>
                                        {getStatusBadge(responder.status)}
                                      </div>
                                      <p className="text-sm">
                                        Email: {responder.email}
                                      </p>
                                      <p className="text-sm">
                                        Phone Number: {responder.phone}
                                      </p>
                                      <p className="text-sm">Type: Responder</p>
                                      <p className="text-sm">
                                        Registered: {responder.formattedDate}
                                      </p>
                                    </div>
                                    <div className="flex mt-2 md:mt-0 space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          handleMessageUser(responder)
                                        }
                                      >
                                        <MessageSquare className="h-4 w-4" />
                                        Message
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          handleViewOnMap(responder)
                                        }
                                      >
                                        <MapPin className="h-4 w-4" />
                                        View on Map
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                      >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                        onClick={() =>
                                          handleDeleteResponder(responder.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Requestors Section */}
                    {filteredRequestors.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-3">
                          Requestors
                        </h2>
                        {filteredRequestors.map((requestor) => (
                          <Card
                            key={`requestor-${requestor.id}`}
                            className="overflow-hidden mb-4"
                          >
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/4 p-4">
                                  <img
                                    src={
                                      requestor.imageUrl ||
                                      "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                        requestor.id
                                    }
                                    alt={requestor.name}
                                    className="w-full h-40 object-cover rounded-md"
                                  />
                                </div>
                                <div className="flex-1 p-4">
                                  <div className="flex justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold">
                                        {requestor.name}
                                      </h3>
                                      <p className="text-sm">
                                        Email: {requestor.email}
                                      </p>
                                      <p className="text-sm">
                                        Phone Number: {requestor.phone}
                                      </p>
                                      {requestor.situation && (
                                        <p className="text-sm">
                                          <span className="font-medium">
                                            Situation:
                                          </span>{" "}
                                          {requestor.situation}
                                        </p>
                                      )}
                                      {requestor.concern && (
                                        <p className="text-sm">
                                          <span className="font-medium">
                                            Concern:
                                          </span>{" "}
                                          {requestor.concern}
                                        </p>
                                      )}
                                      <p className="text-sm">
                                        Registered: {requestor.formattedDate}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          handleMessageUser(requestor)
                                        }
                                      >
                                        <MessageSquare className="h-4 w-4" />
                                        Message
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() =>
                                          handleViewOnMap(requestor)
                                        }
                                      >
                                        <MapPin className="h-4 w-4" />
                                        View on Map
                                      </Button>
                                      <Button variant="ghost" size="icon">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() =>
                                          handleDeleteRequestor(requestor.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requestors" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                      Loading requestors...
                    </p>
                  </div>
                ) : filteredRequestors.length > 0 ? (
                  filteredRequestors.map((requestor) => (
                    <Card key={requestor.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4 p-4">
                            <img
                              src={
                                requestor.imageUrl ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                  requestor.id
                              }
                              alt={requestor.name}
                              className="w-full h-40 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {requestor.name}
                                </h3>
                                <p className="text-sm">
                                  Email: {requestor.email}
                                </p>
                                <p className="text-sm">
                                  Phone Number: {requestor.phone}
                                </p>
                                {requestor.situation && (
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Situation:
                                    </span>{" "}
                                    {requestor.situation}
                                  </p>
                                )}
                                {requestor.concern && (
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Concern:
                                    </span>{" "}
                                    {requestor.concern}
                                  </p>
                                )}
                                <p className="text-sm">
                                  Registered: {requestor.formattedDate}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleMessageUser(requestor)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Message
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleViewOnMap(requestor)}
                                >
                                  <MapPin className="h-4 w-4" />
                                  View on Map
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteRequestor(requestor.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No requestors found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="responders" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                      Loading responders...
                    </p>
                  </div>
                ) : filteredResponders.length > 0 ? (
                  filteredResponders.map((responder) => (
                    <Card key={responder.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row items-center">
                          <div className="w-full md:w-1/6 mb-4 md:mb-0">
                            <img
                              src={
                                responder.imageUrl ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                                  responder.id
                              }
                              alt={responder.name}
                              className="w-24 h-24 object-cover rounded-md mx-auto"
                            />
                          </div>
                          <div className="flex-1 md:ml-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-semibold">
                                    {responder.name}
                                  </h3>
                                  {getStatusBadge(responder.status)}
                                </div>
                                <p className="text-sm">
                                  Email: {responder.email}
                                </p>
                                <p className="text-sm">
                                  Phone Number: {responder.phone}
                                </p>
                                <p className="text-sm">Type: Responder</p>
                                <p className="text-sm">
                                  Registered: {responder.formattedDate}
                                </p>
                              </div>
                              <div className="flex mt-2 md:mt-0 space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleMessageUser(responder)}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Message
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleViewOnMap(responder)}
                                >
                                  <MapPin className="h-4 w-4" />
                                  View on Map
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteResponder(responder.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No responders found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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

export default ManageUsers;
