const mongoose = require('mongoose');
const Prompt = require('../models/prompt');

const populateOptions = ['category_id', 'sub_category_id'];

const normalizeUserId = (userId) => {
    if (!userId) return null;
    const id = String(userId);
    return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
};

const getAll = async () => {
    return await Prompt.find().populate(populateOptions);
};

const getById = async (id) => {
    return await Prompt.findById(id).populate(populateOptions);
};

const getByIdForUser = async (id, userId) => {
    const ownerId = normalizeUserId(userId);
    if (!ownerId) return null;
    return await Prompt.findOne({ _id: id, user_id: ownerId }).populate(populateOptions);
};

const getByUser = async (userId) => {
    const ownerId = normalizeUserId(userId);
    if (!ownerId) return [];
    return await Prompt.find({ user_id: ownerId })
        .sort({ updatedAt: -1 })
        .populate(populateOptions);
};

const create = async (prompt) => {
    return await Prompt.create(prompt);
};

const remove = async (id) => {
    const prompt = await Prompt.findById(id);
    if (!prompt) return null;
    await prompt.deleteOne();
    return true;
};

const removeForUser = async (id, userId) => {
    const ownerId = normalizeUserId(userId);
    if (!ownerId) return null;
    const prompt = await Prompt.findOne({ _id: id, user_id: ownerId });
    if (!prompt) return null;
    await prompt.deleteOne();
    return true;
};

const getMessages = (prompt) => {
    if (prompt.messages?.length) return prompt.messages;
    if (prompt.prompt) {
        return [
            { role: 'user', content: prompt.prompt },
            { role: 'assistant', content: prompt.response || '' },
        ];
    }
    return [];
};

const addMessageForUser = async (id, userId, userMessage, aiResponse) => {
    const ownerId = normalizeUserId(userId);
    if (!ownerId) return null;
    const prompt = await Prompt.findOne({ _id: id, user_id: ownerId });
    if (!prompt) return null;

    const history = getMessages(prompt);
    prompt.messages = [
        ...history,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse },
    ];
    prompt.response = aiResponse;
    await prompt.save();
    return prompt.populate(populateOptions);
};

module.exports = {
    getAll,
    getByUser,
    getById,
    getByIdForUser,
    getMessages,
    create,
    remove,
    removeForUser,
    addMessageForUser,
};