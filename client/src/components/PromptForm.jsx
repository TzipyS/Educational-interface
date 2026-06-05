import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePromptMutation, useContinuePromptMutation } from '../features/prompts/promptsApi';
import CategorySelect from './CategorySelect';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment';

function PromptForm({ resumeConversation = null }) {
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState(resumeConversation?.categoryId || '');
  const [subCategoryId, setSubCategoryId] = useState(resumeConversation?.subCategoryId || '');
  const [promptText, setPromptText] = useState('');
  const [conversationId, setConversationId] = useState(resumeConversation?.conversationId || null);
  const [messages, setMessages] = useState(resumeConversation?.messages || []);

  const [createPrompt, { isLoading: isCreating, error: createError }] = useCreatePromptMutation();
  const [continuePrompt, { isLoading: isContinuing, error: continueError }] = useContinuePromptMutation();

  const isLoading = isCreating || isContinuing;
  const error = createError || continueError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    try {
      if (conversationId) {
        const result = await continuePrompt({
          id: conversationId,
          prompt: promptText.trim(),
        }).unwrap();
        setMessages(result.messages || []);
      } else {
        if (!categoryId || !subCategoryId) return;
        const result = await createPrompt({
          category_id: categoryId,
          sub_category_id: subCategoryId,
          prompt: promptText.trim(),
        }).unwrap();
        setConversationId(result._id);
        setMessages(result.messages || []);
      }
      setPromptText('');
    } catch {
    }
  };

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setPromptText('');
    setCategoryId('');
    setSubCategoryId('');
    navigate('/', { replace: true });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {!conversationId && (
        <CategorySelect
          onCategoryChange={setCategoryId}
          onSubCategoryChange={setSubCategoryId}
        />
      )}

      {messages.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                bgcolor: msg.role === 'user' ? '#EEF0FF' : '#fff',
                borderLeft: msg.role === 'assistant' ? '4px solid #6C63FF' : 'none',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                {msg.role === 'user' ? 'You' : 'Teacher'}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {msg.content}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <TextField
        label={conversationId ? 'Continue the conversation...' : 'What would you like to learn today?'}
        placeholder={conversationId ? 'Ask for a continuation, ask for an example...' : 'For example: Explain to me what a quadratic equation is...'}
        multiline
        rows={3}
        fullWidth
        value={promptText}
        onChange={(e) => setPromptText(e.target.value)}
      />

      {error && (
        <Alert severity="error">
          {error.data || error.error || 'Error sending question - try again'}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={
            isLoading ||
            !promptText.trim() ||
            (!conversationId && (!categoryId || !subCategoryId))
          }
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {isLoading ? 'Loading...' : conversationId ? 'Send' : 'Ask'}
        </Button>

        {conversationId && (
          <Button
            variant="outlined"
            onClick={handleNewConversation}
            startIcon={<AddCommentIcon />}
          >
            New conversation
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default PromptForm;
