import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getEmergencies } from "@/lib/database";

export interface EmergencyLocation {
  id: string;
  type: "medical" | "fire" | "police" | "disaster";
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: "pending" | "responding" | "resolved";
  reportedAt: string;
  priority: "high" | "medium" | "low";
  requestorId?: string;
  requestorName?: string;
}

export const useEmergencies = () => {
  const [emergencies, setEmergencies] = useState<EmergencyLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        setLoading(true);
        const dbEmergencies = await getEmergencies();

        // Transform database emergencies to the format needed by the map
        const transformedEmergencies = dbEmergencies.map((emergency) => {
          // Parse location from JSON string if needed
          let locationObj = emergency.location;
          if (typeof locationObj === "string") {
            try {
              locationObj = JSON.parse(locationObj);
            } catch (e) {
              locationObj = { lat: 9.6282, lng: 124.0935 }; // Default to Bilar coordinates
            }
          }

          return {
            id: emergency.id,
            type: emergency.type as "medical" | "fire" | "police" | "disaster",
            location: locationObj as { lat: number; lng: number },
            address: emergency.address || "Unknown location",
            status: emergency.status as "pending" | "responding" | "resolved",
            reportedAt: emergency.reported_at || new Date().toISOString(),
            priority: emergency.priority as "high" | "medium" | "low",
            requestorId: emergency.user_id,
            requestorName: "Requestor", // This would need to be fetched from users table
          };
        });

        setEmergencies(transformedEmergencies);
      } catch (err) {
        console.error("Error fetching emergencies:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Unknown error fetching emergencies"),
        );
        // Fall back to demo data if there's an error
        setEmergencies([
          {
            id: "e1",
            type: "medical",
            location: { lat: 9.6282, lng: 124.0935 },
            address: "123 Main St, Bilar",
            status: "pending",
            reportedAt: "2023-06-15T10:30:00Z",
            priority: "high",
            requestorId: "req1",
            requestorName: "Juan Dela Cruz",
          },
          {
            id: "e2",
            type: "fire",
            location: { lat: 9.6312, lng: 124.0965 },
            address: "456 Oak Ave, Bilar",
            status: "responding",
            reportedAt: "2023-06-15T11:15:00Z",
            priority: "high",
            requestorId: "req2",
            requestorName: "Armando C. Jumawid",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();

    // Set up real-time subscription
    const subscription = supabase
      .channel("emergencies-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergencies" },
        fetchEmergencies,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { emergencies, loading, error };
};
