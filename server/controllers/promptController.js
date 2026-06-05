const promptService = require('../services/promptService');
const aiService = require('../services/aiService');

const getAllPrompts = async (req, res) => {
    try {
        const prompts = await promptService.getAll();
        if (!prompts || prompts.length === 0)
            return res.status(404).send("Prompts not found");
        res.json(prompts);
    } catch (error) {
        res.status(500).send("Error fetching prompts");
    }
};

const getPromptsByUser = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).send('Unauthorized');
        }
        const prompts = await promptService.getByUser(req.user._id);
        res.json(prompts || []);
    } catch (error) {
        res.status(500).send("Error fetching prompts");
    }
};

const getPromptById = async (req, res) => {
    try {
        const { id } = req.params;
        const prompt = await promptService.getByIdForUser(id, req.user._id);
        if (!prompt)
            return res.status(404).send("Prompt not found");
        return res.json(prompt);
    } catch (error) {
        res.status(500).send("Invalid ID format");
    }
};


const createPrompt = async (req, res) => {
    try {
        const { category_id, sub_category_id, prompt } = req.body;
        const user_id = req.user._id;
        if (!req.user || !req.user._id)
            return res.status(401).send("Unauthorized");
        if (!category_id || !sub_category_id)
            return res.status(400).send("Category and sub-category are required");
        if (!prompt || typeof prompt !== 'string' || !prompt.trim())
            return res.status(400).send("Prompt text is required");
        const trimmedPrompt = prompt.trim();
        const aiResponse = await aiService.getAICompletion(category_id, sub_category_id, [
            { role: 'user', content: trimmedPrompt },
        ]);
        const newPrompt = await promptService.create({
            user_id,
            category_id,
            sub_category_id,
            prompt: trimmedPrompt,
            response: aiResponse,
            messages: [
                { role: 'user', content: trimmedPrompt },
                { role: 'assistant', content: aiResponse },
            ],
        });
        if (!newPrompt)
            return res.status(500).send("Could not save prompt");
        res.status(201).json(newPrompt);
    } catch (error) {
        console.error('Prompt creation error:', error);
        const isAIError = error.message?.includes('Unable to connect to the AI service') || error.message?.includes('Failed to generate AI lesson');
        const status = isAIError ? 502 : 400;
        res.status(status).send(error.message);
    }
};


const continuePrompt = async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== 'string' || !prompt.trim())
            return res.status(400).send("Prompt text is required");

        const existing = await promptService.getByIdForUser(id, req.user._id);
        if (!existing)
            return res.status(404).send("Prompt not found");

        const trimmedPrompt = prompt.trim();
        const history = promptService.getMessages(existing);
        const aiResponse = await aiService.getAICompletion(
            existing.category_id,
            existing.sub_category_id,
            [...history, { role: 'user', content: trimmedPrompt }]
        );

        const updated = await promptService.addMessageForUser(
            id,
            req.user._id,
            trimmedPrompt,
            aiResponse
        );
        if (!updated)
            return res.status(404).send("Prompt not found");

        res.json(updated);
    } catch (error) {
        console.error('Continue prompt error:', error);
        const isAIError = error.message?.includes('Unable to connect to the AI service') || error.message?.includes('Failed to generate AI lesson');
        const status = isAIError ? 502 : 400;
        res.status(status).send(error.message);
    }
};

const deletePrompt = async (req, res) => {
    try {
        const { id } = req.params;
        const successToDelete = await promptService.removeForUser(id, req.user._id);
        if (!successToDelete)
            return res.status(404).send("Prompt not found");
        res.send(`Prompt with id ${id} deleted successfully`);
    } catch (error) {
        res.status(500).send("Error delete prompt");
    }
};

module.exports = {
    getAllPrompts,
    getPromptsByUser,
    getPromptById,
    createPrompt,
    continuePrompt,
    deletePrompt,
};