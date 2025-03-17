import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../layout/Navbar";
import ContactDirectory from "./ContactDirectory";

interface DirectoryPageProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ user }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact Directory | Bilar Emergency Response</title>
      </Helmet>

      <Navbar user={user} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Emergency Contact Directory</h1>
            <p className="text-muted-foreground">
              Find and contact emergency services in Bilar
            </p>
          </div>

          <div className="h-[calc(100vh-250px)]">
            <ContactDirectory />
          </div>
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

export default DirectoryPage;
