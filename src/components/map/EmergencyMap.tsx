import React, { useState, useEffect } from "react";
import MessageDialog from "../messaging/MessageDialog";
import EmergencyDetailsDialog from "../emergency/EmergencyDetailsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Ambulance,
  FileSearch,
  Filter,
  MapPin,
  RefreshCw,
  Shield,
  MessageSquare,
  Users,
  Loader2,
} from "lucide-react";
import { useEmergencies, EmergencyLocation } from "@/hooks/useEmergencies";
import { getResponders, assignResponderToEmergency } from "@/lib/database";

interface EmergencyLocation {
  id: string;
  type: "medical" | "fire" | "police" | "disaster";
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: "pending" | "responding" | "resolved";
  reportedAt: string;
  priority: "high" | "medium" | "low";
  requestorId?: string;
  requestorName?: string;
}

interface ResponseUnit {
  id: string;
  type: "medical" | "fire" | "police";
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: "available" | "responding" | "unavailable";
  respondingTo?: string; // ID of emergency being responded to
  phone?: string;
  email?: string;
}

interface EmergencyMapProps {
  emergencies?: EmergencyLocation[];
  responseUnits?: ResponseUnit[];
  onEmergencySelect?: (emergency: EmergencyLocation) => void;
  onUnitSelect?: (unit: ResponseUnit) => void;
  onFilterChange?: (filters: any) => void;
}

const EmergencyMap = ({
  emergencies: emergenciesFromProps,
  responseUnits: responseUnitsFromProps,
  onEmergencySelect = () => {},
  onUnitSelect = () => {},
  onFilterChange = () => {},
}: EmergencyMapProps) => {
  // Default response units if none provided from props
  const defaultResponseUnits = [
    {
      id: "u1",
      type: "medical",
      name: "Ambulance Unit 1",
      location: { lat: 9.6292, lng: 124.0945 },
      status: "available",
      phone: "09662826687",
      email: "ambulance1@bilar.gov.ph",
    },
    {
      id: "u2",
      type: "fire",
      name: "Fire Truck 1",
      location: { lat: 9.6302, lng: 124.0955 },
      status: "responding",
      respondingTo: "e2",
      phone: "09662826688",
      email: "firetruck1@bilar.gov.ph",
    },
    {
      id: "u3",
      type: "police",
      name: "Police Unit 2",
      location: { lat: 9.6272, lng: 124.0925 },
      status: "available",
      phone: "09662826689",
      email: "police2@bilar.gov.ph",
    },
  ];

  // Use response units from props if provided, otherwise use default
  const responseUnits = responseUnitsFromProps || defaultResponseUnits;
  const { emergencies: dbEmergencies, loading: emergenciesLoading } =
    useEmergencies();
  const [activeTab, setActiveTab] = useState("map");
  const [loadingResponders, setLoadingResponders] = useState(false);
  const [responderUnits, setResponderUnits] = useState<ResponseUnit[]>([]);

  // Use emergencies from props if provided, otherwise use from hook
  const emergencies = emergenciesFromProps || dbEmergencies;

  // Track which emergencies have responders assigned to them
  const [emergencyResponderMap, setEmergencyResponderMap] = useState<
    Record<string, string>
  >({});

  // Fetch responders from Supabase if no response units provided from props
  useEffect(() => {
    if (!responseUnitsFromProps) {
      const fetchResponders = async () => {
        setLoadingResponders(true);
        try {
          const responders = await getResponders();
          if (responders.length > 0) {
            // Create a map of emergency IDs to responder IDs
            const emergencyToResponderMap: Record<string, string> = {};

            // Convert responders to response units format
            const units: ResponseUnit[] = responders.map((responder) => {
              // If responder is responding to an emergency, add to the map
              if (
                responder.status === "responding" &&
                responder.responding_to
              ) {
                emergencyToResponderMap[responder.responding_to] = responder.id;
              }

              return {
                id: responder.id,
                type:
                  (responder.type as "medical" | "fire" | "police") ||
                  "medical",
                name: responder.name,
                location: {
                  lat: 9.6282 + Math.random() * 0.01,
                  lng: 124.0935 + Math.random() * 0.01,
                }, // Random location near Bilar
                status: responder.status as
                  | "available"
                  | "responding"
                  | "unavailable",
                respondingTo: responder.responding_to,
                phone: responder.phone || undefined,
                email: responder.email,
              };
            });

            setEmergencyResponderMap(emergencyToResponderMap);
            setResponderUnits(units);
          }
        } catch (error) {
          console.error("Error fetching responders:", error);
        } finally {
          setLoadingResponders(false);
        }
      };

      fetchResponders();
    }
  }, [responseUnitsFromProps]);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyLocation | null>(null);
  const [filters, setFilters] = useState({
    emergencyTypes: {
      medical: true,
      fire: true,
      police: true,
      disaster: true,
    },
    status: {
      pending: true,
      responding: true,
      resolved: false,
    },
    priority: {
      high: true,
      medium: true,
      low: true,
    },
    radius: 5, // km
  });

  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] =
    useState<any>(null);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [onlineResponders, setOnlineResponders] = useState([
    {
      id: "r1",
      name: "Dr. Maria Santos",
      type: "Medical",
      status: "online",
      lastActive: "Just now",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      id: "r2",
      name: "Officer Juan Cruz",
      type: "Police",
      status: "online",
      lastActive: "2 min ago",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    },
    {
      id: "r3",
      name: "Firefighter Pedro Reyes",
      type: "Fire",
      status: "busy",
      lastActive: "5 min ago",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    },
  ]);

  const [onlineRequestors, setOnlineRequestors] = useState([
    {
      id: "req1",
      name: "Juan Dela Cruz",
      status: "emergency",
      lastActive: "Just now",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=JuanDC",
    },
    {
      id: "req2",
      name: "Armando C. Jumawid",
      status: "emergency",
      lastActive: "3 min ago",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Armando",
    },
    {
      id: "req3",
      name: "Maria Santos",
      status: "safe",
      lastActive: "10 min ago",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaSantos",
    },
  ]);

  const handleEmergencyClick = (emergency: EmergencyLocation) => {
    setSelectedEmergency(emergency);
    setShowEmergencyDetails(true);
    onEmergencySelect(emergency);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    onFilterChange({ ...filters, ...newFilters });
  };

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Ambulance className="h-4 w-4" />;
      case "fire":
        return <AlertTriangle className="h-4 w-4" />;
      case "police":
        return <Shield className="h-4 w-4" />;
      case "disaster":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500";
      case "responding":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleUpdateEmergencyStatus = async (status: string) => {
    if (selectedEmergency) {
      try {
        // In a real app, this would call an API to update the status
        console.log(
          `Updating emergency ${selectedEmergency.id} status to ${status}`,
        );

        // For demo purposes, update the local state
        const updatedEmergencies = emergencies.map((e) =>
          e.id === selectedEmergency.id ? { ...e, status } : e,
        );

        // Update the selected emergency
        setSelectedEmergency({
          ...selectedEmergency,
          status: status as "pending" | "responding" | "resolved",
        });

        // Close the dialog after successful update
        setShowEmergencyDetails(false);

        // Show success message
        alert(`Emergency status updated to: ${status}`);

        // In a real implementation, we would reload data from the server
      } catch (error) {
        console.error("Error updating emergency status:", error);
        alert("An error occurred while updating the emergency status.");
      }
    }
  };

  const handleAssignResponder = async (responderId: string) => {
    if (!selectedEmergency) {
      console.error("No emergency selected for assignment");
      alert("No emergency selected. Please select an emergency first.");
      return;
    }

    try {
      const emergencyId = selectedEmergency.id;
      console.log(
        `Attempting to assign responder ${responderId} to emergency ${emergencyId}`,
      );

      // Call the database function to assign the responder
      const success = await assignResponderToEmergency(
        emergencyId,
        responderId,
      );

      if (success) {
        console.log("Assignment successful, updating UI");

        // Update the emergency-responder mapping
        setEmergencyResponderMap((prev) => ({
          ...prev,
          [emergencyId]: responderId,
        }));

        // Update the responder units to show they're responding to this emergency
        const updatedResponderUnits = responderUnits.map((unit) =>
          unit.id === responderId
            ? { ...unit, status: "responding", respondingTo: emergencyId }
            : unit,
        );
        setResponderUnits(updatedResponderUnits);

        // Update the selected emergency status
        setSelectedEmergency({
          ...selectedEmergency,
          status: "responding",
        });

        alert("Responder successfully assigned to the emergency.");
        setShowEmergencyDetails(false); // Close the dialog after successful assignment
      } else {
        console.error("Assignment returned false");
        alert("Failed to assign responder. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning responder:", error);
      alert("An error occurred while assigning the responder.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Emergency Map</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
            >
              <Users className="h-4 w-4" />
              {showOnlineUsers ? "Hide Users" : "Show Users"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="map"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="emergencies">Emergencies</TabsTrigger>
              <TabsTrigger value="units">Response Units</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="m-0">
            {/* Online Users Panel - Only show when toggled */}
            {showOnlineUsers && (
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md text-xs z-10 w-48">
                <h4 className="font-medium mb-1">Online Responders</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {onlineResponders.map((responder) => (
                    <div
                      key={responder.id}
                      className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 p-1 rounded"
                      onClick={() => {
                        setSelectedMessageRecipient({
                          id: responder.id,
                          name: responder.name,
                          type: responder.type,
                          status: responder.status,
                          imageUrl: responder.imageUrl,
                        });
                        setShowMessageDialog(true);
                      }}
                    >
                      <div className="relative">
                        <img
                          src={responder.imageUrl}
                          alt={responder.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${responder.status === "online" ? "bg-green-500" : "bg-yellow-500"}`}
                        ></span>
                      </div>
                      <span className="truncate">{responder.name}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-medium mb-1 mt-3">Active Requestors</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {onlineRequestors.map((requestor) => (
                    <div
                      key={requestor.id}
                      className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 p-1 rounded"
                      onClick={() => {
                        setSelectedMessageRecipient({
                          id: requestor.id,
                          name: requestor.name,
                          type: "Requestor",
                          status: requestor.status,
                          imageUrl: requestor.imageUrl,
                        });
                        setShowMessageDialog(true);
                      }}
                    >
                      <div className="relative">
                        <img
                          src={requestor.imageUrl}
                          alt={requestor.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${requestor.status === "emergency" ? "bg-red-500" : "bg-green-500"}`}
                        ></span>
                      </div>
                      <span className="truncate">{requestor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="relative w-full h-[600px] bg-slate-100 overflow-hidden mx-auto">
              {/* Embedded Google Map of Bilar, Bohol, Philippines */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31544.037414916395!2d124.08019687431642!3d9.628199900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aa4c8fb3ae5d7d%3A0x7c8f2ecf72a4c5ac!2sBilar%2C%20Bohol!5e0!3m2!1sen!2sph!4v1715037600000!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Map overlay with emergency information */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md text-xs">
                <p className="font-medium">Bilar, Bohol (6317)</p>
                <p className="text-muted-foreground">
                  Showing {emergencies.length} emergencies and{" "}
                  {responseUnits.length} response units
                </p>
              </div>

              {/* Map markers would be rendered here */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Map Legend</h3>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span>Medical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                    <span>Fire</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span>Police</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span>Disaster</span>
                  </div>
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                      <span>Responding</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-2">Filter Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium mb-1">Emergency Types</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-medical"
                        checked={filters.emergencyTypes.medical}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            emergencyTypes: {
                              ...filters.emergencyTypes,
                              medical: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="filter-medical" className="text-xs">
                        Medical
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-fire"
                        checked={filters.emergencyTypes.fire}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            emergencyTypes: {
                              ...filters.emergencyTypes,
                              fire: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="filter-fire" className="text-xs">
                        Fire
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-police"
                        checked={filters.emergencyTypes.police}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            emergencyTypes: {
                              ...filters.emergencyTypes,
                              police: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="filter-police" className="text-xs">
                        Police
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-disaster"
                        checked={filters.emergencyTypes.disaster}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            emergencyTypes: {
                              ...filters.emergencyTypes,
                              disaster: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="filter-disaster" className="text-xs">
                        Disaster
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium mb-1">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-pending"
                        checked={filters.status.pending}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            status: { ...filters.status, pending: checked },
                          })
                        }
                      />
                      <Label htmlFor="filter-pending" className="text-xs">
                        Pending
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-responding"
                        checked={filters.status.responding}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            status: { ...filters.status, responding: checked },
                          })
                        }
                      />
                      <Label htmlFor="filter-responding" className="text-xs">
                        Responding
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="filter-resolved"
                        checked={filters.status.resolved}
                        onCheckedChange={(checked) =>
                          handleFilterChange({
                            status: { ...filters.status, resolved: checked },
                          })
                        }
                      />
                      <Label htmlFor="filter-resolved" className="text-xs">
                        Resolved
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-medium mb-1">
                  Search Radius: {filters.radius} km
                </h4>
                <Slider
                  value={[filters.radius]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) =>
                    handleFilterChange({ radius: value[0] })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="emergencies"
            className="m-0 p-4 max-h-[400px] overflow-y-auto"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Active Emergencies</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="disaster">Disaster</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {emergenciesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm">Loading emergencies...</span>
                </div>
              ) : emergencies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No active emergencies
                  </p>
                </div>
              ) : (
                emergencies.map((emergency) => (
                  <div
                    key={emergency.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors",
                      selectedEmergency?.id === emergency.id
                        ? "border-primary bg-primary/5"
                        : emergency.status === "pending"
                          ? "border-red-200"
                          : emergency.status === "responding"
                            ? "border-yellow-200"
                            : "border-green-200",
                    )}
                    onClick={() => handleEmergencyClick(emergency)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            emergency.type === "medical"
                              ? "bg-red-100 text-red-600"
                              : emergency.type === "fire"
                                ? "bg-orange-100 text-orange-600"
                                : emergency.type === "police"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-yellow-100 text-yellow-600",
                          )}
                        >
                          {getEmergencyIcon(emergency.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">
                            {emergency.type.charAt(0).toUpperCase() +
                              emergency.type.slice(1)}{" "}
                            Emergency
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {emergency.address}
                          </p>
                          {emergency.requestorName && (
                            <p className="text-xs font-medium">
                              Requestor: {emergency.requestorName}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          emergency.status === "pending"
                            ? "destructive"
                            : emergency.status === "responding"
                              ? "default"
                              : "outline"
                        }
                        className={
                          emergency.status === "resolved"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : ""
                        }
                      >
                        {emergency.status.charAt(0).toUpperCase() +
                          emergency.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileSearch className="h-3 w-3" />
                        <span>
                          Reported{" "}
                          {new Date(emergency.reportedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Priority:{" "}
                        {emergency.priority.charAt(0).toUpperCase() +
                          emergency.priority.slice(1)}
                      </Badge>
                    </div>
                    {/* Show responder info if someone is responding */}
                    {emergency.status === "responding" && (
                      <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                        <p className="font-medium">
                          Responder:{" "}
                          {responseUnits.find(
                            (unit) => unit.respondingTo === emergency.id,
                          )?.name ||
                            responderUnits.find(
                              (unit) => unit.respondingTo === emergency.id,
                            )?.name ||
                            "Unknown"}
                        </p>
                        <p>ETA: ~10 minutes</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="units"
            className="m-0 p-4 max-h-[400px] overflow-y-auto"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Response Units</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {responseUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => onUnitSelect(unit)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          unit.type === "medical"
                            ? "bg-red-100 text-red-600"
                            : unit.type === "fire"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600",
                        )}
                      >
                        {getEmergencyIcon(unit.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{unit.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {unit.type.charAt(0).toUpperCase() +
                            unit.type.slice(1)}{" "}
                          Unit
                        </p>
                        {unit.phone && <p className="text-xs">{unit.phone}</p>}
                      </div>
                    </div>
                    <Badge
                      variant={
                        unit.status === "available"
                          ? "success"
                          : unit.status === "responding"
                            ? "default"
                            : "secondary"
                      }
                      className={
                        unit.status === "available"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : ""
                      }
                    >
                      {unit.status.charAt(0).toUpperCase() +
                        unit.status.slice(1)}
                    </Badge>
                  </div>
                  {unit.respondingTo && (
                    <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                      <p className="font-medium">Responding to:</p>
                      <p>
                        {emergencies
                          .find((e) => e.id === unit.respondingTo)
                          ?.type.charAt(0)
                          .toUpperCase() +
                          emergencies
                            .find((e) => e.id === unit.respondingTo)
                            ?.type.slice(1)}{" "}
                        emergency at{" "}
                        {
                          emergencies.find((e) => e.id === unit.respondingTo)
                            ?.address
                        }
                      </p>
                      <div className="flex justify-between mt-1">
                        <span>ETA: ~10 minutes</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            const emergency = emergencies.find(
                              (e) => e.id === unit.respondingTo,
                            );
                            if (emergency) {
                              setSelectedEmergency(emergency);
                              setShowEmergencyDetails(true);
                            }
                          }}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessageRecipient({
                          id: unit.id,
                          name: unit.name,
                          type: `${unit.type} Unit`,
                          status: unit.status,
                          email: unit.email,
                        });
                        setShowMessageDialog(true);
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" /> Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const EmergencyMapWithDialogs = (props: EmergencyMapProps) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] =
    useState<any>(null);
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyLocation | null>(null);

  return (
    <>
      <EmergencyMap
        {...props}
        onEmergencySelect={(emergency) => {
          setSelectedEmergency(emergency);
          setShowEmergencyDetails(true);
          if (props.onEmergencySelect) props.onEmergencySelect(emergency);
        }}
        onUnitSelect={(unit) => {
          if (props.onUnitSelect) props.onUnitSelect(unit);
        }}
      />

      {/* Message Dialog */}
      {selectedMessageRecipient && (
        <MessageDialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          recipient={selectedMessageRecipient}
        />
      )}

      {/* Emergency Details Dialog */}
      {selectedEmergency && (
        <EmergencyDetailsDialog
          open={showEmergencyDetails}
          onOpenChange={setShowEmergencyDetails}
          emergency={{
            ...selectedEmergency,
            description:
              "Patient experiencing severe chest pain and difficulty breathing. Requires immediate medical attention.",
            requestorPhone: "+63 912 345 6789",
          }}
          responder={
            selectedEmergency.status === "responding"
              ? props.responseUnits?.find(
                  (unit) => unit.respondingTo === selectedEmergency.id,
                )
              : undefined
          }
          onMessageRequestor={() => {
            setShowEmergencyDetails(false);
            setSelectedMessageRecipient({
              id: selectedEmergency.requestorId,
              name: selectedEmergency.requestorName,
              type: "Requestor",
            });
            setShowMessageDialog(true);
          }}
          onMessageResponder={() => {
            const responder = props.responseUnits?.find(
              (unit) => unit.respondingTo === selectedEmergency.id,
            );
            if (responder) {
              setShowEmergencyDetails(false);
              setSelectedMessageRecipient({
                id: responder.id,
                name: responder.name,
                type: `${responder.type} Unit`,
                status: responder.status,
              });
              setShowMessageDialog(true);
            }
          }}
          onAssignResponder={async (responderId) => {
            if (selectedEmergency && responderId) {
              try {
                console.log(
                  `EmergencyMapWithDialogs: Assigning responder ${responderId} to emergency ${selectedEmergency.id}`,
                );

                // Call the database function to assign the responder
                const success = await assignResponderToEmergency(
                  selectedEmergency.id,
                  responderId,
                );

                if (success) {
                  console.log(
                    "Assignment successful in EmergencyMapWithDialogs",
                  );

                  // Update the selected emergency status locally
                  setSelectedEmergency({
                    ...selectedEmergency,
                    status: "responding",
                  });

                  // Close the dialog after successful assignment
                  setShowEmergencyDetails(false);

                  // Show success message
                  alert("Responder successfully assigned to the emergency.");

                  // Force reload the page to refresh all data
                  window.location.reload();
                } else {
                  console.error(
                    "Assignment returned false in EmergencyMapWithDialogs",
                  );
                  alert("Failed to assign responder. Please try again.");
                }
              } catch (error) {
                console.error(
                  "Error assigning responder in EmergencyMapWithDialogs:",
                  error,
                );
                alert("An error occurred while assigning the responder.");
              }
            } else {
              console.error("Missing emergency or responder ID", {
                emergency: selectedEmergency,
                responderId,
              });
              alert(
                "Missing emergency or responder information. Please try again.",
              );
            }
          }}
          onUpdateStatus={(status) => {
            alert(`Emergency status updated to: ${status}`);
            setSelectedEmergency({
              ...selectedEmergency,
              status: status as "pending" | "responding" | "resolved",
            });
          }}
        />
      )}
    </>
  );
};

export default EmergencyMapWithDialogs;
