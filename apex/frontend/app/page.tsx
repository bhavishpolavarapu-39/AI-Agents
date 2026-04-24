'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AnimatedHeading from '@/components/AnimatedHeading';
import FadeIn from '@/components/FadeIn';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const handleExplore = () => {
    router.push('/dashboard?tab=market');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Video Background - Raw, no overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Navbar */}
      <nav className="liquid-glass fixed top-0 left-0 right-0 z-50 mx-6 md:mx-12 lg:mx-16 mt-6 rounded-xl px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="text-2xl font-semibold tracking-tight text-white hover:opacity-80 transition-opacity"
        >
          APEX
        </button>

        {/* Center Links - Hidden on mobile */}
        <div className="hidden md:flex gap-8">
          {[
            { label: 'Portfolio', href: '/dashboard' },
            { label: 'Markets', href: '/dashboard?tab=market' },
            { label: 'News', href: '/dashboard?tab=news' },
            { label: 'Agents', href: '/dashboard?tab=agents' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => router.push(link.href)}
              className="text-sm text-white hover:text-gray-300 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={handleGetStarted}
          className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Dashboard
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-12 lg:pb-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-end gap-12">
          {/* Left Column - Main Content */}
          <div>
            {/* Animated Heading */}
            <AnimatedHeading
              text="World-Class\nPortfolio Intelligence"
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white leading-tight"
              initialDelay={200}
              charDelay={30}
              transitionDuration={500}
              style={{ letterSpacing: '-0.04em' }}
            />

            {/* Subheading */}
            <FadeIn delay={800} duration={1000}>
              <p className="text-base md:text-lg text-gray-300 mb-5 max-w-lg">
                Advanced AI agents analyzing markets, optimizing portfolios, and providing investment intelligence across global exchanges.
              </p>
            </FadeIn>

            {/* Buttons */}
            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Start Dashboard
                </button>
                <button
                  onClick={handleExplore}
                  className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-200"
                >
                  Explore Markets
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Tag */}
          <FadeIn delay={1400} duration={1000} className="lg:flex lg:items-end lg:justify-end">
            <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl mt-8 lg:mt-0 w-fit">
              <p className="text-lg md:text-xl lg:text-2xl font-light text-white">
                Portfolio. Markets. Intelligence.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
