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
