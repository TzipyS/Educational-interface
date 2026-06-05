import { useState } from 'react';
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from '../features/categories/categoriesApi';
import { FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from '@mui/material';

function CategorySelect({ onCategoryChange, onSubCategoryChange }) {
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: subCategories, isLoading: loadingSubCategories } = useGetSubCategoriesQuery();

  const filteredSubCategories = subCategories?.filter(
    (sub) => String(sub.category_id?._id ?? sub.category_id) === categoryId
  ) ?? [];

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setCategoryId(id);
    setSubCategoryId('');
    onCategoryChange(id);
    onSubCategoryChange('');
  };

  const handleSubCategoryChange = (e) => {
    const id = e.target.value;
    setSubCategoryId(id);
    onSubCategoryChange(id);
  };

  if (loadingCategories || loadingSubCategories) {
    return <CircularProgress size={28} />;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <FormControl fullWidth>
        <InputLabel>category</InputLabel>
        <Select
          value={categoryId}
          label="category"
          onChange={handleCategoryChange}
        >
          {categories?.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth disabled={!categoryId}>
        <InputLabel>sub category</InputLabel>
        <Select
          value={subCategoryId}
          label="sub category"
          onChange={handleSubCategoryChange}
        >
          {filteredSubCategories.map((sub) => (
            <MenuItem key={sub._id} value={sub._id}>
              {sub.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CategorySelect;
