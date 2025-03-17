import React, { useState, useEffect } from "react";
import {
  getResponders,
  deleteResponder,
  Responder as ResponderType,
} from "@/lib/database";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import BottomBar from "../ui/bottombar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil, Trash2 } from "lucide-react";

interface ManageRespondersProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    type?: string;
  };
}

interface Responder {
  id: string;
  name: string;
  email: string;
  phone: string;
  concern?: string;
  formattedDate?: string;
  imageUrl?: string;
}

const ManageResponders: React.FC<ManageRespondersProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    },
  ]);

  const filteredResponders = responders.filter(
    (responder) =>
      responder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.phone.includes(searchQuery),
  );

  useEffect(() => {
    const loadResponders = async () => {
      setIsLoading(true);
      try {
        const data = await getResponders();
        if (data.length > 0) {
          setResponders(data);
        }
      } catch (error) {
        console.error("Error loading responders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResponders();
  }, []);

  const handleDelete = async (id: string) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Manage Responders | Bilar Emergency Response Admin</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Manage Responders</h1>
              <p className="text-muted-foreground">
                View and manage emergency responders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search responders..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Add Responder</Button>
            </div>
          </div>

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
                            <h3 className="text-lg font-semibold">
                              Name: {responder.name}
                            </h3>
                            <p className="text-sm">Email: {responder.email}</p>
                            <p className="text-sm">
                              Phone Number: {responder.phone}
                            </p>
                            <p className="text-sm">
                              Concern: {responder.concern}
                            </p>
                            <p className="text-sm">
                              Formatted Date and Time: {responder.formattedDate}
                            </p>
                          </div>
                          <div className="flex mt-2 md:mt-0 space-x-2">
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
                              onClick={() => handleDelete(responder.id)}
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

export default ManageResponders;
