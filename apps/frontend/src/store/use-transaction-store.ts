import { create } from 'zustand'
import { TransactionAlert } from '@/types'

interface TransactionState {
  transactions: TransactionAlert[]
  isConnected: boolean
  addTransaction: (transaction: TransactionAlert) => void
  setConnected: (status: boolean) => void
  clearTransactions: () => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isConnected: false,
  addTransaction: (transaction) => set((state) => {
    // Keep max 500 transactions in memory to prevent frontend lag
    const newTransactions = [transaction, ...state.transactions]
    if (newTransactions.length > 500) {
      newTransactions.pop()
    }
    return { transactions: newTransactions }
  }),
  setConnected: (status) => set({ isConnected: status }),
  clearTransactions: () => set({ transactions: [] })
}))
