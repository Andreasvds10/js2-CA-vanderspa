export const API_BASE = 'https://v2.api.noroff.dev';

// Function to get headers dynamically
export function getAuthHeaders() {
    const token = localStorage.getItem('accessToken') || '';
    return {
        Authorization: `Bearer ${token.trim()}`,  // Ensure token is properly formatted
        'X-Noroff-API-Key': '67c4b6d8-be31-4c79-9912-2035bbadb1da',
        'Content-Type': 'application/json',
    };
}

// Debug: Log the stored access token
console.log("Stored Access Token:", localStorage.getItem('accessToken'));
