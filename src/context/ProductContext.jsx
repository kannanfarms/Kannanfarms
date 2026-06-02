// src/context/ProductContext.jsx
// ─── Real-time Firestore product synchronization context ─────────────────────
// Wraps the application to provide dynamic, live-synced products across
// the Home Showcase, Product Details, Cart, and Admin Dashboard.
//
// Automatically seeds Firestore with signature products if empty.

import { createContext, useContext, useEffect, useState } from 'react'
import { collection, onSnapshot, doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'
import { PRODUCTS } from '../data/products'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen to Firestore products collection in real-time
  useEffect(() => {
    const productsRef = collection(db, 'products')

    const unsubscribe = onSnapshot(productsRef, async (snapshot) => {
      const list = []
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() })
      })

      // Auto-seeding: if Firestore is empty, populate it with existing catalog
      if (list.length === 0 && loading) {
        console.log('[ProductContext] Firestore empty. Bootstrapping seed products...')
        try {
          const batch = writeBatch(db)
          
          PRODUCTS.forEach((p) => {
            const docRef = doc(db, 'products', p.id)
            // Add a default stock level (e.g., 50) and hidden flag (false) to each size
            const enhancedSizes = p.sizes.map((s) => ({
              ...s,
              stock: 50 // Default stock for all seeded products
            }))

            const enhancedProduct = {
              ...p,
              sizes: enhancedSizes,
              hidden: false,
              createdAt: new Date().toISOString()
            }
            batch.set(docRef, enhancedProduct)
          })

          await batch.commit()
          console.log('[ProductContext] Auto-seeding completed successfully.')
        } catch (err) {
          console.error('[ProductContext] Error auto-seeding products:', err)
        }
      } else {
        // Sort products by creation date or name to maintain stable ordering
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        setProducts(list)
        setLoading(false)
      }
    }, (err) => {
      console.error('[ProductContext] Error listening to products:', err)
      setLoading(false)
    })

    return unsubscribe
  }, [loading])

  // ── Actions ────────────────────────────────────────────────────────────────

  // Atomically increment/decrement stock for a specific size in Firestore
  const updateStock = async (productId, sizeWeight, delta) => {
    try {
      const product = products.find((p) => p.id === productId)
      if (!product) return

      const updatedSizes = product.sizes.map((size) => {
        if (size.weight === sizeWeight) {
          const currentStock = size.stock !== undefined ? size.stock : 50
          return { ...size, stock: Math.max(0, currentStock + delta) }
        }
        return size
      })

      const productRef = doc(db, 'products', productId)
      await updateDoc(productRef, {
        sizes: updatedSizes,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('[ProductContext] Error updating stock:', err)
      throw err
    }
  };

  // Add a new product to Firestore
  const addProduct = async (productData) => {
    try {
      const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const id = slug
      
      const newProduct = {
        id,
        slug,
        ...productData,
        hidden: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = doc(db, 'products', id)
      await setDoc(docRef, newProduct)
      console.log(`[ProductContext] Product ${productData.name} added successfully.`)
    } catch (err) {
      console.error('[ProductContext] Error adding product:', err)
      throw err
    }
  }

  // Update product fields in Firestore
  const updateProduct = async (productId, productData) => {
    try {
      const productRef = doc(db, 'products', productId)
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString()
      })
      console.log(`[ProductContext] Product ${productId} updated successfully.`)
    } catch (err) {
      console.error('[ProductContext] Error updating product:', err)
      throw err
    }
  }

  // Toggle visible/hidden status of product
  const toggleProductVisibility = async (productId, isHidden) => {
    try {
      const productRef = doc(db, 'products', productId)
      await updateDoc(productRef, {
        hidden: isHidden,
        updatedAt: new Date().toISOString()
      })
      console.log(`[ProductContext] Visibility toggled for ${productId}: hidden = ${isHidden}`)
    } catch (err) {
      console.error('[ProductContext] Error toggling product visibility:', err)
      throw err
    }
  }

  const value = {
    products,
    loading,
    updateStock,
    addProduct,
    updateProduct,
    toggleProductVisibility
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) {
    throw new Error('useProducts must be used inside <ProductProvider>')
  }
  return ctx
}
