"use client";

// Helper for API requests
const request = async (url: string, options?: RequestInit) => {
    try {
        // Merge options with cache: 'no-store' to prevent caching issues in Admin
        const response = await fetch(url, { cache: "no-store", ...options });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "API Request Failed");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// --- PACKAGES API ---
export const getPackages = async () => {
    return request("/api/packages");
};

export const createPackage = async (data: any) => {
    return request("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

export const deletePackage = async (id: string) => {
    return request(`/api/packages/${id}`, { method: "DELETE" });
};

export const updatePackage = async (id: string, data: any) => {
    return request(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

// --- ITEMS API ---
export const getItems = async () => {
    return request("/api/items");
};

export const createItem = async (data: any) => {
    return request("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

export const updateItem = async (id: string, data: any) => {
    return request(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

export const deleteItem = async (id: string) => {
    return request(`/api/items/${id}`, { method: "DELETE" });
};

// --- BOOKINGS API ---
export const getBookings = async () => {
    return request("/api/bookings");
};

export const createBooking = async (data: any) => {
    return request("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

export const updateBookingStatus = async (id: string, status: string) => {
    return request(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
};

// --- MESSAGES API ---
export const getMessages = async () => {
    return request("/api/messages");
};

export const createMessage = async (data: any) => {
    return request("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};

// --- SETTINGS API ---
export const getSettings = async () => {
    return request("/api/settings");
};

export const updateSettings = async (data: any) => {
    return request("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};
