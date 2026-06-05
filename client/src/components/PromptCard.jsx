import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Collapse,
  Paper,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ForumIcon from '@mui/icons-material/Forum';

const getMessages = (prompt) => {
  if (prompt.messages?.length) return prompt.messages;
  if (prompt.prompt) {
    return [
      { role: 'user', content: prompt.prompt },
      { role: 'assistant', content: prompt.response || '' },
    ];
  }
  return [];
};

function PromptCard({ prompt, onDelete }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const messages = getMessages(prompt);
  const messageCount = messages.length;

  const date = prompt.createdAt
    ? new Date(prompt.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const categoryName = prompt.category_id?.name || 'Category';
  const subCategoryName = prompt.sub_category_id?.name || 'Subcategory';
  const title = prompt.prompt || messages[0]?.content || 'Conversation';

  const handleContinue = () => {
    navigate('/', {
      state: {
        resumeConversation: {
          conversationId: prompt._id,
          messages,
          categoryId: prompt.category_id?._id || prompt.category_id,
          subCategoryId: prompt.sub_category_id?._id || prompt.sub_category_id,
        },
      },
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={categoryName} size="small" color="primary" variant="outlined" />
          <Chip label={subCategoryName} size="small" variant="outlined" />
          <Chip label={`${messageCount} messages`} size="small" />
          <Typography variant="caption" sx={{ ml: 'auto', opacity: 0.6 }}>
            {date}
          </Typography>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(prompt._id)}
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'primary.main' }}
            onClick={() => setOpen(!open)}
          >
            <ExpandMoreIcon
              sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
            />
            <Typography variant="body2">
              {open ? 'Hide conversation' : 'Show full conversation'}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<ForumIcon />}
            onClick={handleContinue}
          >
            Continue conversation
          </Button>
        </Box>

        <Collapse in={open}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((msg, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: msg.role === 'user' ? '#EEF0FF' : '#F8F9FE',
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {msg.role === 'user' ? 'You' : 'Teacher'}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {msg.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default PromptCard;
