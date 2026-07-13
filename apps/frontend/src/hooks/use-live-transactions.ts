"use client"

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useTransactionStore } from '@/store/use-transaction-store'
import { TransactionAlert } from '@/types'

const STREAM_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/transactions/stream`

export function useLiveTransactions() {
  const { addTransaction, setConnected, isConnected } = useTransactionStore()
  const eventSourceRef = useRef<EventSource | null>(null)
  const isConnectingRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isConnectingRef.current) return

    isConnectingRef.current = true
    
    const source = new EventSource(STREAM_URL)
    eventSourceRef.current = source

    source.onopen = () => {
      setConnected(true)
      isConnectingRef.current = false
      toast.success('System Status: Connected', {
        description: 'Receiving live transactions stream.'
      })
    }

    source.addEventListener('new_transaction', (event) => {
      try {
        const data = JSON.parse(event.data) as TransactionAlert
        addTransaction(data)
      } catch (err) {
        // Silently catch parse errors in production
      }
    })

    source.onerror = (err) => {
      source.close()
      setConnected(false)
      isConnectingRef.current = false
      
      // We don't want to toast error continually if backend is down, 
      // but maybe a single error if we were previously connected.
      toast.error('System Status: Disconnected', {
        description: 'Failed to connect to ML streaming engine.'
      })
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        setConnected(false)
        isConnectingRef.current = false
      }
    }
  }, []) // Empty dependency array so it only mounts/unmounts once per component lifecycle
}
