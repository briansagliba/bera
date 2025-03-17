import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Ambulance,
  AlertTriangle,
  ShieldAlert,
  Wind,
  MapPin,
  Camera,
  ArrowLeft,
  Send,
} from "lucide-react";

interface ReportEmergencyFormProps {
  initialType?: string;
  onSubmitSuccess?: (reportId: string) => void;
}

const ReportEmergencyForm: React.FC<ReportEmergencyFormProps> = ({
  initialType = "",
  onSubmitSuccess = () => {},
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: initialType,
    description: "",
    location: "",
    address: "",
    priority: "medium",
    photos: [] as File[],
  });

  const emergencyTypes = [
    {
      id: "medical",
      name: "Medical",
      description: "Medical emergencies requiring ambulance or paramedics",
      icon: <Ambulance className="h-5 w-5" />,
      color: "text-red-600",
    },
    {
      id: "fire",
      name: "Fire",
      description: "Fire emergencies requiring firefighters",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-orange-600",
    },
    {
      id: "police",
      name: "Police",
      description: "Crime or security emergencies requiring police",
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      id: "disaster",
      name: "Natural Disaster",
      description: "Floods, earthquakes, or other natural disasters",
      icon: <Wind className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      id: "other",
      name: "Other",
      description: "Other emergency situations",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-gray-600",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({ ...formData, photos: [...formData.photos, ...filesArray] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would send the data to a backend API
      // const response = await fetch('/api/emergencies', {
      //   method: 'POST',
      //   body: JSON.stringify(formData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response
      const mockReportId = `ER-${Math.floor(Math.random() * 10000)}`;

      onSubmitSuccess(mockReportId);
      navigate(`/status?report=${mockReportId}`);
    } catch (error) {
      console.error("Error submitting emergency report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedType = () => {
    return (
      emergencyTypes.find((type) => type.id === formData.type) ||
      emergencyTypes[0]
    );
  };

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader className="bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Report Emergency</CardTitle>
          </div>
          <CardDescription>
            Please provide details about the emergency situation
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* Emergency Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type">Emergency Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  {emergencyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <span className={type.color}>{type.icon}</span>
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.type && (
                <p className="text-sm text-muted-foreground mt-1">
                  {getSelectedType().description}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the emergency situation in detail"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="border rounded-md p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {formData.location ? (
                      <span>Location selected</span>
                    ) : (
                      <span>No location selected</span>
                    )}
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    {formData.location ? "Change" : "Select"} on Map
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter the address or location details"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">
                        <AlertCircle className="h-4 w-4" />
                      </span>
                      <span>High - Life-threatening</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                      </span>
                      <span>Medium - Urgent but stable</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">
                        <AlertCircle className="h-4 w-4" />
                      </span>
                      <span>Low - Non-urgent</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photos/Evidence */}
            <div className="space-y-2">
              <Label>Photos/Evidence (Optional)</Label>
              <div className="border rounded-md p-4 bg-slate-50">
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.photos.length > 0 ? (
                    formData.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 border rounded overflow-hidden group"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No photos uploaded
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() =>
                      document.getElementById("photo-upload")?.click()
                    }
                  >
                    <Camera className="h-4 w-4" />
                    Add Photos
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max 5 photos, 5MB each
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="w-full">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Emergency Report
                  </span>
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              For emergencies requiring immediate assistance, please call the
              national emergency hotline:{" "}
              <span className="font-medium">911</span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReportEmergencyForm;
