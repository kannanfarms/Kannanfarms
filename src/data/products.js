// Centralized product data — single source of truth for all pages & SEO
export const PRODUCTS = [
  {
    id: 'banana-powder',
    slug: 'banana-powder',
    name: 'Banana Powder',
    shortName: 'Banana',
    badge: 'Best Seller',
    tagline: 'Nature\'s perfect weight-gain superfood',
    description:
      'Crafted from sun-ripened Nendran bananas grown on our own farm, our Banana Powder is cold-stone-ground to preserve every enzyme, vitamin, and mineral. Ideal for growing children, gym enthusiasts, and anyone seeking clean, natural energy without artificial additives.',
    seo: {
      title: 'Banana Powder — Natural Weight Gain & Energy | Kannan Farms',
      description:
        'Buy premium Nendran Banana Powder online from Kannan Farms. 100% natural, no additives, sun-dried & stone-ground. Perfect for children, athletes & daily wellness. Farm-direct from Tamil Nadu.',
      keywords: 'banana powder, nendran banana powder, natural banana powder, weight gain supplement, kids nutrition, farm fresh powder, Kannan Farms',
      ogTitle: 'Pure Nendran Banana Powder | Kannan Farms — Farm Direct',
      ogDescription: 'Farm-fresh Nendran Banana Powder — stone-ground, additive-free, direct from our Tamil Nadu farm.',
    },
    images: [
      '/assets/Banana 1.png',
      '/assets/Banana 2.png',
      '/assets/Banana 3.png',
      '/assets/Banana 4.png',
    ],
    heroImage: '/assets/Banana 1.png',
    tags: ['Weight Gain', 'Kids Friendly', 'High Energy', 'Gluten Free'],
    highlights: [
      'Made from 100% Nendran variety — richest in carbs & potassium',
      'No preservatives, artificial colors, or flavors',
      'Cold stone-ground to retain full nutritional profile',
      'Sun-dried for maximum nutrient preservation',
      'Ideal for children\'s milk, smoothies & health shakes',
      'Airtight packed within hours of grinding',
    ],
    benefits: [
      { icon: '⚡', title: 'Natural Energy Boost', desc: 'Rich in complex carbohydrates for sustained energy throughout the day.' },
      { icon: '🦴', title: 'Bone Strength', desc: 'High calcium and magnesium content supports strong bones and teeth.' },
      { icon: '💪', title: 'Muscle Recovery', desc: 'Potassium and B6 aid faster muscle recovery post-exercise.' },
      { icon: '🌱', title: 'Digestive Health', desc: 'Natural dietary fibre promotes healthy gut function.' },
      { icon: '👶', title: 'Kids Nutrition', desc: 'Gentle on young digestive systems, ideal as first solid food supplement.' },
      { icon: '🧠', title: 'Cognitive Support', desc: 'Vitamin B6 supports brain health and mental clarity.' },
    ],
    usage: 'Mix 2–3 tablespoons (20–30g) in warm milk, smoothies, or porridge. Best consumed in the morning or after workouts. Can be used in baking, pancakes, and energy balls.',
    sizes: [
      { weight: '250g', price: '₹199' },
      { weight: '500g', price: '₹349' },
      { weight: '1kg',  price: '₹599' },
    ],
    category: 'superfood-powders',
    relatedProducts: ['moringa-powder'],
  },
  {
    id: 'moringa-powder',
    slug: 'moringa-powder',
    name: 'Moringa Powder',
    shortName: 'Moringa',
    badge: 'Fan Favourite',
    tagline: 'The ancient tree of life — now in your daily ritual',
    description:
      'Our Moringa Powder is harvested from mature drumstick trees on our chemical-free farm, shade-dried to protect heat-sensitive nutrients, and stone-ground into a fine, vivid green powder. One of the world\'s most nutrient-dense superfoods, packed with complete proteins, iron, calcium, and antioxidants.',
    seo: {
      title: 'Moringa Powder — Superfood Packed with Vitamins | Kannan Farms',
      description:
        'Buy pure organic Moringa Powder from Kannan Farms. Rich in iron, calcium, Vitamin C & antioxidants. 100% natural, shade-dried & stone-ground. Farm-direct delivery across India.',
      keywords: 'moringa powder, drumstick powder, moringa oleifera, organic moringa, superfood powder, iron rich supplement, antioxidant powder, Kannan Farms',
      ogTitle: 'Pure Moringa Powder | Kannan Farms — The Tree of Life',
      ogDescription: 'Shade-dried, stone-ground Moringa Powder — packed with 92 nutrients. Additive-free, farm-direct.',
    },
    images: [
      '/assets/Moringa 1.png',
      '/assets/Moringa 2.png',
      '/assets/Moringa 3.png',
      '/assets/Moinga 4.png',
    ],
    heroImage: '/assets/Moringa 1.png',
    tags: ['Antioxidants', 'Vitamins', 'Daily Health', 'Iron Rich'],
    highlights: [
      'Contains 92 nutrients, 46 antioxidants & 36 anti-inflammatory compounds',
      'Shade-dried to preserve heat-sensitive vitamins',
      'No pesticides — grown on chemical-free farm',
      'Complete plant protein with all essential amino acids',
      '7× more vitamin C than oranges, 4× more calcium than milk',
      'Tested for heavy metals and microbial safety',
    ],
    benefits: [
      { icon: '🛡️', title: 'Immune Booster', desc: '7× more Vitamin C than oranges — a powerful daily immune shield.' },
      { icon: '🩸', title: 'Iron Rich', desc: 'Superior plant-based iron source ideal for anaemia management.' },
      { icon: '✨', title: 'Skin & Hair', desc: 'Antioxidants fight free radicals for radiant skin and strong hair.' },
      { icon: '⚖️', title: 'Blood Sugar', desc: 'Isothiocyanates help regulate blood glucose levels naturally.' },
      { icon: '🧬', title: 'Complete Protein', desc: 'All 9 essential amino acids — rare in the plant kingdom.' },
      { icon: '🔥', title: 'Anti-Inflammatory', desc: '46 antioxidants reduce chronic inflammation systemically.' },
    ],
    usage: 'Add 1 teaspoon (5g) to smoothies, juices, warm water, soups, or dal. Start with ½ teaspoon and build up. Best consumed in the morning on an empty stomach for maximum absorption. Avoid cooking at high temperatures.',
    sizes: [
      { weight: '100g', price: '₹149' },
      { weight: '250g', price: '₹299' },
      { weight: '500g', price: '₹529' },
    ],
    category: 'superfood-powders',
    relatedProducts: ['banana-powder'],
  },
]

export const getProductBySlug = (slug) =>
  PRODUCTS.find((p) => p.slug === slug) || null

export const getRelatedProducts = (product) =>
  product.relatedProducts
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean)
