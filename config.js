// API Configuration
export const API_CONFIG = {
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'gpt-4o-mini', // Cheapest model for GitHub Models
    githubToken: localStorage.getItem('github_token') || ''
};

export function setGitHubToken(token) {
    API_CONFIG.githubToken = token;
    localStorage.setItem('github_token', token);
}

export function getGitHubToken() {
    return API_CONFIG.githubToken;
}

export function hasGitHubToken() {
    return API_CONFIG.githubToken && API_CONFIG.githubToken.length > 0;
}
