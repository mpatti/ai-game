// API Configuration
export const API_CONFIG = {
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'gpt-4o-mini', // Cheapest model for GitHub Models
    // Add your GitHub token here (get it from https://github.com/settings/tokens with models:read permission)
    githubToken: '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'
};

// Password protection
export const GAME_PASSWORD = 'joplin';

export function getGitHubToken() {
    return API_CONFIG.githubToken;
}

export function hasGitHubToken() {
    return API_CONFIG.githubToken && API_CONFIG.githubToken !== 'YOUR_GITHUB_TOKEN_HERE';
}

export function checkPassword(password) {
    return password === GAME_PASSWORD;
}
