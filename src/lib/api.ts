"use client";

// Helper for API requests
// Basic in-memory cache for faster responses
const apiCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 300000; // 5 minutes

const request = async (url: string, options?: RequestInit) => {
    // Check cache for GET requests
    const isGet = !options || options.method === "GET" || options.method === undefined;

    if (isGet && apiCache[url]) {
        const cached = apiCache[url];
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`[API Cache] Returning cached data for ${url}`, cached.data);
            // Return cached data immediately if it's fresh enough
            // But we'll still fetch in background to "revalidate"
            fetch(url, { ...options, cache: "no-store" })
                .then(res => res.json())
                .then(data => {
                    console.log(`[API Cache] Background revalidation for ${url}`, data);
                    // Only cache non-empty arrays
                    if (!Array.isArray(data) || data.length > 0) {
                        apiCache[url] = { data, timestamp: Date.now() };
                    }
                })
                .catch(() => { });

            return cached.data;
        }
    }

    try {
        console.log(`[API Request] Fetching ${url}`);
        const response = await fetch(url, { cache: "no-store", ...options });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "API Request Failed");
        }

        const data = await response.json();
        console.log(`[API Response] ${url}`, data);

        // Cache successful GET requests (but not empty arrays)
        if (isGet) {
            if (!Array.isArray(data) || data.length > 0) {
                console.log(`[API Cache] Caching data for ${url}`);
                apiCache[url] = { data, timestamp: Date.now() };
            } else {
                console.log(`[API Cache] Skipping cache for empty array at ${url}`);
            }
        } else {
            // Invalidate cache for POST/PUT/DELETE
            console.log('[API Cache] Invalidating all cache');
            Object.keys(apiCache).forEach(key => delete apiCache[key]);
        }

        return data;
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
