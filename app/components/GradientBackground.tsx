'use client'

import { Component, type ReactNode } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

// WebGL is unavailable on some machines (hardware acceleration off, blocklisted
// GPU drivers, remote desktop, VMs). three.js then throws on context creation,
// and without a boundary React unmounts the entire page. Swallow it here so only
// the decorative gradient disappears; the body's orange background remains.
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function GradientBackground() {
  return (
    <div className="gradient-container">
      <WebGLBoundary>
      <ShaderGradientCanvas className="gradient-canvas">
      <ShaderGradient
        {...({
          animate: "on",
          axesHelper: "on",
          bgColor1: "#000000",
          bgColor2: "#000000",
          brightness: 1.2,
          cAzimuthAngle: 180,
          cDistance: 2.4,
          cPolarAngle: 95,
          cameraZoom: 1,
          color1: "#ff6a1a",
          color2: "#c73c00",
          color3: "#FD4912",
          destination: "onCanvas",
          embedMode: "off",
          envPreset: "city",
          format: "gif",
          fov: 45,
          frameRate: 10,
          gizmoHelper: "hide",
          grain: "off",
          lightType: "3d",
          pixelDensity: 1,
          positionX: 0,
          positionY: -2.1,
          positionZ: 0,
          range: "disabled",
          rangeEnd: 40,
          rangeStart: 0,
          reflection: 0.1,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 225,
          shader: "defaults",
          type: "waterPlane",
          uAmplitude: 0,
          uDensity: 1.8,
          uFrequency: 5.5,
          uSpeed: 0.2,
          uStrength: 3,
          uTime: 0.2,
          wireframe: false,
        } as any)}
      />
      </ShaderGradientCanvas>
      </WebGLBoundary>
    </div>
  )
}
