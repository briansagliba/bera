import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  AlertCircle,
  Ambulance,
  AlertTriangle,
  ShieldAlert,
  Wind,
} from "lucide-react";

interface EmergencyType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface EmergencyReportCardProps {
  onReportEmergency?: (type: string) => void;
  title?: string;
  description?: string;
}

const EmergencyReportCard: React.FC<EmergencyReportCardProps> = ({
  onReportEmergency = () => {},
  title = "Report Emergency",
  description = "Quickly report an emergency situation to get immediate assistance",
}) => {
  const emergencyTypes: EmergencyType[] = [
    {
      id: "medical",
      name: "Medical",
      description: "Medical emergencies requiring ambulance or paramedics",
      icon: <Ambulance className="h-5 w-5" />,
      color: "bg-red-100 text-red-600",
    },
    {
      id: "fire",
      name: "Fire",
      description: "Fire emergencies requiring firefighters",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "police",
      name: "Police",
      description: "Crime or security emergencies requiring police",
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "disaster",
      name: "Natural Disaster",
      description: "Floods, earthquakes, or other natural disasters",
      icon: <Wind className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const handleReportClick = (typeId: string) => {
    onReportEmergency(typeId);
    // In a real implementation, this would navigate to the emergency reporting form
    // or open a modal with the form pre-filled with the selected emergency type
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="bg-red-50 border-b border-red-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-lg text-red-700">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {emergencyTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className={`flex flex-col items-center justify-center h-24 ${type.color} border-2 hover:bg-opacity-80 transition-all`}
              onClick={() => handleReportClick(type.id)}
            >
              <div className="flex flex-col items-center text-center gap-1">
                {type.icon}
                <span className="font-medium">{type.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 bg-gray-50 p-3">
        <Button
          variant="default"
          className="bg-red-600 hover:bg-red-700 text-white w-full"
          onClick={() => handleReportClick("other")}
        >
          Report Other Emergency
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmergencyReportCard;
