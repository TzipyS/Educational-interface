import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { apiSlice } from '../services/apiSlice';
import {AppBar,Toolbar,Typography,Button,Box,Container,} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';

function Layout() {
  const navigate = useNavigate();      
  const location = useLocation(); 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 

  const handleLogout = () => {
    dispatch(apiSlice.util.resetApiState());
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8F9FE 0%, #EEF0FF 100%)' }}>
      <AppBar position="sticky" elevation={0} sx={{ background: '#6C63FF', borderRadius: '0 0 16px 16px' }}>
        <Toolbar sx={{ gap: 2 }}>
          <SchoolIcon />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Smart Teacher
          </Typography>

          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ opacity: location.pathname === '/' ? 1 : 0.75 }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{ opacity: location.pathname === '/history' ? 1 : 0.75 }}
          >
            History
          </Button>

          {user?.username && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Hello, {user.username}
            </Typography>
          )}

          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Exit
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;
