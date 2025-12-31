import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import StatusTicker from '../components/StatusTicker'
import StatsSection from '../components/Statssection'
import FeaturesGrid from '../components/FeaturesGrid'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'

const LandingPage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <StatusTicker />
            <StatsSection />
            <FeaturesGrid />
            <CallToAction />
            <Footer />
        </>
    )
}
export default LandingPage