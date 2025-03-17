import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Map, FileText, Users, User } from "lucide-react";

interface BottomBarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const BottomBar: React.FC<BottomBarProps> = ({ user }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/map"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/map") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Map className="h-5 w-5" />
          <span className="text-xs mt-1">Map</span>
        </Link>

        <Link
          to="/manage-users"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/manage-users") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Users</span>
        </Link>

        <Link
          to="/emergency-history"
          className={`flex flex-col items-center justify-center w-full h-full ${isActive("/emergency-history") ? "text-primary" : "text-muted-foreground"}`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">History</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;
