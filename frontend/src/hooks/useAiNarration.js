import { useEffect, useRef, useState, useCallback } from 'react'
import { buildNarrationSegments } from '../utils/narrationSegments'

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

export function useAiNarration({ problem, language, isGenerating, visible, voice = 'alloy' }) {
  const [currentLineRanges, setCurrentLineRanges] = useState([])
  const [currentBlockIndex, setCurrentBlockIndex] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef(null)
  const segmentsRef = useRef([])
  const blobCacheRef = useRef(new Map())
  const currentIndexRef = useRef(-1)
  const stoppedRef = useRef(true)
  const sessionRef = useRef(0)
  const isMutedRef = useRef(false)
  const playSegmentAtRef = useRef(() => {})

  useEffect(() => {
    isMutedRef.current = isMuted
    if (audioRef.current) audioRef.current.muted = isMuted
  }, [isMuted])

  // Create the single reusable Audio element once.
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    audio.muted = isMutedRef.current

    audio.onended = () => {
      playSegmentAtRef.current(currentIndexRef.current + 1)
    }
    audio.onerror = (e) => {
      console.warn('Narration audio error', e)
      playSegmentAtRef.current(currentIndexRef.current + 1)
    }

    return () => {
      audio.pause()
      audio.onplay = null
      audio.onended = null
      audio.onerror = null
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSegmentAudio = useCallback(
    (problemId, lang, segment) => {
      const cacheKeyStr = `${problemId}:${lang}:${voice}:${segment.blockIndex}`
      const cache = blobCacheRef.current
      if (cache.has(cacheKeyStr)) return cache.get(cacheKeyStr)

      const promise = fetch(`${API_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: segment.text, voice }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`TTS request failed: ${res.status}`)
          return res.blob()
        })
        .then((blob) => URL.createObjectURL(blob))
        .catch((err) => {
          console.warn('Narration fetch failed for segment', segment.blockIndex, err)
          return null
        })

      cache.set(cacheKeyStr, promise)
      return promise
    },
    [voice]
  )

  const playSegmentAt = useCallback(
    async (i) => {
      if (stoppedRef.current) return
      const session = sessionRef.current
      const segments = segmentsRef.current
      const audio = audioRef.current

      if (!audio || i >= segments.length) {
        currentIndexRef.current = -1
        setIsSpeaking(false)
        setCurrentBlockIndex(null)
        setCurrentLineRanges([])
        return
      }

      const segment = segments[i]
      currentIndexRef.current = i
      setCurrentBlockIndex(segment.blockIndex)
      setCurrentLineRanges(segment.ranges)

      const url = await fetchSegmentAudio(problem?.id, language, segment)

      if (stoppedRef.current || session !== sessionRef.current) return

      if (!url) {
        playSegmentAtRef.current(i + 1)
        return
      }

      audio.src = url
      audio.muted = isMutedRef.current
      audio.play().catch((err) => {
        console.warn('Narration playback failed', err)
        if (!stoppedRef.current && session === sessionRef.current) {
          playSegmentAtRef.current(i + 1)
        }
      })
    },
    [fetchSegmentAudio, problem?.id, language]
  )

  useEffect(() => {
    playSegmentAtRef.current = playSegmentAt
  }, [playSegmentAt])

  const stop = useCallback(() => {
    stoppedRef.current = true
    currentIndexRef.current = -1
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsSpeaking(false)
    setCurrentBlockIndex(null)
    setCurrentLineRanges([])
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m)
  }, [])

  // Prefetch every segment's audio as soon as generation starts, so
  // playback has zero perceptible latency once the panel becomes visible.
  useEffect(() => {
    if (!isGenerating) return
    const segments = buildNarrationSegments(problem, language)
    segmentsRef.current = segments
    segments.forEach((segment) => fetchSegmentAudio(problem?.id, language, segment))
  }, [isGenerating, problem, language, fetchSegmentAudio])

  // Start playback once the explanation becomes visible. isSpeaking is set
  // true immediately (not on the audio's 'play' event) so the UI hides the
  // explanation text for the whole narration session, not just once actual
  // audio playback begins after the fetch/decode latency of the first segment.
  useEffect(() => {
    if (!visible) return
    stoppedRef.current = false
    const segments = buildNarrationSegments(problem, language)
    segmentsRef.current = segments
    if (segments.length > 0) {
      setIsSpeaking(true)
    }
    playSegmentAt(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Reset narration whenever the problem or language changes.
  useEffect(() => {
    sessionRef.current += 1
    stoppedRef.current = true
    currentIndexRef.current = -1
    if (audioRef.current) audioRef.current.pause()
    for (const promise of blobCacheRef.current.values()) {
      promise.then((url) => url && URL.revokeObjectURL(url))
    }
    blobCacheRef.current = new Map()
    segmentsRef.current = []
    setIsSpeaking(false)
    setCurrentBlockIndex(null)
    setCurrentLineRanges([])
  }, [problem?.id, language])

  return { currentLineRanges, currentBlockIndex, isSpeaking, isMuted, toggleMute, stop }
}
