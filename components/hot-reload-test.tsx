"use client"

import { useState } from 'react'

export function HotReloadTest() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="fixed bottom-4 right-4 bg-teal-600 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="text-sm font-bold mb-2">Hot Reload Test</h3>
      <p className="text-xs mb-2">Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-white text-teal-600 px-2 py-1 rounded text-xs font-medium"
      >
        Test Click
      </button>
      <p className="text-xs mt-2 opacity-75">✅ Hot reload working!</p>
    </div>
  )
}
