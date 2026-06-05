const Category = require('../models/Category');

const categories = [
    'Mathematics',
    'Science',
    'History',
    'Literature',
    'English',
    'Programming',
];

const seedCategories = async () => {
    await Category.insertMany(categories.map((name) => ({ name })));
    console.log('Categories seeded');
};

module.exports = seedCategories;
