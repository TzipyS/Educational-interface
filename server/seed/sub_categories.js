const Category = require('../models/Category');
const SubCategory = require('../models/Sub_category');

const subCategoriesByCategory = {
    'Mathematics': ['Algebra', 'Geometry', 'Statistics', 'Calculus'],
    'Science': ['Physics & Chemistry', 'Life Sciences', 'Earth Science'],
    'Environmental Science': ['Air Pollution', 'Recycling & Waste', 'Renewable Energy', 'Nature Conservation'],
    'Medicine & Technology': ['Genetics', 'Emergency Medicine', 'Medical Devices', 'Health Technology'],
    'Space & Astronomy': ['Solar System', 'Galaxies', 'Space Exploration', 'Astrophysics'],
    'History': ['Israeli History', 'World History', 'Ancient History', 'Middle Ages'],
    'Literature': ['Grammar', 'Writing', 'Hebrew Literature', 'Text Analysis'],
    'English': ['Grammar', 'Vocabulary', 'Reading', 'Writing'],
    'Programming': ['JavaScript', 'React', 'Node.js', 'Databases'],
};

const seedSubCategories = async () => {
    for (const [categoryName, subNames] of Object.entries(subCategoriesByCategory)) {
        const category = await Category.findOne({ name: categoryName });
        if (!category) continue;

        await SubCategory.insertMany(
            subNames.map((name) => ({
                name,
                category_id: category._id,
            }))
        );
    }
    console.log('Sub-categories seeded');
};

module.exports = seedSubCategories;
