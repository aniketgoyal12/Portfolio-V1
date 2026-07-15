// Utility for handling API requests with automatic CSRF token management and JWT refreshing

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
console.log("[API Client] Base URL configured as:", BASE_URL || "Relative (empty)");

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Fetch the CSRF token once on initial page load
let csrfInitializationPromise = null;

export const initCSRF = () => {
    if (!csrfInitializationPromise) {
        csrfInitializationPromise = fetch(`${BASE_URL}/api/auth/csrf/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to set CSRF cookie");
                return res.json();
            })
            .catch(err => {
                console.error("CSRF Initialization error:", err);
                csrfInitializationPromise = null; // Retry on next call
            });
    }
    return csrfInitializationPromise;
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = () => {
    refreshSubscribers.forEach(cb => cb());
    refreshSubscribers = [];
};

export const apiFetch = async (url, options = {}) => {
    // Ensure CSRF token cookie is set first
    await initCSRF();

    options.headers = options.headers || {};
    options.credentials = 'include'; // Carry httpOnly cookies

    // Attach CSRF header for write requests
    if (options.method && !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(options.method.toUpperCase())) {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            options.headers['X-CSRFToken'] = csrfToken;
        }
    }

    try {
        let response = await fetch(`${BASE_URL}${url}`, options);

        // Handle expired access token
        if (response.status === 401 && !url.includes('/api/auth/login/') && !url.includes('/api/auth/refresh/')) {
            if (isRefreshing) {
                // Wait until refresh is done, then retry original request
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(apiFetch(url, options));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken') || ''
                    }
                });

                if (refreshRes.ok) {
                    isRefreshing = false;
                    onTokenRefreshed();
                    // Retry original request
                    return await apiFetch(url, options);
                } else {
                    isRefreshing = false;
                    // Refresh token is expired or invalid -> logout user
                    window.dispatchEvent(new Event('auth-expired'));
                    throw new Error("Session expired. Please log in again.");
                }
            } catch (refreshErr) {
                isRefreshing = false;
                window.dispatchEvent(new Event('auth-expired'));
                throw refreshErr;
            }
        }

        return response;
    } catch (err) {
        throw err;
    }
};
