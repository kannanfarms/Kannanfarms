// src/hooks/useOrders.js
// ─── Real-time Firestore orders subscription ─────────────────────────────────
// Subscribes to /orders where userId == currentUser.uid
// Returns { orders, loading, error }
// Automatically unsubscribes when the component unmounts.

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

// Status ordering for display sorting
export const STATUS_ORDER = {
  'Pending':          0,
  'Processing':       1,
  'Shipped':          2,
  'Out for Delivery': 3,
  'Delivered':        4,
  'Cancelled':        5,
}

export const STATUS_COLORS = {
  'Pending':          { bg: 'bg-amber-light',    text: 'text-amber-dark',   dot: 'bg-amber'       },
  'Processing':       { bg: 'bg-blue-50',         text: 'text-blue-700',     dot: 'bg-blue-500'    },
  'Shipped':          { bg: 'bg-purple-50',       text: 'text-purple-700',   dot: 'bg-purple-500'  },
  'Out for Delivery': { bg: 'bg-green-light',     text: 'text-green-main',   dot: 'bg-green-vivid' },
  'Delivered':        { bg: 'bg-green-xlight',    text: 'text-green-dark',   dot: 'bg-green-dark'  },
  'Cancelled':        { bg: 'bg-red-50',          text: 'text-red-700',      dot: 'bg-red-500'     },
}

export default function useOrders() {
  const { user } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Normalise Firestore Timestamp → JS Date
          timestamp: doc.data().timestamp?.toDate?.() ?? new Date(),
        }))
        setOrders(docs)
        setLoading(false)
      },
      (err) => {
        console.error('[useOrders] Firestore error:', err)
        setError('Unable to load your orders right now.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  return { orders, loading, error }
}
