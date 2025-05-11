import { Link } from 'react-router-dom';
import { Cards } from '../../components/magicui/Cards';
import { Streamcards } from '../../components/magicui/Streamcard';
import { HeroScrollDemo } from '../../components/utils/HeroScrollDemo';

export const Home = () => {
  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{ backgroundColor: 'oklch(21% 0.006 285.885)' }}
    >
      <HeroScrollDemo />
      <div className="max-w-6xl mx-auto pt-4 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <Link to="/call">
            <Cards
              title="Virtual Meetings"
              description="Connect with crystal clarity for teams of any size. Experience uninterrupted conversations with smart noise reduction and adaptive bandwidth."
            />
          </Link>
          <Link to="/stream">
            <Streamcards
              title="Live Streaming"
              description="Broadcast your content to global audiences with professional-grade quality. Engage with viewers in real-time through interactive features."
            />
          </Link>
        </div>
      </div>
      </div>
  );
};