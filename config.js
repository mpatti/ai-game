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
    return API_CONFIG.githubToken && API_CONFIG.githubToken !== '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';
}

export function checkPassword(password) {
    return password === GAME_PASSWORD;
}
