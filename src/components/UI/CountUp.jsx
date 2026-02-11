'use client'

import { useEffect, useState } from 'react'

export default function CountUp({ value, duration = 1200 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value.toString().replace(/\D/g, ''))
    if (start === end) return

    const incrementTime = Math.max(10, duration / end)
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <span>
      {value.toString().replace(/\d+/, count)}
    </span>
  )
}
