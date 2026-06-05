import { apiSlice } from '../../services/apiSlice';

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    getSubCategories: builder.query({
      query: () => '/subcategories', 
      providesTags: ['SubCategories'], 
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} = categoriesApi;