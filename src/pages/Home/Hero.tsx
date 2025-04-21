// Home/Hero.jsx
import { Exposure } from '@mui/icons-material';
import { Container, Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion'
 const Hero = () => (
  <Box sx={{ py: 10, textAlign: 'center', position: 'relative' }}>
    <Container maxWidth="lg">
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 3,
          background: 'linear-gradient(90deg, #f8fafc, #bfdbfe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          lineHeight: 1.2,
        }}
      >
        Communicate seamlessly
      </Typography>

      <Typography
        sx={{
          color: 'rgba(248, 250, 252, 0.7)',
          mb: 5,
          fontSize: '1.125rem',
          lineHeight: 1.6,
        }}
      >
        High-quality video meetings and broadcasts with just a few clicks
      </Typography>

      <Button
        variant="contained"
        sx={{
          background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
          borderRadius: '6px',
          px: 4,
          py: 1.5,
          fontWeight: 600,
          fontSize: '0.95rem',
          textTransform: 'none',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
            boxShadow: '0 15px 20px -3px rgba(59, 130, 246, 0.4)',
          },
        }}
      >
        Start for free
      </Button>
    </Container>
  </Box>
);

export default Hero;