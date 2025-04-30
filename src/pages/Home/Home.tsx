import { Link } from 'react-router-dom';
import { Video, Users, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    
<div className="min-h-screen text-white font-sans" style={{ backgroundColor: "oklch(21% 0.006 285.885)"}}>
      <header className={`fixed w-full z-20 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">MediaSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/call" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Meetings</Link>
            <Link to="/stream" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Streaming</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">About</Link>
            <Link to="/contact" className="ml-2 px-5 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">Get Started</Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-10 bg-gray-900/98 md:hidden pt-20">
          <nav className="flex flex-col items-center space-y-8 pt-10">
            <Link 
              to="/call" 
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Meetings
            </Link>
            <Link 
              to="/stream" 
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Streaming
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-gray-900 rounded-full text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Communication <br className="md:hidden" />
            <span className="text-gray-300">Reimagined</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Elevate your virtual presence with cutting-edge video meetings and seamless streaming experiences.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link
              to="/call"
              className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-200 transition-all duration-300"
            >
              Start Meeting
            </Link>
            <Link
              to="/stream"
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/30 rounded-full font-medium hover:bg-white/10 transition-all duration-300"
            >
              Go Live
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Feature 1 */}
            <div className="group">
              <div className=" rounded-2xl p-8 h-full transition-all duration-300 hover:border-white/30"
              style={{ backgroundColor: "oklch(27.4% 0.006 286.033)" }}>
                <div className="p-3 bg-white/10 rounded-lg inline-block mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Virtual Meetings</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Connect with crystal clarity for teams of any size. Experience uninterrupted conversations with smart noise reduction and adaptive bandwidth.
                </p>
                <Link
                  to="/call"
                  className="inline-flex items-center text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className=" border border-gray-700 rounded-2xl p-8 h-full transition-all duration-300 hover:border-white/30"
               style={{ backgroundColor: "oklch(27.4% 0.006 286.033)"}}>
                <div className="p-3 bg-white/10 rounded-lg inline-block mb-6">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Live Streaming</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Broadcast your content to global audiences with professional-grade quality. Engage with viewers in real-time through interactive features.
                </p>
                <Link
                  to="/stream"
                  className="inline-flex items-center text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Learn more
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className=" border border-gray-700 rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Ready to transform your communication?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already elevated their virtual presence with our platform.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <Link to="/" className="flex items-center mb-6">
                <span className="text-xl font-bold text-white">MediaSync</span>
              </Link>
              <p className="text-gray-300 text-sm mb-6">
                Elevate your communication with cutting-edge virtual meeting and streaming technology.
              </p>
              <div className="flex space-x-4">
                <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">© 2025 MediaSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};