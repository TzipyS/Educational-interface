const { OpenAI } = require('openai');
const Category = require('../models/Category');
const SubCategory = require('../models/Sub_category');

if (!process.env.AI_KEY) {
    console.error('Missing AI_KEY environment variable');
    throw new Error('OpenAI API key is not configured');
}

const openai = new OpenAI({
    apiKey: process.env.AI_KEY.trim(),
});

const isConnectionError = (errorMessage) => {
    if (!errorMessage) return false;
    const lower = errorMessage.toLowerCase();
    return lower.includes('connect') ||
        lower.includes('network') ||
        lower.includes('timeout') ||
        lower.includes('unable to reach') ||
        lower.includes('request failed');
};


const resolveName = async (entity, Model) => {
    if (!entity) return null;
    if (typeof entity === 'object') return entity.name || null;
    if (typeof entity === 'string') {
        try {
            const doc = await Model.findById(entity);
            if (doc && doc.name) return doc.name;
        } catch (e) { }
        return entity;
    }
    return String(entity);
};

const getAICompletion = async (category, sub_category, messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Prompt text is required');
    }
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser?.content?.trim()) {
        throw new Error('Prompt text is required');
    }
    try {
        const categoryName = await resolveName(category, Category);
        const subCategoryName = await resolveName(sub_category, SubCategory);
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an educational assistant. Explain the subject clearly based on category: ${categoryName ||
                        category} and sub-category: ${subCategoryName ||
                        sub_category}. Provide informative, explanatory content and examples where useful, rather than study instructions. Use the same language as the user's prompt. Continue the conversation naturally when the user asks follow-up questions.`
                },
                ...messages,
            ],
            temperature: 0.7,
        });

        return response.choices?.[0]?.message?.content || null;
    } catch (error) {
        const openaiError = error?.response?.data?.error?.message || error?.response?.data || error?.message || 'Unknown AI error';
        console.error('Detailed OpenAI Error:', openaiError);

        if (isConnectionError(openaiError)) {
            throw new Error('Unable to connect to the AI service. Please check your network and API key.');
        }

        throw new Error(`Failed to generate AI lesson: ${openaiError}`);
    }
};

module.exports = { getAICompletion };