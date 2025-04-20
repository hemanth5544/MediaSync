// Home/index.jsx
import { Container, Grid, Box, Typography } from '@mui/material';
import { Group, VideoCall } from '@mui/icons-material';
import Header from './Header.tsx';
import Hero from './Hero.tsx';
import FeatureItem from './FeatureItem.tsx';
import { Root } from './Styles.tsx';

export const Home = () => {
  return (
    <Root>
      <Header />

      <Hero />

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <FeatureItem
            to="/call"
            icon={<Group sx={{ fontSize: 40, color: '#ffffff' }} />}
            title="Virtual Meetings"
            description="Crystal-clear video meetings for teams of any size."
            color="blue"
            buttonText="Start meeting"
          />
          <FeatureItem
            to="/stream"
            icon={<VideoCall sx={{ fontSize: 40, color: '#ffffff' }} />}
            title="Live Streaming"
            description="Broadcast high-quality content to your audience."
            color="green"
            buttonText="Go live"
          />
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 10, color: 'rgba(248, 250, 252, 0.4)' }}>
        </Box>
      </Container>
    </Root>
  );
};
