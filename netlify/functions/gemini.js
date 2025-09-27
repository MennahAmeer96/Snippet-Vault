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
        fullPrompt = `As a code expert, explain this code snippet in detail. Format your response using Markdown. \n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nExplanation:`;
    } else if (type === 'tags') {
        fullPrompt = `Analyze this code and suggest 3-5 relevant lowercase tags. Return ONLY the tags separated by commas.\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nTags:`;
    } else {
        throw new Error('Invalid AI request type.');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google AI API error: ${errorData.error.message}`);
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
        body: JSON.stringify({ error: error.message }),
    };
    }
};