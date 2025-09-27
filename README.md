# SnippetVault

A web application for storing and organizing code snippets with AI-powered features including live syntax highlighting, markdown notes, and AI code explanations.

## Features

- ✨ **Live Syntax Highlighting** - Automatic code highlighting with highlight.js
- 📝 **Markdown Notes** - Add rich formatted descriptions to your snippets
- 🤖 **AI Code Explanation** - Get detailed explanations of your code using Google's Gemini AI
- 🏷️ **Smart Tagging** - AI-powered tag suggestions for better organization
- 🔍 **Enhanced Search** - Search through code, notes, context, and tags
- 🌓 **Dark/Light Theme** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop and mobile


## Setup Instructions

### 1. Get Your Gemini API Key

**PLACEHOLDER FOR GEMINI API KEY SETUP:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Application

**PLACEHOLDER FOR API KEY CONFIGURATION:**

1. Open `config.js`
2. Find the line: `GEMINI_API_KEY_PLACEHOLDER`
3. Replace the placeholder with your actual API key:
   ```javascript
   GEMINI_API_KEY: "your-actual-gemini-api-key-here";
   ```

### 3. Run Locally

- Double-click `index.html` to open in your browser
- Note: AI features may not work due to CORS if opened as file://
- Note: AI features require your Gemini API key to be added in `config.js`
- Use a local server for full functionality


## File Structure

```
snippet-vault/
├── index.html              # Main HTML file
├── style.css               # Styles and themes
├── script.js               # Main JavaScript functionality (includes AI features)
├── config.js               # Configuration file (PLACEHOLDER FOR API KEYS)
├── check-config.js         # Configuration validator
└── README.md               # This file
```


## Usage

1. **Add Snippets**: Fill out the form with language, code, notes, and tags
2. **AI Features**:
   - Click the magic wand icon on any snippet to get AI explanations
   - Use the "Suggest" button to get AI-generated tags
3. **Search**: Use the search bar to find snippets by language, content, notes, or tags
4. **Organize**: Use tags to categorize your snippets
5. **Theme**: Toggle between dark and light themes with the moon/sun icon


## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables for theming
- **Syntax Highlighting**: highlight.js (CDN)
- **Markdown Rendering**: marked.js (CDN)
- **AI Integration**: Google Gemini AI API (direct frontend calls)
- **Storage**: Browser Session Storage


## Support

If you encounter issues:

1. Check that all placeholders have been replaced
2. Verify your Gemini API key is valid
3. Check browser console for error messages

---

**Built with ❤️ by Mennah Ameer for developers**
