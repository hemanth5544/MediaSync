// Home/styles.js
import { styled, keyframes } from '@mui/material/styles';
import { Box, Card } from '@mui/material';

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(96, 165, 250, 0.3); }
  50% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.6); }
  100% { box-shadow: 0 0 10px rgba(96, 165, 250, 0.3); }
`;

export const Root = styled('div')({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  color: '#f8fafc',
  overflow: 'hidden',
});

export const ElegantCard = styled(Card)({
  background: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '& .icon-container': {
      animation: `${glow} 2s infinite ease`,
    },
    '& .icon': {
      animation: `${pulse} 2s infinite ease`,
    },
  },
});

export const IconContainer = styled(Box)(({ color }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background:
    color === 'blue'
      ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
      : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
  marginBottom: '24px',
  position: 'relative',
  transform: 'rotate(5deg)',
}));
