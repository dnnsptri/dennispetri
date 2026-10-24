'use client'

import { useEffect, useRef } from 'react'

interface FAQWidgetProps {
  fallbackHTML: string
}

export default function FAQWidget({ fallbackHTML }: FAQWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create and insert the script
    const script = document.createElement('script')
    script.src = 'https://faqlue.com/embed.js'
    script.dataset.context = 'dennispetri-nl'
    script.dataset.locale = 'en'
    script.dataset.color = '#FAFAFA'
    script.dataset.font = 'system-ui, -apple-system, sans-serif'
    script.dataset.radius = '8'
    script.async = true
    
    scriptRef.current = script
    
    // Insert script after fallback div
    const fallbackDiv = container.querySelector('[data-faqlue-fallback]')
    if (fallbackDiv && fallbackDiv.nextSibling) {
      container.insertBefore(script, fallbackDiv.nextSibling)
    } else {
      container.appendChild(script)
    }
    
    // Wait for widget to be inserted (it inserts itself after the script)
    const checkForWidget = setInterval(() => {
      const widget = container.querySelector('#faqlue-widget') as HTMLDivElement
      if (widget) {
        widgetRef.current = widget
        clearInterval(checkForWidget)
      }
    }, 100)

    // Cleanup on unmount
    return () => {
      clearInterval(checkForWidget)
      
      // Remove script
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
      
      // Remove widget
      if (widgetRef.current && widgetRef.current.parentNode) {
        widgetRef.current.parentNode.removeChild(widgetRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      id="faqlue-widget-container"
      style={{
        // Set custom properties that inherit into shadow DOM
        ['--fq-color' as any]: '#FFFFFF',
        ['--fq-bg' as any]: 'rgba(255, 255, 255, 0.1)',
        ['--fq-border' as any]: 'rgba(255, 255, 255, 0.2)',
        ['--fq-text' as any]: '#FAFAFA',
        ['--fq-muted' as any]: '#FFFFFF',
        ['--fq-badge-bg' as any]: 'rgba(255, 255, 255, 0.15)',
        ['--fq-badge-text' as any]: '#FAFAFA',
        ['--fq-highlight' as any]: 'rgba(255, 255, 255, 0.2)',
        ['--fq-success' as any]: '#FFFFFF',
        ['--fq-error' as any]: '#FFFFFF',
      }}
      dangerouslySetInnerHTML={{ __html: fallbackHTML }}
    />
  )
}
