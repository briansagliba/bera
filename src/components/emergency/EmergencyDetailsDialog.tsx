import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Ambulance,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  User,
} from "lucide-react";

interface EmergencyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emergency: {
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
  };
  responder?: {
    id: string;
    name: string;
    type: string;
    status: string;
    phone?: string;
    imageUrl?: string;
  };
  onMessageRequestor?: () => void;
  onMessageResponder?: () => void;
  onAssignResponder?: () => void;
  onUpdateStatus?: (status: string) => void;
}

const EmergencyDetailsDialog: React.FC<EmergencyDetailsDialogProps> = ({
  open,
  onOpenChange,
  emergency,
  responder,
  onMessageRequestor = () => {},
  onMessageResponder = () => {},
  onAssignResponder = () => {},
  onUpdateStatus = () => {},
}) => {
  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <Ambulance className="h-5 w-5" />;
      case "fire":
        return <AlertTriangle className="h-5 w-5" />;
      case "police":
        return <Shield className="h-5 w-5" />;
      case "disaster":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "responding":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${
                emergency.type === "medical"
                  ? "bg-red-100 text-red-600"
                  : emergency.type === "fire"
                    ? "bg-orange-100 text-orange-600"
                    : emergency.type === "police"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {getEmergencyIcon(emergency.type)}
            </div>
            <span>
              {emergency.type.charAt(0).toUpperCase() + emergency.type.slice(1)}{" "}
              Emergency
            </span>
            <Badge className={getStatusColor(emergency.status)}>
              {emergency.status.charAt(0).toUpperCase() +
                emergency.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Emergency ID: {emergency.id} • Reported:{" "}
            {formatDate(emergency.reportedAt)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="requestor">Requestor</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Location
                </p>
                <p className="text-sm">{emergency.address}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Priority
                </p>
                <Badge variant="outline">
                  {emergency.priority.charAt(0).toUpperCase() +
                    emergency.priority.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-1">
                <FileText className="h-4 w-4" /> Description
              </p>
              <p className="text-sm">
                {emergency.description ||
                  "A serious emergency situation requiring immediate attention."}
              </p>
            </div>

            <div className="pt-2">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d${emergency.location.lng}!3d${emergency.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM4KwMzgnMjkuNCJOIDEyNMKwMDUnNDUuNiJF!5e0!3m2!1sen!2sph!4v1715037600000!5m2!1sen!2sph`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-md"
              ></iframe>
            </div>
          </TabsContent>

          <TabsContent value="requestor" className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {emergency.requestorImage ? (
                  <AvatarImage
                    src={emergency.requestorImage}
                    alt={emergency.requestorName || "Requestor"}
                  />
                ) : (
                  <AvatarFallback>
                    {emergency.requestorName
                      ? emergency.requestorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">
                  {emergency.requestorName || "Unknown Requestor"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> Requestor ID:{" "}
                  {emergency.requestorId || "Unknown"}
                </p>
                {emergency.requestorPhone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {emergency.requestorPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onMessageRequestor}
              >
                <MessageSquare className="h-4 w-4" /> Message Requestor
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  window.open(`tel:${emergency.requestorPhone}`, "_blank");
                }}
                disabled={!emergency.requestorPhone}
              >
                <Phone className="h-4 w-4" /> Call Requestor
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="response" className="space-y-4 py-4">
            {responder ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {responder.imageUrl ? (
                      <AvatarImage
                        src={responder.imageUrl}
                        alt={responder.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {responder.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{responder.name}</h3>
                      <Badge
                        className={
                          responder.status === "available"
                            ? "bg-green-100 text-green-800"
                            : responder.status === "responding"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {responder.status.charAt(0).toUpperCase() +
                          responder.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {responder.type} Unit
                    </p>
                    {responder.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {responder.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={onMessageResponder}
                  >
                    <MessageSquare className="h-4 w-4" /> Message Responder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      window.open(`tel:${responder.phone}`, "_blank");
                    }}
                    disabled={!responder.phone}
                  >
                    <Phone className="h-4 w-4" /> Call Responder
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Response Timeline</p>
                  <ScrollArea className="h-[100px]">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Responder assigned
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              new Date(emergency.reportedAt).getTime() +
                                5 * 60000,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-800 rounded-full p-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Responder en route
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              new Date(emergency.reportedAt).getTime() +
                                10 * 60000,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  No responder assigned yet
                </p>
                <Button onClick={onAssignResponder}>Assign Responder</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {emergency.status === "pending" && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => onUpdateStatus("responding")}
            >
              Mark as Responding
            </Button>
          )}
          {emergency.status === "responding" && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => onUpdateStatus("resolved")}
            >
              Mark as Resolved
            </Button>
          )}
          {emergency.status === "resolved" && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onUpdateStatus("pending")}
            >
              Reopen Emergency
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyDetailsDialog;
