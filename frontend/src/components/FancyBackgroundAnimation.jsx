// AnimatedSection.jsx
import gsap from "gsap"
import { useEffect, useRef } from "react"

export default function FancyBackgroundAnimation() {
  const blob1 = useRef()
  const blob2 = useRef()

  useEffect(() => {
    gsap.to(blob1.current, {
      y: 30,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
    gsap.to(blob2.current, {
      y: -30,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
  }, [])

  return (
    <section className="absolute top-0 left-0 z-[-1] h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Background blobs */}
      <svg
        className="absolute w-[600px] h-[600px] opacity-20 -left-32 -top-32"
        ref={blob1}
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFC3" />
            <stop offset="100%" stopColor="#0077FF" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="250" fill="url(#grad1)" />
      </svg>

      <svg
        className="absolute w-[500px] h-[500px] opacity-15 -right-24 -bottom-24"
        ref={blob2}
      >
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8CE8" />
            <stop offset="100%" stopColor="#8A2EFF" />
          </linearGradient>
        </defs>
        <circle cx="250" cy="250" r="200" fill="url(#grad2)" />
      </svg>

      {/* Content */}
      <div className="z-10 text-center space-y-4">
        <h2 className="text-4xl font-bold">Welcome to Our Platform</h2>
        <p className="text-lg opacity-80">
          Smooth, elegant, and responsive design
        </p>
      </div>
    </section>
  )
}
