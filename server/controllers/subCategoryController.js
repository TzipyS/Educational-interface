const subCategoryService = require('../services/subCategoryService');

const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await subCategoryService.getAll();
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await subCategoryService.getById(req.params.id);
        if (!subCategory) {
            return res.status(404).send('SubCategory not found');
        }
        res.json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSubCategory = async (req, res) => {
    try {
        const { name, category_id } = req.body;
        const subCategory = await subCategoryService.create(name, category_id);
        if (!subCategory) {
            return res.status(400).send('Error create subcategory');
        }
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { id, name, category_id } = req.body;
        const subCategory = await subCategoryService.update(id, name, category_id);
        if (!subCategory) {
            return res.status(404).send('SubCategory not found');
        }
        res.json(subCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const success = await subCategoryService.remove(req.params.id);
        if (!success) {
            return res.status(404).send('SubCategory not found');
        }
        res.json({ message: 'SubCategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
};  