import { useSelector } from 'react-redux';
import { useGetUserPromptsQuery, useDeletePromptMutation } from '../features/prompts/promptsApi';
import PromptCard from '../components/PromptCard';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

function HistoryPage() {
  const userId = useSelector((state) => state.auth.user?._id);
  const { data: prompts = [], isLoading, error } = useGetUserPromptsQuery(
    { userId },
    { skip: !userId }
  );
  const [deletePrompt] = useDeletePromptMutation();

  const handleDelete = async (id) => {
    try {
      await deletePrompt(id).unwrap();
    } catch {
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700}>
          Conversation History
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && (
        <Alert severity="error">Error loading history</Alert>
      )}

      {!isLoading && !error && prompts.length === 0 && (
        <Alert severity="info">You have no conversations</Alert>
      )}

      {prompts.map((prompt) => (
        <PromptCard key={prompt._id} prompt={prompt} onDelete={handleDelete} />
      ))}
    </Box>
  );
}

export default HistoryPage;
