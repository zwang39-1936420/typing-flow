"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function TypingTest() {
  const [time, setTime] = useState(120) // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showIcons, setShowIcons] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
    }

    return () => clearInterval(interval)
  }, [isActive, time])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [typedText])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive && e.target.value.length > 0) {
      handleStart()
    }
    setTypedText(e.target.value)
    // Calculate word count
    const words = e.target.value.trim().split(/\s+/)
    setWordCount(e.target.value.trim() === "" ? 0 : words.length)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(typedText)
  }

  const handleMouseMove = () => {
    setShowIcons(true)
    if (inactivityTimer) clearTimeout(inactivityTimer)
    setInactivityTimer(setTimeout(() => setShowIcons(false), 5000))
  }

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-[#FFE5D9] to-[#E8FAE6] flex flex-col"
      onMouseMove={handleMouseMove}
      onClick={() => textareaRef.current?.focus()}
    >
      <div className={`p-4 transition-opacity duration-300 ${showIcons ? "opacity-100" : "opacity-0"}`}>
        <Button variant="ghost" size="icon" className="hover:bg-transparent" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="w-2/5 h-48 absolute bottom-[40vh] px-4 flex items-end">
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={handleTyping}
            className="w-full max-h-48 text-gray-700 bg-transparent text-xl sm:text-2xl border-none focus:outline-none text-center font-serif resize-none overflow-hidden
              selection:bg-gray-800 selection:text-[#FFE5D9]"
            spellCheck={false}
            autoComplete="off"
            style={{
              caretColor: "black",
              maskImage: "linear-gradient(to top, black 10%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <div className={`p-4 text-right transition-opacity duration-300`}>
        <div className="flex justify-between items-center">
          <span className="text-xl text-gray-700 font-serif">{wordCount}</span>
          <span className="text-xl text-gray-700 font-serif">{formatTime(time)}</span>
        </div>
      </div>

      <audio ref={audioRef} src="/notification.wav" />
    </div>
  )
}

