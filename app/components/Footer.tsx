interface FooterProps {
  hideFaqLink?: boolean
}

export default function Footer({ hideFaqLink = false }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-6 md:px-8 pb-4 md:pb-6 pt-5 md:pt-0">
      {/* Mobile: Email • Phone on one line */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <a
            href="mailto:hi@dennispetri.nl"
            className="text-nav-link"
          >
            Email
          </a>
          <span className="text-footer" aria-hidden="true">•</span>
          <a
            href="tel:+31647258820"
            className="text-nav-link"
          >
            Phone
          </a>
        </div>
        <p className="text-footer">
          © {currentYear} Dennis Petri<br />
          Product design & creative direction
        </p>
        {!hideFaqLink && (
          <a 
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-footer hover:underline text-sm"
          >
            FAQ
          </a>
        )}
      </div>
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex justify-between items-center">
        <p className="text-footer">
          © {currentYear} Dennis Petri - Product design & creative direction
        </p>
        {!hideFaqLink && (
          <a 
            href="/faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-footer hover:underline text-sm"
          >
            FAQ
          </a>
        )}
      </div>
    </footer>
  )
}
