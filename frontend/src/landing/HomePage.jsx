import React from 'react'
import Navbar from './components/ui/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import About from './components/About'
import Footer from './components/Footer'

function HomePage() {
    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            <Navbar />
            <Hero />
            <Services />
            <Gallery />
            <About />
            <Footer />
        </div>
    )
}

export default HomePage
