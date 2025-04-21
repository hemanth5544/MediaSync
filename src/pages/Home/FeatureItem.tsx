// Home/FeatureItem.jsx
import { Link } from 'react-router-dom';
import { CardContent, Typography, Grid, Box, Button, Divider } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { ElegantCard, IconContainer } from './Styles';

const FeatureItem = ({ to, icon, title, description, color, buttonText }) => (
  <Grid item xs={12} md={5.5}>
    <Link to={to} style={{ textDecoration: 'none' }}>
      <ElegantCard elevation={0}>
        <CardContent sx={{ padding: '32px', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Box className="icon-container" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <IconContainer color={color} className="icon">
                  {icon}
                </IconContainer>
              </Box>
              <Box sx={{ ml: 3, mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#f8fafc' }}>
                  {title}
                </Typography>
                <Typography sx={{ color: 'rgba(248, 250, 252, 0.7)', maxWidth: '280px' }}>
                  {description}
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                my: 3,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                width: '100%',
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
              <Button
                variant="text"
                sx={{
                  color: color === 'blue' ? '#3b82f6' : '#22c55e',
                  fontWeight: 600,
                  fontSize: '15px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {buttonText}
                <ChevronRight sx={{ fontSize: 20 }} />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </ElegantCard>
    </Link>
  </Grid>
);

export default FeatureItem;
