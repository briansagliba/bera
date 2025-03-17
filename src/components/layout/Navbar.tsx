import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  AlertTriangle,
  MessageSquare,
  Info,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogin?: () => void;
  onLogout?: () => void;
  onRegister?: () => void;
}

const Navbar = ({
  user = null,
  onLogin = () => {
    window.location.href = "/login";
  },
  onLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/landing";
  },
  onRegister = () => {
    window.location.href = "/login?tab=register";
  },
}: NavbarProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(user?.email);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo2.png"
              alt="BER Admin Logo"
              className="h-12 w-auto"
            />
            <span className="hidden font-bold text-xl md:inline-block">
              Bilar Emergency Response Admin
            </span>
            <span className="font-bold text-xl md:hidden">BER Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            to="/manage-users"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Manage Users
          </Link>
          <Link
            to="/emergency-history"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Emergency History
          </Link>
          <Link
            to="/map"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Emergency Map
          </Link>
        </nav>

        {/* User Menu and Mobile Navigation */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="space-y-2 p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-2 rounded-lg p-2 hover:bg-muted ${!notification.read ? "bg-muted/50" : ""} cursor-pointer`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {notification.type === "emergency" ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : notification.type === "message" ? (
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Info className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  notification.created_at,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          No new notifications
                        </p>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View all
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 pl-2 pr-1"
                  >
                    <Avatar className="h-8 w-8">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      ) : (
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm hidden md:inline-block">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={onLogin}>
                Log in
              </Button>
              <Button onClick={onRegister}>Sign up</Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Bilar Emergency Response</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link to="/" className="p-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/manage-users" className="p-2 text-sm font-medium">
                  Manage Users
                </Link>
                <Link
                  to="/emergency-history"
                  className="p-2 text-sm font-medium"
                >
                  Emergency History
                </Link>
                <Link to="/map" className="p-2 text-sm font-medium">
                  Emergency Map
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
