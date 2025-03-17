import React, { useState, useEffect } from "react";
import {
  getRequestors,
  deleteRequestor,
  Requestor as RequestorType,
} from "@/lib/database";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil, Trash2 } from "lucide-react";

interface ManageRequestorsProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    type?: string;
  };
}

interface Requestor {
  id: string;
  name: string;
  email: string;
  phone: string;
  situation?: string;
  concern?: string;
  formattedDate?: string;
  imageUrl?: string;
}

const ManageRequestors: React.FC<ManageRequestorsProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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

  const filteredRequestors = requestors.filter(
    (requestor) =>
      requestor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requestor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requestor.phone.includes(searchQuery),
  );

  useEffect(() => {
    const loadRequestors = async () => {
      setIsLoading(true);
      try {
        const data = await getRequestors();
        if (data.length > 0) {
          setRequestors(data);
        }
      } catch (error) {
        console.error("Error loading requestors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequestors();
  }, []);

  const handleDelete = async (id: string) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Manage Requestors | Bilar Emergency Response Admin</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manage Requestors</h1>
              <p className="text-muted-foreground">
                View and manage emergency requestors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search requestors..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-2">
              <TabsTrigger value="all">All Requestors</TabsTrigger>
              <TabsTrigger value="active">Active Emergencies</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
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
                                  Name: {requestor.name}
                                </h3>
                                <p className="text-sm">
                                  Email: {requestor.email}
                                </p>
                                <p className="text-sm">
                                  Phone Number: {requestor.phone}
                                </p>
                                {requestor.situation && (
                                  <p className="text-sm">
                                    Situation: {requestor.situation}
                                  </p>
                                )}
                                {requestor.concern && (
                                  <p className="text-sm">
                                    Concern: {requestor.concern}
                                  </p>
                                )}
                                <p className="text-sm">
                                  Formatted Date and Time:{" "}
                                  {requestor.formattedDate}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(requestor.id)}
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

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredRequestors
                  .filter((r) => r.concern && r.situation)
                  .map((requestor) => (
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
                                  User Name: {requestor.name}
                                </h3>
                                <p className="text-sm">
                                  User Situation: {requestor.situation}
                                </p>
                                <p className="text-sm">
                                  User Concern: {requestor.concern}
                                </p>
                                <p className="text-sm">
                                  Phone Num: {requestor.phone}
                                </p>
                                <p className="text-sm">
                                  Formatted Date and Time:{" "}
                                  {requestor.formattedDate}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDelete(requestor.id)}
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
    </div>
  );
};

export default ManageRequestors;
