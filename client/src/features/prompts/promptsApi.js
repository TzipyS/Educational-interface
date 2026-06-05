import { apiSlice } from '../../services/apiSlice';

export const promptsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserPrompts: builder.query({
      query: () => '/prompts/user',
      providesTags: ['Prompts'],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const userId = queryArgs?.userId ?? 'anonymous';
        return `${endpointName}-${userId}`;
      },
    }),

    createPrompt: builder.mutation({
      query: (body) => ({
        url: '/prompts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prompts'],
    }),

    continuePrompt: builder.mutation({
      query: ({ id, prompt }) => ({
        url: `/prompts/${id}/messages`,
        method: 'POST',
        body: { prompt },
      }),
      invalidatesTags: ['Prompts'],

    }),

    deletePrompt: builder.mutation({
      query: (id) => ({
        url: `/prompts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prompts'],
    }),
  }),
});


export const {
  useGetUserPromptsQuery,
  useCreatePromptMutation,
  useContinuePromptMutation,
  useDeletePromptMutation,
} = promptsApi;

