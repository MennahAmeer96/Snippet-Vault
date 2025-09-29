const CONFIG = {
    GEMINI_API_KEY: "GEMINI_API_KEY_PLACEHOLDER",
    
    GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    
    APP_NAME: "SnippetVault",
    VERSION: "1.0.0",
    
    AI_CONFIG: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}