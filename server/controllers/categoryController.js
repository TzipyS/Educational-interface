const categoryService = require("../services/categoryService");

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAll();
        if (!categories || categories.length === 0)
            return res.status(404).send("Categories not found");
        res.json(categories);
    } catch (error) {
        res.status(500).send("Error fetching categories");
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getById(id);
        if (!category)
            return res.status(404).send("Category not found");
        return res.json(category);
    } catch (error) {
        res.status(500).send(error);
    }
};

const createCategory = async (req, res) => {

    const { name } = req.body;
    try {

        if (!name)
            return res.status(400).send("Name is required");
        const newCategory = await categoryService.create(name);
        if (!newCategory)
            return res.status(500).send("Could not save category");
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).send("Error create category");
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id || !name)
            return res.status(400).send("Id and name are required");
        const updateCategory = await categoryService.update(id, name);
        if (!updateCategory)
            return res.status(404).send("Category not found");
        res.json(updateCategory);
    } catch (error) {
        res.status(500).send("Error updating category");
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const successToDelete = await categoryService.remove(id);
        if (!successToDelete)
            return res.status(404).send("Category not found");

        res.send(`Category with id ${id} deleted successfully!`);
    } catch (error) {
        res.status(500).send("Error deleting category");
    }
};

module.exports = {
    getAllCategories,
    getCategoryById, createCategory,
    updateCategory,
    deleteCategory
};