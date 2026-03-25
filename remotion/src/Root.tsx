import React from 'react'
import { Composition } from 'remotion'
import { NukorDemo } from './NukorDemo'

// 3 niches × 220 frames + 60 intro frames = 720 frames at 30fps = 24 seconds
const TOTAL_FRAMES = 60 + 3 * 220

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NukorDemo"
      component={NukorDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1280}
      height={720}
    />
  )
}
