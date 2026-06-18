export const characterPresets = {
  'Calm': { rate: 0.7, pitch: 0.85, icon: '😌', desc: 'Slow and relaxed' },
  'Polite': { rate: 1.0, pitch: 1.2, icon: '🙂', desc: 'Warm and friendly' },
  'Serious': { rate: 1.05, pitch: 0.6, icon: '🧐', desc: 'Firm and steady' },
  'Energetic': { rate: 1.4, pitch: 1.4, icon: '⚡', desc: 'Fast and upbeat' },
}

export const getVoiceSettings = () => {
  return {
    voiceName: localStorage.getItem('voiceName') || '',
    character: localStorage.getItem('voiceCharacter') || 'Polite',
  }
}

export const speakWithSettings = (text, langOverride = null) => {
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)

  const { voiceName, character } = getVoiceSettings()
  const preset = characterPresets[character] || characterPresets['Polite']

  utterance.rate = preset.rate
  utterance.pitch = preset.pitch

  if (langOverride) {
    utterance.lang = langOverride
  }

  if (voiceName) {
    const voices = window.speechSynthesis.getVoices()
    const selected = voices.find(v => v.name === voiceName)
    if (selected) {
      utterance.voice = selected
      if (!langOverride) utterance.lang = selected.lang
    }
  }

  window.speechSynthesis.speak(utterance)
}