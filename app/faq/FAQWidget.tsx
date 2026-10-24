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
      
      // Remove any remaining widgets (in case unmount happens before poll finds it)
      container.querySelectorAll('#faqlue-widget').forEach(node => node.remove())
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      id="faqlue-widget-container"
      dangerouslySetInnerHTML={{ __html: fallbackHTML }}
    />
  )
}
