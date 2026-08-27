'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================
// TYPES - CMS Ready
// ============================================

export interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  link?: string
  year?: string
  client?: string
  tags?: string[]
}

export interface ScrollFolioProps {
  /** Array of projects from CMS or static data */
  projects: Project[]
  /** Optional header title */
  title?: string
  /** Show/hide the overlay navigator */
  showNavigator?: boolean
  /** Allow toggling to list view */
  allowListView?: boolean
  /** Callback when a project becomes active */
  onProjectChange?: (project: Project, index: number) => void
}

// ============================================
// SCROLL FOLIO COMPONENT
// ============================================

export default function ScrollFolio({
  projects,
  title,
  showNavigator = true,
  allowListView = true,
  onProjectChange,
}: ScrollFolioProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isListView, setIsListView] = useState(false)
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true) // Open by default
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle scroll and calculate active project
  useEffect(() => {
    if (isListView) return

    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const containerTop = rect.top
      const containerHeight = container.offsetHeight - windowHeight

      // Calculate scroll progress through the container
      const scrolled = -containerTop
      const progress = Math.max(0, Math.min(1, scrolled / containerHeight))

      setScrollProgress(progress)

      // Calculate which project is active
      const projectCount = projects.length
      const sectionSize = 1 / projectCount
      const newIndex = Math.min(
        projectCount - 1,
        Math.max(0, Math.floor(progress / sectionSize))
      )

      if (newIndex !== activeIndex) {
        setIsTransitioning(true)
        setActiveIndex(newIndex)
        onProjectChange?.(projects[newIndex], newIndex)
        // Reset transition state after animation completes
        setTimeout(() => setIsTransitioning(false), 600)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [projects, activeIndex, isListView, onProjectChange])

  // Navigate to specific project
  const goToProject = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return

    const containerTop = container.offsetTop
    const containerHeight = container.offsetHeight - window.innerHeight
    const targetScroll = containerTop + (index / projects.length) * containerHeight

    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    setIsNavigatorOpen(false)
  }, [projects.length])

  // Preload images
  useEffect(() => {
    projects.forEach((project) => {
      const img = new Image()
      img.onload = () => {
        setImageLoaded((prev) => ({ ...prev, [project.id]: true }))
      }
      img.src = project.image
    })
  }, [projects])

  const activeProject = projects[activeIndex]

  // ============================================
  // LIST VIEW
  // ============================================
  if (isListView) {
    return (
      <section className="sf-list-container">
        {/* Header */}
        <header className="sf-list-header">
          {title && <h2 className="sf-list-title">{title}</h2>}
          {allowListView && (
            <button
              className="sf-view-toggle"
              onClick={() => setIsListView(false)}
              aria-label="Switch to scroll view"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Scroll View
            </button>
          )}
        </header>

        {/* List Grid */}
        <div className="sf-list-grid">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="sf-list-item"
              onClick={() => {
                setIsListView(false)
                setTimeout(() => goToProject(index), 100)
              }}
            >
              <div className="sf-list-item-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="sf-list-item-overlay">
                  <span className="sf-list-item-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <div className="sf-list-item-content">
                <span className="sf-list-item-category">{project.category}</span>
                <h3 className="sf-list-item-title">{project.title}</h3>
                {project.year && (
                  <span className="sf-list-item-year">{project.year}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  // ============================================
  // SCROLL VIEW (Default)
  // ============================================
  return (
    <section
      ref={containerRef}
      className="sf-container"
      style={{ height: `${(projects.length + 1) * 100}vh` }}
    >
      {/* Sticky Viewport */}
      <div className="sf-sticky">
        {/* Background Image - Smooth Transitions */}
        <div className="sf-image-container">
          {projects.map((project, index) => {
            const isActive = index === activeIndex
            const distance = Math.abs(index - activeIndex)

            return (
              <div
                key={project.id}
                className={`sf-image-wrapper ${isActive ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `scale(${isActive ? 1 : 1.1}) translateY(${isActive ? 0 : (index > activeIndex ? 20 : -20)}px)`,
                  zIndex: isActive ? 2 : 1,
                  visibility: distance > 1 ? 'hidden' : 'visible',
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="sf-image"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
                <div className="sf-image-overlay" />
              </div>
            )
          })}
        </div>

        {/* Content Layer */}
        <div className="sf-content-layer">
          {/* Top Bar */}
          <header className="sf-header">
            <div className="sf-header-left">
              {title && <span className="sf-header-title">{title}</span>}
              <span className="sf-header-counter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>
            <div className="sf-header-right">
              {allowListView && (
                <button
                  className="sf-view-toggle"
                  onClick={() => setIsListView(true)}
                  aria-label="Switch to list view"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  List
                </button>
              )}
            </div>
          </header>

          {/* Project Info - Editorial Layout with Smooth Transitions */}
          <div className={`sf-project-info ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="sf-project-meta sf-animate-item" style={{ animationDelay: '0ms' }}>
              <span className="sf-project-category">{activeProject.category}</span>
              {activeProject.year && (
                <>
                  <span className="sf-project-divider">·</span>
                  <span className="sf-project-year">{activeProject.year}</span>
                </>
              )}
              {activeProject.client && (
                <>
                  <span className="sf-project-divider">·</span>
                  <span className="sf-project-client">{activeProject.client}</span>
                </>
              )}
            </div>

            <h2 className="sf-project-title sf-animate-item" style={{ animationDelay: '50ms' }}>
              {activeProject.title}
            </h2>
            
            <p className="sf-project-description sf-animate-item" style={{ animationDelay: '100ms' }}>
              {activeProject.description}
            </p>

            {activeProject.tags && activeProject.tags.length > 0 && (
              <div className="sf-project-tags sf-animate-item" style={{ animationDelay: '150ms' }}>
                {activeProject.tags.map((tag) => (
                  <span key={tag} className="sf-project-tag">{tag}</span>
                ))}
              </div>
            )}

            {activeProject.link && (
              <a
                href={activeProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-project-link sf-animate-item"
                style={{ animationDelay: '200ms' }}
              >
                View Project
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
            )}
          </div>

          {/* Progress Bar */}
          <div className="sf-progress-container">
            <div
              className="sf-progress-bar"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Overlay Navigator */}
        {showNavigator && (
          <>
            <button
              className={`sf-nav-toggle ${isNavigatorOpen ? 'open' : ''}`}
              onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
              aria-label="Toggle project navigator"
            >
              <div className="sf-nav-toggle-inner">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            <div className={`sf-navigator ${isNavigatorOpen ? 'open' : ''}`}>
              <div className="sf-navigator-inner">
                <div className="sf-navigator-header">
                  <span>Projects</span>
                  <button
                    onClick={() => setIsNavigatorOpen(false)}
                    aria-label="Close navigator"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div className="sf-navigator-list">
                  {projects.map((project, index) => (
                    <button
                      key={project.id}
                      className={`sf-navigator-item ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => goToProject(index)}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        opacity: isNavigatorOpen ? 1 : 0,
                        transform: isNavigatorOpen 
                          ? `translateX(${index === activeIndex ? 8 : 0}px)` 
                          : 'translateX(20px)',
                        transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 30}ms`
                      }}
                    >
                      <div className="sf-navigator-thumb">
                        <img src={project.image} alt="" loading="lazy" />
                      </div>
                      <div className="sf-navigator-item-info">
                        <span className="sf-navigator-item-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="sf-navigator-item-title">
                          {project.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Scroll Hint */}
        <div
          className="sf-scroll-hint"
          style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
        >
          <div className="sf-scroll-hint-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M12 19l-4-4M12 19l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  )
}
