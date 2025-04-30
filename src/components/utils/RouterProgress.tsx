
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'

export const RouterProgress = () => {
    const [progress, setProgress] = useState(0)
    const [showProgress, setShowProgress] = useState(false)
    const location = useLocation()
  
    useEffect(() => {
      setShowProgress(true)
      setProgress(30) 
      
      const increment = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(increment)
            return 90
          }
          return prev + 10
        })
      }, 100)
  
      return () => clearInterval(increment)
    }, [location.pathname])
  
    useEffect(() => {
      if (progress >= 90) {
        const complete = setTimeout(() => {
          setProgress(100)
          setTimeout(() => setShowProgress(false), 200)
        }, 300)
        return () => clearTimeout(complete)
      }
    }, [progress])
  
    return (
      <div className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Progress value={progress} className="h-1 rounded-none bg-background" />
      </div>
    )
  }