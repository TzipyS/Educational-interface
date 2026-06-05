const Category = require('../models/Category');

const getAll = async () => {
    return await Category.find();
};

const getById = async (id) => {
    return await Category.findById(id);
};

const create = async (name) => {
    return await Category.create({ name });
};

const update = async (id, name) => {
    const category = await Category.findById(id);
    if (!category) return null;

    category.name = name;
    return await category.save();
};

const remove = async (id) => {
    const category = await Category.findById(id);
    if (!category) return null;
    await category.deleteOne();
    return true;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};