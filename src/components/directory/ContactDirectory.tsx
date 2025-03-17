import React, { useState } from "react";
import { Search, Phone, MessageSquare, MapPin, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EmergencyContact {
  id: string;
  name: string;
  type: "medical" | "fire" | "police" | "disaster";
  phone: string;
  address: string;
  description: string;
}

interface ContactDirectoryProps {
  contacts?: EmergencyContact[];
}

const ContactDirectory = ({ contacts = [] }: ContactDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Default contacts if none provided
  const defaultContacts: EmergencyContact[] = [
    {
      id: "1",
      name: "Bilar General Hospital",
      type: "medical",
      phone: "+63 38 535 9999",
      address: "123 Health Avenue, Bilar",
      description:
        "Main hospital serving the Bilar area with 24/7 emergency services.",
    },
    {
      id: "2",
      name: "Bilar Fire Department",
      type: "fire",
      phone: "+63 38 535 8888",
      address: "45 Flame Street, Bilar",
      description:
        "Fire emergency response unit covering all of Bilar municipality.",
    },
    {
      id: "3",
      name: "Bilar Police Station",
      type: "police",
      phone: "+63 38 535 7777",
      address: "78 Safety Road, Bilar",
      description:
        "Main police station for emergency law enforcement response.",
    },
    {
      id: "4",
      name: "Disaster Risk Reduction Office",
      type: "disaster",
      phone: "+63 38 535 6666",
      address: "90 Preparedness Blvd, Bilar",
      description:
        "Coordinates natural disaster response and evacuation efforts.",
    },
  ];

  const displayContacts = contacts.length > 0 ? contacts : defaultContacts;

  // Filter contacts based on search query and active tab
  const filteredContacts = displayContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || contact.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-500" />
          Emergency Contact Directory
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search emergency services..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="disaster">Disaster</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {contact.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {contact.address}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-gray-500">No emergency contacts found.</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactDirectory;
