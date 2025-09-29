# SnippetVault

**🚀 Powered by Google Gemini AI** - Experience the future of code organization with intelligent explanations, smart tagging, and AI-driven insights that understand your code like never before.

A revolutionary web application that transforms how developers store, organize, and understand their code snippets. Built with cutting-edge AI technology from Google's Gemini API, SnippetVault doesn't just store your code—it comprehends it, explains it, and helps you organize it intelligently.

**Production URL**: [https://snippetvaultmennah.netlify.app/](https://snippetvaultmennah.netlify.app/)

<p align="center">
  <video src="https://github.com/user-attachments/assets/90daf5cc-6c2b-45b2-a3fc-316bc8529564" width="500" controls></video>
</p>

---

## Features

- **Live Syntax Highlighting** - Automatic code highlighting with highlight.js
- **Markdown Notes** - Add rich formatted descriptions to your snippets
- **AI Code Explanation** - Get detailed explanations of your code using Google's Gemini AI
- **Smart Tagging** - AI-powered tag suggestions for better organization
- **Enhanced Search** - Search through code, notes, context, and tags
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works seamlessly on desktop and mobile

## Setup Instructions

Choose your preferred deployment method:

### Option 1: How to Run Locally

#### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

#### Step 2: Configure the Application

1. Open `config.js`
2. Find the placeholder: `"GEMINI_API_KEY_PLACEHOLDER"`
3. Replace the placeholder with your actual API key

#### Step 3: Configure the Project Files

1. Go to `script.js` and locate the `suggestTags` and `explainSnippet` methods
2. Make sure to uncomment the **Local version** part for both methods

#### Step 4: Run the Application

1. Double-click `index.html` to open it in your browser

**Important Notes for Local Development:**

- AI features require your Gemini API key to be properly configured in `config.js`

---

### Option 2: Deploy on Netlify

#### Step 1: Configure Netlify Account

1. Go to [Netlify](https://netlify.com) and log in using GitHub to grant access to your selected repository or all repositories
2. Push your code to the master or main branch to deploy the page
3. Ensure that auto-publishing is enabled to automatically publish with each push

#### Step 2: Configure Environment Variables

1. Navigate to **Project Configuration > Environment Variables**: [Environment Variables](https://app.netlify.com/projects/yourProjectName/configuration/env#content)
2. Add your API key with the key name: `GEMINI_API_KEY`
3. Go to **Project Configuration > Build and Deploy > Post Processing**: [Post Processing](https://app.netlify.com/projects/yourProjectName/configuration/deploys#post-processing)
4. Add the following snippet injection:

```html
<script>
  const CONFIG = {
    GEMINI_API_KEY: "{{- .Env.GEMINI_API_KEY -}}",
  };
</script>
```

- **Position**: Inser before `</head>`
- **Name**: CONFIG

#### Step 3: Configure the Project Files

1. Go to `script.js` and locate the `suggestTags` and `explainSnippet` methods
2. Make sure to uncomment the **Deployed version** part for both methods

#### Step 4: Access Your Deployed Version

1. Go to the **Deploys** tab in Netlify: [Deploys](https://app.netlify.com/projects/yourProjectName/deploys)
2. Click on the generated URL to access your live application

## File Structure

```
snippet-vault/
├── index.html              # Main HTML file
├── style.css               # Styles and themes
├── script.js               # Main JavaScript functionality (includes AI features)
├── config.js               # Configuration file for API keys
├── check-config.js         # Configuration validator
├── netlify/
│   └── functions/
│       └── gemini.js       # Serverless function for AI features
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
- **AI Integration**: Google Gemini AI API
- **Serverless Functions**: Netlify Functions for secure API calls


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ by Mennah Ameer for the developer community**
