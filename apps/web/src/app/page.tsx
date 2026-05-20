import HomeContent from './home/components/HomeContent';
import HeroSection from '@/components/HeroSection';
const Home = () => {
    return (
        <div className="fairmeme-home flex h-full min-h-[100vh] flex-col bg-[#181a20]">
            <HeroSection />
            <HomeContent />
        </div>
    );
};

export default Home;
