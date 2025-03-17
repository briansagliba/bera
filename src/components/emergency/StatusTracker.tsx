import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, AlertCircle, CheckCircle, RefreshCw, Eye } from "lucide-react";

interface EmergencyStatus {
  id: string;
  type: "medical" | "fire" | "police" | "natural";
  status: "pending" | "responding" | "resolved" | "cancelled";
  location: string;
  reportedAt: string;
  updatedAt: string;
  description: string;
}

interface StatusTrackerProps {
  emergencies?: EmergencyStatus[];
  onViewDetails?: (id: string) => void;
  onRefresh?: () => void;
}

const StatusTracker = ({
  emergencies = [
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
  ],
  onViewDetails = (id) => console.log(`View details for emergency ${id}`),
  onRefresh = () => console.log("Refreshing emergency statuses"),
}: StatusTrackerProps) => {
  const getStatusColor = (status: EmergencyStatus["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responding":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: EmergencyStatus["type"]) => {
    switch (type) {
      case "medical":
        return "bg-red-100 text-red-800";
      case "fire":
        return "bg-orange-100 text-orange-800";
      case "police":
        return "bg-blue-100 text-blue-800";
      case "natural":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: EmergencyStatus["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "responding":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Emergency Status Tracker
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <CardDescription>Track your reported emergencies</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto px-6">
          {emergencies.length === 0 ? (
            <div className="py-6 text-center text-gray-500">
              No emergency reports to display
            </div>
          ) : (
            <ul className="space-y-3 py-2">
              {emergencies.map((emergency) => (
                <li
                  key={emergency.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex space-x-2 items-center">
                      <Badge className={getTypeColor(emergency.type)}>
                        {emergency.type.charAt(0).toUpperCase() +
                          emergency.type.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(emergency.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(emergency.status)}
                          {emergency.status.charAt(0).toUpperCase() +
                            emergency.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(emergency.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {emergency.location}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {emergency.description}
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Reported: {formatDate(emergency.reportedAt)}</span>
                    <span>Updated: {formatDate(emergency.updatedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("View all emergencies")}
        >
          View All Emergencies
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatusTracker;
