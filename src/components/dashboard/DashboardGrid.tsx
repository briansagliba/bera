import React, { useState } from "react";
import EmergencyMap from "../map/EmergencyMap";
import StatusTracker from "../emergency/StatusTracker";
import ContactDirectory from "../directory/ContactDirectory";
import ProfileSummary from "../profile/ProfileSummary";
import MessageDialog from "../messaging/MessageDialog";
import EmergencyDetailsDialog from "../emergency/EmergencyDetailsDialog";

interface DashboardGridProps {
  onEmergencySelect?: (emergencyId: string) => void;
  onViewEmergencyDetails?: (id: string) => void;
  onContactSelect?: (contactId: string) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  onEmergencySelect = () => {},
  onViewEmergencyDetails = () => {},
  onContactSelect = () => {},
}) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] =
    useState<any>(null);
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<any>(null);

  // Handle viewing emergency details from status tracker
  const handleViewEmergencyDetails = (id: string) => {
    onViewEmergencyDetails(id);
  };

  return (
    <div className="w-full h-full p-4 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
        {/* Emergency Map */}
        <div className="md:col-span-2 lg:col-span-2 row-span-2">
          <EmergencyMap
            onEmergencySelect={(emergency) => onEmergencySelect(emergency.id)}
          />
        </div>

        {/* Status Tracker */}
        <div className="md:col-span-1 lg:col-span-1">
          <StatusTracker onViewDetails={handleViewEmergencyDetails} />
        </div>

        {/* Contact Directory */}
        <div className="md:col-span-1 lg:col-span-1">
          <ContactDirectory onContactSelect={onContactSelect} />
        </div>

        {/* Profile Summary */}
        <div className="md:col-span-1 lg:col-span-1">
          <ProfileSummary />
        </div>
      </div>

      {/* Message Dialog */}
      {selectedMessageRecipient && (
        <MessageDialog
          open={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          recipient={selectedMessageRecipient}
        />
      )}

      {/* Emergency Details Dialog */}
      {selectedEmergency && (
        <EmergencyDetailsDialog
          open={showEmergencyDetails}
          onOpenChange={setShowEmergencyDetails}
          emergency={selectedEmergency}
          onMessageRequestor={() => {
            setShowEmergencyDetails(false);
            setSelectedMessageRecipient({
              id: selectedEmergency.requestorId,
              name: selectedEmergency.requestorName,
              type: "Requestor",
            });
            setShowMessageDialog(true);
          }}
          onAssignResponder={() => {
            alert("This would open a responder selection dialog");
          }}
          onUpdateStatus={(status) => {
            alert(`Emergency status updated to: ${status}`);
            setSelectedEmergency({ ...selectedEmergency, status });
          }}
        />
      )}
    </div>
  );
};

export default DashboardGrid;
