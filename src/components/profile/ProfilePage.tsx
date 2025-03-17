import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import ProfileSummary from "./ProfileSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Bell,
  Shield,
  Phone,
  Heart,
  Edit,
  Camera,
} from "lucide-react";

interface ProfilePageProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
  },
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Profile | Bilar Emergency Response</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal and medical information
            </p>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="h-full">
                <ProfileSummary
                  name={user.name}
                  email={user.email}
                  avatarUrl={user.avatarUrl}
                />
              </div>
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24 border-2 border-primary">
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Camera className="h-3 w-3" />
                        Change Photo
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user.email}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue="+63 912 345 6789" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            defaultValue="1990-01-01"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          defaultValue="123 Main Street, Bilar, Bohol"
                        />
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" /> Medical
                        Information
                      </CardTitle>
                      <CardDescription>
                        Update your medical details for emergency responders
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input id="bloodType" defaultValue="O+" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" defaultValue="175" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" defaultValue="70" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organDonor">Organ Donor</Label>
                      <select
                        id="organDonor"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="yes"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      placeholder="List any allergies..."
                      defaultValue="Penicillin, Peanuts"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      placeholder="List any medications you're currently taking..."
                      defaultValue="Lisinopril"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Textarea
                      id="conditions"
                      placeholder="List any medical conditions..."
                      defaultValue="Hypertension"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button>Save Medical Information</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-blue-500" /> Emergency
                        Contacts
                      </CardTitle>
                      <CardDescription>
                        People to contact in case of emergency
                      </CardDescription>
                    </div>
                    <Button>Add Contact</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Jane Doe",
                        relation: "Spouse",
                        phone: "+63 923 456 7890",
                      },
                      {
                        name: "Mark Smith",
                        relation: "Brother",
                        phone: "+63 934 567 8901",
                      },
                    ].map((contact, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contact.relation}
                          </p>
                          <p className="text-sm">{contact.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-4 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2023 Bilar Emergency Response Application. All rights reserved.
          </p>
          <p className="mt-1">
            For emergencies requiring immediate assistance, please call the
            national emergency hotline: <span className="font-medium">911</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
