"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <label className="switch gap-2">
      <input 
        type="checkbox" 
        checked={theme === 'dark'}
        onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="sunmoon"/>
      <div className="clouds">
        <Image 
          src="/cloud_1.svg" 
          alt="cloud" 
          width={15} 
          height={15} 
          className="cloud cloud-1" 
        />
        <Image 
          src="/cloud_2.svg" 
          alt="cloud" 
          width={15} 
          height={15} 
          className="cloud cloud-2" 
        />
        <Image 
          src="/cloud_1.svg" 
          alt="cloud" 
          width={15} 
          height={15} 
          className="cloud cloud-3" 
        />
        <Image 
          src="/cloud_2.svg" 
          alt="cloud" 
          width={15} 
          height={15} 
          className="cloud cloud-4" 
        />
        <Image 
          src="/stars.svg" 
          alt="stars" 
          width={20} 
          height={20} 
          className="stars" 
        />
      </div>
    </label>
  )
}
