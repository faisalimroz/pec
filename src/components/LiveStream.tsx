import React, { useRef, useEffect } from 'react'

interface LiveStreamProps {
  streamUrl: string
}

const LiveStream: React.FC<LiveStreamProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = streamUrl
    }
  }, [streamUrl])

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <video ref={videoRef} className='w-full' autoPlay>
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default LiveStream
