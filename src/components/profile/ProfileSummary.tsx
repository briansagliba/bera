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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User, Settings, Bell, Shield, Phone, Heart, Edit } from "lucide-react";

interface ProfileSummaryProps {
  name?: string;
  email?: string;
  phone?: string;
  emergencyContacts?: Array<{ name: string; relation: string; phone: string }>;
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  avatarUrl?: string;
}

const ProfileSummary = ({
  name = "John Doe",
  email = "john.doe@example.com",
  phone = "+63 912 345 6789",
  emergencyContacts = [
    { name: "Jane Doe", relation: "Spouse", phone: "+63 923 456 7890" },
    { name: "Mark Smith", relation: "Brother", phone: "+63 934 567 8901" },
  ],
  medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Lisinopril"],
    conditions: ["Hypertension"],
  },
  avatarUrl = "",
}: ProfileSummaryProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Profile Summary</CardTitle>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Your personal and medical information</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-col space-y-4">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <div className="flex flex-col text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {phone}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mt-2">
            <h4 className="text-sm font-semibold flex items-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-500" /> Medical Information
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-medium">Blood Type:</span>{" "}
                {medicalInfo.bloodType}
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-medium">Allergies:</span>{" "}
                {medicalInfo.allergies.join(", ")}
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-medium">Medications:</span>{" "}
                {medicalInfo.medications.join(", ")}
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="font-medium">Conditions:</span>{" "}
                {medicalInfo.conditions.join(", ")}
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-2">
            <h4 className="text-sm font-semibold flex items-center gap-1 mb-1">
              <Phone className="h-4 w-4 text-blue-500" /> Emergency Contacts
            </h4>
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {contact.relation}
                    </div>
                  </div>
                  <div className="text-sm">{contact.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" /> Settings
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Bell className="h-4 w-4" /> Notifications
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Shield className="h-4 w-4" /> Privacy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSummary;
