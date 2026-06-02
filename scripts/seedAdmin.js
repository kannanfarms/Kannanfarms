// scripts/seedAdmin.js
// ─── Utility script to seed an admin email in Firestore ─────────────────────
// Usage: GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json node scripts/seedAdmin.js <email>
//
// Requires: npm install firebase-admin (if not already installed)

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const emailArg = process.argv[2]
if (!emailArg || !emailArg.includes('@')) {
  console.error('❌ Error: Please provide a valid email address as an argument.')
  console.error('Usage: node scripts/seedAdmin.js user@example.com')
  process.exit(1)
}

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!serviceAccountPath) {
  console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.')
  console.error('Please export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"')
  process.exit(1)
}

// Initialise Firebase Admin
initializeApp({
  credential: cert(serviceAccountPath)
})

const db = getFirestore()

async function seedAdmin() {
  const email = emailArg.trim().toLowerCase()
  console.log(`⏳ Seeding admin email: ${email}...`)

  const adminRef = db.collection('admins').doc(email)
  
  await adminRef.set({
    email: email,
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, { merge: true })

  console.log(`✅ Success! ${email} is now registered as an administrator in Firestore.`)
}

seedAdmin().catch((err) => {
  console.error('❌ Seeding failed with error:', err)
  process.exit(1)
})
