import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "recipient";
  text: string;
  timestamp: Date;
}

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: {
    id: string;
    name: string;
    imageUrl?: string;
    type?: string;
    status?: string;
  };
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onOpenChange,
  recipient,
}) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "recipient",
      text: "Hello, how can I help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");

    // Simulate response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "recipient",
        text: `I've received your message. I'll respond as soon as possible.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {recipient.imageUrl ? (
                <AvatarImage src={recipient.imageUrl} alt={recipient.name} />
              ) : (
                <AvatarFallback>
                  {recipient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <span>{recipient.name}</span>
              {recipient.type && (
                <span className="text-xs text-muted-foreground block">
                  {recipient.type}{" "}
                  {recipient.status ? `• ${recipient.status}` : ""}
                </span>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Send messages to coordinate emergency response
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] p-4 border rounded-md">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="rounded-full"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-muted-foreground">
            Messages are logged for emergency coordination purposes
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
