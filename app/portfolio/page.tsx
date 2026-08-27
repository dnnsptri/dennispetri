'use client'

import ScrollFolio, { Project } from '../components/ScrollFolio'
import GradientBackground from '../components/GradientBackground'

// ============================================
// DUMMY PROJECTS DATA
// Replace with your CMS data (Contentful, Sanity, etc.)
// ============================================

const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Meridian Banking Platform',
    category: 'Product Strategy',
    description: 'A complete reimagining of digital banking. We crafted an experience that puts financial wellness at the center, with personalized insights and frictionless transactions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2024',
    client: 'Meridian Finance',
    tags: ['Strategy', 'UX Design', 'Product']
  },
  {
    id: 'project-2',
    title: 'Aurora Health System',
    category: 'Digital Transformation',
    description: 'Transforming healthcare delivery through connected experiences. A unified platform serving patients, providers, and administrators with real-time health intelligence.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2024',
    client: 'Aurora Healthcare',
    tags: ['Healthcare', 'Platform', 'Integration']
  },
  {
    id: 'project-3',
    title: 'Vertex AI Platform',
    category: 'Product Development',
    description: 'Building the future of enterprise AI. A decision intelligence platform that transforms data into actionable insights, enabling organizations to move faster with confidence.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2024',
    client: 'Vertex Technologies',
    tags: ['AI/ML', 'Enterprise', 'SaaS']
  },
  {
    id: 'project-4',
    title: 'Nordic Outdoor Commerce',
    category: 'E-commerce',
    description: 'A premium shopping experience for adventure seekers. We designed a commerce platform that captures the spirit of exploration while driving conversion.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2023',
    client: 'Nordic Trails',
    tags: ['E-commerce', 'Branding', 'DTC']
  },
  {
    id: 'project-5',
    title: 'Metropolitan Museum Digital',
    category: 'Cultural Innovation',
    description: 'Bridging centuries of art with modern technology. An immersive digital experience that brings masterpieces to life and connects global audiences with cultural heritage.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2023',
    client: 'Metro Museum',
    tags: ['Culture', 'Digital Experience', 'AR/VR']
  },
  {
    id: 'project-6',
    title: 'Flux Energy Dashboard',
    category: 'Data Visualization',
    description: 'Making energy data beautiful and actionable. A real-time monitoring platform that helps enterprises track, analyze, and optimize their energy consumption at scale.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&q=80',
    link: '#',
    year: '2023',
    client: 'Flux Energy',
    tags: ['Dashboard', 'Analytics', 'Sustainability']
  }
]

// ============================================
// PORTFOLIO PAGE
// ============================================

export default function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* Optional: Use gradient background */}
      {/* <GradientBackground /> */}
      
      <div className="relative z-10">
        {/* Scroll Folio Component */}
        <ScrollFolio 
          projects={projects}
          title="Selected Work"
          showNavigator={true}
          allowListView={true}
          onProjectChange={(project, index) => {
            // Optional: Track analytics, update URL, etc.
            console.log(`Viewing: ${project.title}`)
          }}
        />
        
        {/* Footer CTA section */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-transparent to-[#0a0a0a]">
          <div className="text-center max-w-2xl">
            <p className="sf-project-category mb-4">Get in touch</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#FAFAFA] mb-6 leading-tight">
              Let's create something remarkable together
            </h2>
            <p className="text-base md:text-lg text-[#FAFAFA] opacity-60 mb-8 max-w-lg mx-auto">
              Open to meaningful collaborations and conversations about product, strategy, and design.
            </p>
            <a 
              href="mailto:hello@example.com"
              className="sf-project-link"
            >
              Start a conversation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 12L12 4M12 4H6M12 4V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
