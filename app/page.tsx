'use client'

import GradientBackground from './components/GradientBackground'

// Add your logo filenames here (must match files in /public/logos/)
const logos = [
  'atni.svg',
  'dutchqualitygroup.svg',
  'grotekerkbreda.svg',
  'hellopublic.svg',
  'ing.svg',
  'milvum.svg',
  'neuralteq.svg',
  'pixelfit.svg',
  'sportiefbesteedgroep.svg',
  'tofhelmets.svg',
  'uwv.svg',
  // Add more logos as you add them to the folder:
  // 'filename.svg',
]

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="page">
      <GradientBackground />
      
      <div className="relative z-10 flex flex-col content-wrapper">
        {/* Top Navigation */}
        <nav className="animate-header flex-shrink-0 w-full px-6 md:px-8 pt-4 md:pt-8 flex justify-between items-center content-section">
          {/* Logo/Name */}
          <div className="flex items-center gap-2">
            <img
              src="/profile_dennis.jpg"
              alt="Dennis Petri profile"
              width={48}
              height={48}
              style={{
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div className="text-logo">
              Dennis Petri
            </div>
            <div
              className="cursor-blink align-bottom"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#FFFF33',
                flexShrink: 0,
                display: 'inline-block',
                verticalAlign: 'bottom'
              }}
            />
          </div>
          
          {/* Links */}
          <div className="flex gap-4 md:gap-6">
            <a 
              href="https://www.linkedin.com/in/dennispetri/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-nav-link"
            >
              LinkedIn
            </a>
            {/* Email and Phone - hidden on mobile, shown on desktop */}
            <span className="text-nav-separator hidden md:inline">·</span>
            <a 
              href="mailto:hi@dennispetri.nl" 
              className="text-nav-link hidden md:inline"
            >
              Email
            </a>
            <span className="text-nav-separator hidden md:inline">·</span>
            <a 
              href="tel:+31647258820" 
              className="text-nav-link hidden md:inline"
            >
              Phone
            </a>
          </div>
        </nav>

        {/* Main Content & Logos - Combined flex container */}
        <div className="flex-1 flex flex-col min-h-0 px-6 md:px-8 content-section mobile-main-area">
          {/* Main Content - Centered between nav and "Worked with" */}
          <main className="animate-body flex-1 flex items-center min-h-0">
            <div className="w-full max-w-[1280px]">
              {/* H1 */}
              <h1 className="text-heading-1">
              SPEED IS SOLVED.<br />
              TASTE ISN&rsquo;T
              </h1>

              {/* Body Text */}
              <p className="text-body">
                Creative direction and product design. I decide what good looks like, and make sure it ships.
              </p>

              {/* Primary CTA */}
              <a 
                href="https://app.reclaim.ai/m/meet-dennispetri/intro-with-dennis" 
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book an intro
              </a>
            </div>
          </main>

          {/* Caption & Logo Strip - Bottom of flex container */}
          <section className="animate-section flex-shrink-0 py-2 md:py-2 mb-0 md:mb-10">
            <div className="w-full max-w-[1024px]">
              {/* Caption */}
              <p className="text-caption">
                Selected clients, most for 5+ years:
              </p>

              {/* Logo Strip Container */}
              <div className="overflow-hidden">
                <div className="logo-strip">
                  {/* Set 1 */}
                  <div className="logo-set">
                    {logos.map((logo, i) => (
                      <img 
                        key={i}
                        src={`/logos/${logo}`}
                        alt=""
                      />
                    ))}
                  </div>
                  {/* Set 2 - duplicate for seamless loop */}
                  <div className="logo-set" aria-hidden="true">
                    {logos.map((logo, i) => (
                      <img 
                        key={`set2-${i}`}
                        src={`/logos/${logo}`}
                        alt=""
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer - on mobile, visible after scroll */}
        <footer className="animate-footer flex-shrink-0 px-6 md:px-8 pb-6 md:pb-6 pt-8 md:pt-0 content-section content-footer">
          {/* Mobile: Left-aligned, vertically stacked */}
          <div className="flex flex-col gap-2 md:hidden">
            <a
              href="mailto:hi@dennispetri.nl"
              className="text-nav-link"
            >
              Email
            </a>
            <a 
              href="tel:+31647258820" 
              className="text-nav-link"
            >
              Phone
            </a>
            <p className="text-footer">
              © {currentYear} Dennis Petri<br />
              Product design & creative direction
            </p>
          </div>
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex justify-between items-center">
            <p className="text-footer">
              © {currentYear} Dennis Petri - Product design & creative direction
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}