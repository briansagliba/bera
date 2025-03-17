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
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
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
    const { error } = await supabase
      .from("emergencies")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating emergency status:", error);
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
