import { useLocation } from 'react-router-dom';
import PromptForm from '../components/PromptForm';
import { Typography, Box, Alert } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function HomePage() {
  const location = useLocation();
  const resumeConversation = location.state?.resumeConversation ?? null;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" fontWeight={700}>
          {resumeConversation ? 'Continue Conversation' : 'Ask the Teacher'}
        </Typography>
      </Box>

      {resumeConversation ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Continuing a conversation from history - write your follow-up question below
        </Alert>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Pick a category, ask a question, and get a clear explanation.
        </Typography>
      )}

      <PromptForm
        key={resumeConversation?.conversationId || 'new'}
        resumeConversation={resumeConversation}
      />
    </Box>
  );
}

export default HomePage;
