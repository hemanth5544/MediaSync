// Home.jsx
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { VideoCall, Group } from '@mui/icons-material';

// Animations
const ring = keyframes`
  0% { transform: rotate(0deg); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-10deg); }
  30% { transform: rotate(10deg); }
  40% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Styled Components
const Root = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(33, 33, 33, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: '#252525',
  borderRadius: 16,
  padding: theme.spacing(3),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    '& .video-icon': {
      animation: `${ring} 1s ease-in-out`,
    },
    '& .group-icon': {
      animation: `${pulse} 1s ease-in-out infinite`,
    },
  },
}));

const IconContainer = styled(Box)(({ theme, color }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: color === 'blue'
    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
    : 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
}));

const GradientText = styled(Typography)({
  background: 'linear-gradient(45deg, #60a5fa 30%, #a5b4fc 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

// Main Component
export const Home = () => {
  return (
    <Root>
      <StyledAppBar position="static">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 2,
              color: '#ffffff',
            }}
          >
            MediaSync
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <GradientText variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Connect & Stream
          </GradientText>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}>
            Experience seamless communication and broadcasting with cutting-edge technology
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <FeatureItem
            to="/call"
            icon={<Group sx={{ fontSize: 48, color: '#ffffff' }} className="group-icon" />}
            title="Meeting Call"
            description="Join secure, high-quality video meetings with your team"
            color="blue"
            buttonText="Join Now"
          />
          <FeatureItem
            to="/stream"
            icon={<VideoCall sx={{ fontSize: 48, color: '#ffffff' }} className="video-icon" />}
            title="Live Stream"
            description="Broadcast to your audience with crystal-clear quality"
            color="green"
            buttonText="Go Live"
          />
        </Grid>
      </Container>
    </Root>
  );
};

// Feature Card Component
const FeatureItem = ({ to, icon, title, description, color, buttonText }) => (
  <Grid item xs={12} sm={6} md={5}>
    <Link to={to} style={{ textDecoration: 'none' }}>
      <FeatureCard>
        <CardContent sx={{ textAlign: 'center', color: '#ffffff' }}>
          <IconContainer color={color}>
            {icon}
          </IconContainer>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: color === 'blue'
                ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                : 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
              borderRadius: 8,
              textTransform: 'none',
              px: 4,
              py: 1,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: color === 'blue'
                  ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                  : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              },
            }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </FeatureCard>
    </Link>
  </Grid>
);

export default Home;