import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import EmergencyMap from "./EmergencyMap";
import BottomBar from "../ui/bottombar";

interface MapPageProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    type?: string;
  };
}

const MapPage: React.FC<MapPageProps> = ({ user }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Emergency Map | Bilar Emergency Response</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Emergency Map</h1>
            <p className="text-muted-foreground">
              View active emergencies and response units in Bilar
            </p>
          </div>

          <div className="h-[calc(100vh-300px)]">
            <EmergencyMap />
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

export default MapPage;
