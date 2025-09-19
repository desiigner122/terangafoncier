// Thème de couleurs harmonisé Teranga Foncier
// Palette blockchain-inspired avec couleurs du Sénégal

export const terangaTheme = {
  // Couleurs principales blockchain
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Bleu principal
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },

  // Couleurs secondaires (Violet/Purple)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff', 
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Violet principal
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  },

  // Couleurs accent (Teal/Vert émeraude)
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Teal principal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a'
  },

  // Couleurs du drapeau sénégalais adaptées
  senegal: {
    green: '#00a651',    // Vert du drapeau
    yellow: '#ffd100',   // Jaune du drapeau  
    red: '#e31e24',      // Rouge du drapeau
    gold: '#fbbf24',     // Or/Doré
    earth: '#8b5a3c'     // Terre/Brun
  },

  // Couleurs système
  success: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669'
  },

  warning: {
    50: '#fffbeb', 
    500: '#f59e0b',
    600: '#d97706'
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444', 
    600: '#dc2626'
  },

  // Couleurs neutres
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },

  // Gradients prédéfinis
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #14b8a6 100%)',
    blockchain: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #0f766e 100%)',
    senegal: 'linear-gradient(135deg, #00a651 0%, #ffd100 50%, #e31e24 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #e31e24 50%, #7c3aed 100%)',
    ocean: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 50%, #059669 100%)',
    royal: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)'
  },

  // Ombres personnalisées
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    blockchain: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
    glow: '0 0 20px rgba(168, 85, 247, 0.4)'
  },

  // Animations
  animations: {
    spin: 'spin 1s linear infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    blockchain: 'blockchain-glow 3s ease-in-out infinite alternate'
  },

  // Espacements
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
  },

  // Typographie
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    }
  },

  // Bordures et rayons
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
    max: 9999
  }
};

// Classes CSS utilitaires pour Tailwind
export const terangaClasses = {
  // Boutons
  buttonPrimary: 'bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 hover:from-blue-600 hover:via-purple-600 hover:to-teal-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl',
  
  buttonSecondary: 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold transition-all duration-300',
  
  buttonBlockchain: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 hover:from-indigo-700 hover:via-purple-700 hover:to-teal-700 text-white font-bold transition-all duration-300 shadow-blockchain',

  // Cards
  cardDefault: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100',
  
  cardBlockchain: 'bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-blockchain transition-all duration-300 border border-blue-100',
  
  cardPremium: 'bg-gradient-to-br from-purple-50 via-white to-teal-50 rounded-xl shadow-xl border border-purple-100 hover:border-purple-300 transition-all duration-300',

  // Textes
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600', 
  textMuted: 'text-gray-500',
  textBlockchain: 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent font-bold',
  
  // Backgrounds
  bgPrimary: 'bg-white',
  bgSecondary: 'bg-gray-50',
  bgBlockchain: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  bgHero: 'bg-gradient-to-r from-blue-600 via-purple-600 to-green-600',
  
  // Overlays
  overlayDark: 'bg-black bg-opacity-50',
  overlayLight: 'bg-white bg-opacity-90',
  overlayBlockchain: 'bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-teal-900/20',

  // Animations
  animateSlideUp: 'transform transition-all duration-500 ease-out translate-y-0 opacity-100',
  animateSlideDown: 'transform transition-all duration-500 ease-out translate-y-4 opacity-0',
  animateFloat: 'animate-bounce',
  animateGlow: 'animate-pulse',

  // États interactifs
  hoverScale: 'hover:scale-105 transition-transform duration-300',
  hoverGlow: 'hover:shadow-glow transition-shadow duration-300',
  activeScale: 'active:scale-95',
  
  // Responsive
  containerResponsive: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Formulaires
  inputDefault: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
  inputBlockchain: 'w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors'
};

// Fonction helper pour générer des classes dynamiques
export const generateTerangaClass = (type, variant = 'default', size = 'md') => {
  const baseClasses = {
    button: {
      default: 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      primary: terangaClasses.buttonPrimary,
      secondary: terangaClasses.buttonSecondary,
      blockchain: terangaClasses.buttonBlockchain
    },
    card: {
      default: terangaClasses.cardDefault,
      blockchain: terangaClasses.cardBlockchain,
      premium: terangaClasses.cardPremium
    }
  };

  const sizeClasses = {
    button: {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg', 
      lg: 'px-6 py-3 text-lg rounded-xl',
      xl: 'px-8 py-4 text-xl rounded-2xl'
    },
    card: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    }
  };

  return `${baseClasses[type]?.[variant] || baseClasses[type]?.default || ''} ${sizeClasses[type]?.[size] || ''}`.trim();
};

export default terangaTheme;
