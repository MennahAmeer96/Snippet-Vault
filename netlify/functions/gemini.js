exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt, code, type } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('API key is not configured.');
        }

        let fullPrompt;
        if (type === 'explain') {
            fullPrompt = `As a detailed code expert, please provide a comprehensive explanation of the following code snippet, covering its function, logic, and any relevant best practices. Format your response using Markdown. \n\nCode:\n\`\`\`${code}\`\`\`\n\nExplanation:`;
        } else if (type === 'tags') {
            fullPrompt = `Analyze this code and suggest 3-5 relevant lowercase tags. Return ONLY the tags separated by commas.\n\nCode:\n\`\`\`${code}\`\`\`\n\nTags:`;
        } else {
            throw new Error('Invalid AI request type.');
        }

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); 
            const errorMessage = errorData.error ? `Gemini API Error: ${errorData.error.message}` : `External API responded with status ${response.status}`;
            
            console.error('Gemini API Non-OK Response:', errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ response: aiResponse }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: `Netlify Function Error: ${error.message || 'Unknown error'}` 
            }),
        };
    }
};