// scripts/seedOrders.js
// ─── Dev-only: seed sample orders for a given user ───────────────────────────
// Usage:  FIREBASE_USER_ID=<your_uid> node scripts/seedOrders.js
//
// Requires: npm install -g firebase-admin  (or local install)
// Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const userId = process.env.FIREBASE_USER_ID
if (!userId) {
  console.error('Error: set FIREBASE_USER_ID env var to your Firebase UID')
  process.exit(1)
}

initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS) })
const db = getFirestore()

const SAMPLE_ORDERS = [
  {
    userId,
    orderId:           'KF-2024-001',
    timestamp:         Timestamp.fromDate(new Date('2024-05-28T10:30:00')),
    status:            'Delivered',
    trackingId:        'BD1234567890IN',
    courier:           'Blue Dart',
    estimatedDelivery: 'Delivered on 31 May 2024',
    total:             549,
    address:           '42, Gandhi Street, Tiruppur, Tamil Nadu 641601',
    items: [
      { name: 'Banana Powder (500g)',  qty: 2, price: 249 },
      { name: 'Moringa Powder (250g)', qty: 1, price: 299 },
    ],
  },
  {
    userId,
    orderId:           'KF-2024-002',
    timestamp:         Timestamp.fromDate(new Date('2024-06-01T14:15:00')),
    status:            'Out for Delivery',
    trackingId:        'DTWB9876543210',
    courier:           'DTDC',
    estimatedDelivery: 'Today by 8 PM',
    total:             299,
    address:           '42, Gandhi Street, Tiruppur, Tamil Nadu 641601',
    items: [
      { name: 'Moringa Powder (500g)', qty: 1, price: 299 },
    ],
  },
  {
    userId,
    orderId:           'KF-2024-003',
    timestamp:         Timestamp.fromDate(new Date('2024-06-02T09:00:00')),
    status:            'Pending',
    trackingId:        null,
    courier:           null,
    estimatedDelivery: '4–6 business days',
    total:             748,
    address:           '42, Gandhi Street, Tiruppur, Tamil Nadu 641601',
    items: [
      { name: 'Banana Powder (1kg)',   qty: 1, price: 449 },
      { name: 'Moringa Powder (250g)', qty: 1, price: 299 },
    ],
  },
]

async function seed() {
  const batch = db.batch()
  SAMPLE_ORDERS.forEach((order) => {
    const ref = db.collection('orders').doc()
    batch.set(ref, order)
  })
  await batch.commit()
  console.log(`✅ Seeded ${SAMPLE_ORDERS.length} orders for user ${userId}`)
}

seed().catch(console.error)
