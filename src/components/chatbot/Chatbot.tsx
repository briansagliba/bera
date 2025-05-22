import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import OpenAI from "openai";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm the Bilar Emergency Response Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openai, setOpenai] = useState<OpenAI | null>(null);

  useEffect(() => {
    // Initialize OpenAI client
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      setOpenai(
        new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true, // Note: In production, you should use a backend proxy
        }),
      );
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get bot response
      const botResponse = await generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userInput: string): Promise<string> => {
    // If OpenAI is not initialized or API key is missing, fall back to predefined responses
    if (!openai || !import.meta.env.VITE_OPENAI_API_KEY) {
      return generateFallbackResponse(userInput);
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are the Bilar Emergency Response Assistant, an AI designed to help users with emergency reporting and response. 
            Provide concise, helpful information about emergency procedures, reporting requirements, and guidance.
            Focus on emergency types: medical, fire, police, and natural disasters.
            Always prioritize user safety and direct them to call emergency services (911) for immediate threats.
            Keep responses under 150 words and be direct and clear.`,
          },
          { role: "user", content: userInput },
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response. Please try again."
      );
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return generateFallbackResponse(userInput);
    }
  };

  // Fallback response generator when API is unavailable
  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (
      input.includes("what") &&
      (input.includes("say") || input.includes("tell"))
    ) {
      return "When reporting an emergency, be clear and concise. State: 1) Your name and location, 2) The type of emergency (medical, fire, etc.), 3) Any injuries or immediate dangers, 4) Any special needs or circumstances. The more specific you are, the better we can help you.";
    } else if (input.includes("emergency") && input.includes("report")) {
      return "To report an emergency, please use the 'Report Emergency' button on the dashboard or call the emergency hotline directly at 911. When reporting, clearly state your location, the nature of the emergency, and if anyone is injured.";
    } else if (input.includes("contact") || input.includes("directory")) {
      return "You can find all emergency contacts in the Contact Directory section of the dashboard. For immediate assistance, select the appropriate service and use the direct call feature.";
    } else if (input.includes("status") || input.includes("track")) {
      return "You can track the status of your emergency reports in the Status Tracker section. Updates are provided in real-time as responders are dispatched and arrive at your location.";
    } else if (input.includes("responder") || input.includes("response time")) {
      return "Emergency responders are dispatched based on proximity and availability. You can see their location on the Emergency Map. When communicating with responders, provide clear landmarks and stay on the line if possible.";
    } else if (input.includes("medical") || input.includes("injury")) {
      return "For medical emergencies, describe the condition of the patient: consciousness level, breathing status, bleeding severity, and any known medical history. This helps responders prepare appropriate equipment and treatment.";
    } else if (input.includes("fire")) {
      return "When reporting a fire, mention: 1) Exact location, 2) What's burning, 3) If anyone is trapped, 4) If it's spreading, and 5) Any hazardous materials nearby. Evacuate to a safe distance immediately.";
    } else if (input.includes("police") || input.includes("crime")) {
      return "When reporting to police, provide: 1) Nature of the incident, 2) When it occurred, 3) Description of any suspects, 4) Direction they went if they fled, and 5) If weapons were involved. Stay in a safe location while waiting.";
    } else if (input.includes("natural") || input.includes("disaster")) {
      return "For natural disasters, report: 1) Your location, 2) Number of people affected, 3) Immediate dangers, 4) Any injuries, and 5) Resources needed. Follow evacuation orders if given by authorities.";
    } else if (input.includes("help") || input.includes("assistance")) {
      return "I can help you with reporting emergencies, tracking status, finding contacts, and providing guidance on what information to share with responders. What specific assistance do you need?";
    } else if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! How can I assist you with the emergency response system today? If you need guidance on what to say when reporting an emergency, just ask.";
    } else {
      return "I'm not sure how to help with that specific query. For emergency assistance, please use the Report Emergency feature or call 911 directly. If you need guidance on what information to provide, ask 'What should I say when reporting an emergency?'";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 w-80 md:w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-medium">Emergency Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary/90"
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user" ? "bg-primary/10 ml-auto" : "bg-muted mr-auto"}`}
          >
            <p className="text-sm">{message.text}</p>
            <span className="text-xs text-muted-foreground mt-1 block">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
