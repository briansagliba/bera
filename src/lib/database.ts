import { supabase } from "./supabase";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "responder" | "requestor";
  type?: string;
  created_at?: string;
}

export interface Emergency {
  id: string;
  user_id: string;
  type: "medical" | "fire" | "police" | "disaster" | "other";
  description: string;
  location: string;
  address: string;
  status: "pending" | "responding" | "resolved" | "cancelled";
  priority: "high" | "medium" | "low";
  reported_at: string;
  updated_at: string;
  responder_id?: string;
}

export interface Responder {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  type?: string;
  status: "available" | "responding" | "unavailable";
  created_at: string;
  responding_to?: string;
}

export interface Requestor {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  situation?: string;
  concern?: string;
  created_at: string;
}

// User functions
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const createUser = async (
  user: Omit<User, "id">,
): Promise<User | null> => {
  try {
    // Direct insertion of user data including email without authentication
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    console.log("User created successfully with email:", user.email);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Emergency functions
export const getEmergencies = async (): Promise<Emergency[]> => {
  try {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .order("reported_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching emergencies:", error);
    return [];
  }
};

export const getEmergencyCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("emergencies")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting emergencies:", error);
    return 0;
  }
};

export const getActiveEmergencyCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("emergencies")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "responding"]);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting active emergencies:", error);
    return 0;
  }
};

export const getEmergencyById = async (
  id: string,
): Promise<Emergency | null> => {
  try {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching emergency:", error);
    return null;
  }
};

export const createEmergency = async (
  emergency: Omit<Emergency, "id">,
): Promise<Emergency | null> => {
  try {
    const { data, error } = await supabase
      .from("emergencies")
      .insert([emergency])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating emergency:", error);
    return null;
  }
};

export const updateEmergencyStatus = async (
  id: string,
  status: Emergency["status"],
): Promise<boolean> => {
  try {
    console.log(`Database: Updating emergency ${id} status to ${status}`);

    // First, get the emergency to check if it has a responder assigned
    const { data: emergency, error: getError } = await supabase
      .from("emergencies")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) {
      console.error("Error fetching emergency:", getError);
      return false;
    }

    if (!emergency) {
      console.error(`Emergency with ID ${id} not found`);
      return false;
    }

    console.log("Found emergency:", emergency);

    // Update the emergency status
    const { error } = await supabase
      .from("emergencies")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error updating emergency status:", error);
      return false;
    }

    console.log(`Emergency ${id} status updated to ${status}`);

    // If the emergency is resolved and has a responder assigned, update the responder's status to available
    if (status === "resolved" && emergency?.responder_id) {
      console.log(
        `Updating responder ${emergency.responder_id} status to available`,
      );

      // Also clear the responding_to field when the emergency is resolved
      const { error: responderError } = await supabase
        .from("responders")
        .update({
          status: "available",
          responding_to: null,
        })
        .eq("id", emergency.responder_id);

      if (responderError) {
        console.error("Error updating responder status:", responderError);
        // Don't throw, we still want to return true for the emergency update
      } else {
        console.log(`Responder ${emergency.responder_id} updated to available`);
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating emergency status:", error);
    return false;
  }
};

export const assignResponderToEmergency = async (
  emergencyId: string,
  responderId: string,
): Promise<boolean> => {
  try {
    console.log(
      `Database: Assigning responder ${responderId} to emergency ${emergencyId}`,
    );

    // First, check if the responder exists and get its status
    const { data: responderCheck, error: responderCheckError } = await supabase
      .from("responders")
      .select("*")
      .eq("id", responderId)
      .single();

    if (responderCheckError) {
      console.error("Error checking responder status:", responderCheckError);
      return false;
    }

    if (!responderCheck) {
      console.error(`Responder with ID ${responderId} not found`);
      return false;
    }

    console.log("Found responder:", responderCheck);

    // Check if the emergency exists
    const { data: emergencyCheck, error: emergencyCheckError } = await supabase
      .from("emergencies")
      .select("*")
      .eq("id", emergencyId)
      .single();

    if (emergencyCheckError) {
      console.error("Error checking emergency existence:", emergencyCheckError);
      return false;
    }

    if (!emergencyCheck) {
      console.error(`Emergency with ID ${emergencyId} not found`);
      return false;
    }

    console.log("Found emergency:", emergencyCheck);

    // First update the responder status to responding
    const { error: responderError } = await supabase
      .from("responders")
      .update({
        status: "responding",
        responding_to: emergencyId,
      })
      .eq("id", responderId);

    if (responderError) {
      console.error("Error updating responder:", responderError);
      return false;
    }

    console.log("Responder updated successfully");

    // Then update the emergency with the responder_id and responder name
    const { error: emergencyError } = await supabase
      .from("emergencies")
      .update({
        responder_id: responderId,
        responder: responderCheck.name, // Add responder name to the emergency record
        status: "responding", // Automatically update status to responding
        updated_at: new Date().toISOString(),
      })
      .eq("id", emergencyId);

    if (emergencyError) {
      console.error("Error updating emergency:", emergencyError);
      return false;
    }

    console.log("Emergency updated successfully with responder name");

    return true;
  } catch (error) {
    console.error("Error assigning responder to emergency:", error);
    return false;
  }
};

// Responder functions
export const getResponders = async (): Promise<Responder[]> => {
  try {
    const { data, error } = await supabase.from("responders").select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching responders:", error);
    return [];
  }
};

export const getResponderCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("responders")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting responders:", error);
    return 0;
  }
};

export const getActiveResponderCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("responders")
      .select("*", { count: "exact", head: true })
      .eq("status", "available");

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting active responders:", error);
    return 0;
  }
};

export const createResponder = async (
  responder: Omit<Responder, "id">,
): Promise<Responder | null> => {
  try {
    const { data, error } = await supabase
      .from("responders")
      .insert([responder])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating responder:", error);
    return null;
  }
};

export const deleteResponder = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("responders").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting responder:", error);
    return false;
  }
};

// Requestor functions
export const getRequestors = async (): Promise<Requestor[]> => {
  try {
    const { data, error } = await supabase.from("requestors").select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching requestors:", error);
    return [];
  }
};

export const getRequestorCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("requestors")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error counting requestors:", error);
    return 0;
  }
};

export const createRequestor = async (
  requestor: Omit<Requestor, "id">,
): Promise<Requestor | null> => {
  try {
    const { data, error } = await supabase
      .from("requestors")
      .insert([requestor])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating requestor:", error);
    return null;
  }
};

export const deleteRequestor = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("requestors").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting requestor:", error);
    return false;
  }
};
