// hooks/useInstruments.ts
'use client'

import { useState, useEffect } from 'react'
import { Instrument } from '@/app/[locale]/register/types'

export function useInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInstruments()
  }, [])

  const fetchInstruments = async () => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/instruments')
      // const data = await response.json()
      // setInstruments(data)

      // Mock data for now
      const mockInstruments: Instrument[] = [
        { id: '1', name: 'Guitare', category: 'string' },
        { id: '2', name: 'Piano', category: 'keyboard' },
        { id: '3', name: 'Batterie', category: 'percussion' },
        { id: '4', name: 'Basse', category: 'string' },
        { id: '5', name: 'Violon', category: 'string' },
        { id: '6', name: 'Flûte', category: 'wind' },
        { id: '7', name: 'Saxophone', category: 'wind' },
        { id: '8', name: 'Chant', category: 'vocal' }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setInstruments(mockInstruments)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des instruments')
    } finally {
      setLoading(false)
    }
  }

  return {
    instruments,
    loading,
    error,
    refetch: fetchInstruments
  }
}