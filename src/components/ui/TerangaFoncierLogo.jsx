import React from 'react'

const TerangaFoncierLogo = ({ className = "h-14 w-auto", ...props }) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background - transparent */}
      
      {/* Soil/Ground base */}
      <path 
        d="M50 350 Q200 320 350 350 L350 390 L50 390 Z" 
        fill="#8B4513" 
      />
      
      {/* Baobab trunk */}
      <path 
        d="M185 350 Q190 280 195 250 Q200 220 205 200 Q210 250 215 280 Q220 320 225 350" 
        fill="#8B4513" 
        stroke="#654321" 
        strokeWidth="2"
      />
      
      {/* Baobab main branches */}
      <path 
        d="M195 220 Q170 200 150 190 Q140 185 135 180"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <path 
        d="M205 220 Q230 200 250 190 Q260 185 265 180"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <path 
        d="M200 200 Q180 180 160 170"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <path 
        d="M200 200 Q220 180 240 170"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      
      {/* Baobab foliage/crown - orange autumn colors */}
      <circle cx="145" cy="175" r="35" fill="#FF8C00" opacity="0.9" />
      <circle cx="175" cy="165" r="40" fill="#FFA500" opacity="0.8" />
      <circle cx="225" cy="165" r="40" fill="#FFA500" opacity="0.8" />
      <circle cx="255" cy="175" r="35" fill="#FF8C00" opacity="0.9" />
      <circle cx="200" cy="150" r="45" fill="#FFB84D" opacity="0.7" />
      
      {/* Buildings - modern blue gradient */}
      <defs>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      
      {/* Building 1 */}
      <rect x="280" y="220" width="40" height="130" fill="url(#buildingGradient)" />
      <rect x="285" y="230" width="8" height="8" fill="#E5E7EB" />
      <rect x="297" y="230" width="8" height="8" fill="#E5E7EB" />
      <rect x="309" y="230" width="8" height="8" fill="#E5E7EB" />
      <rect x="285" y="250" width="8" height="8" fill="#E5E7EB" />
      <rect x="297" y="250" width="8" height="8" fill="#E5E7EB" />
      <rect x="309" y="250" width="8" height="8" fill="#E5E7EB" />
      
      {/* Building 2 */}
      <rect x="325" y="200" width="35" height="150" fill="url(#buildingGradient)" />
      <rect x="330" y="210" width="6" height="6" fill="#E5E7EB" />
      <rect x="340" y="210" width="6" height="6" fill="#E5E7EB" />
      <rect x="350" y="210" width="6" height="6" fill="#E5E7EB" />
      <rect x="330" y="225" width="6" height="6" fill="#E5E7EB" />
      <rect x="340" y="225" width="6" height="6" fill="#E5E7EB" />
      <rect x="350" y="225" width="6" height="6" fill="#E5E7EB" />
      
      {/* Building 3 */}
      <rect x="245" y="250" width="30" height="100" fill="url(#buildingGradient)" />
      <rect x="250" y="260" width="5" height="5" fill="#E5E7EB" />
      <rect x="260" y="260" width="5" height="5" fill="#E5E7EB" />
      <rect x="250" y="275" width="5" height="5" fill="#E5E7EB" />
      <rect x="260" y="275" width="5" height="5" fill="#E5E7EB" />
      
      {/* Land parcels/plots around the base */}
      <path 
        d="M70 320 L120 325 L125 340 L75 335 Z" 
        fill="#DEB887" 
        stroke="#D2B48C" 
        strokeWidth="1"
      />
      <path 
        d="M275 325 L320 320 L325 335 L280 340 Z" 
        fill="#DEB887" 
        stroke="#D2B48C" 
        strokeWidth="1"
      />
      
      {/* Baobab roots visible */}
      <path 
        d="M185 350 Q170 360 160 365"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M225 350 Q240 360 250 365"
        fill="none" 
        stroke="#8B4513" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
    </svg>
  )
}

export default TerangaFoncierLogo
