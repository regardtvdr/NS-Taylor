// Sound effects utility
// In production, these would be actual audio files
// For now, we'll use Web Audio API to generate simple sounds

export const playSound = (type: 'success' | 'error' | 'notification' | 'click' | 'confetti') => {
  if (typeof window === 'undefined') return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    let frequency = 440
    let duration = 0.1

    switch (type) {
      case 'success':
        frequency = 523.25 // C5
        duration = 0.2
        break
      case 'error':
        frequency = 220 // A3
        duration = 0.15
        break
      case 'notification':
        frequency = 659.25 // E5
        duration = 0.15
        break
      case 'click':
        frequency = 800
        duration = 0.05
        break
      case 'confetti':
        frequency = 523.25
        duration = 0.3
        break
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type === 'confetti' ? 'sine' : 'square'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio not available')
  }
}

