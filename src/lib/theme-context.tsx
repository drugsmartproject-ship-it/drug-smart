import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeId =
  | 'emerald'
  | 'ocean'
  | 'royal'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'slate'
  | 'coral'
  | 'teal'
  | 'indigo'
  | 'aurora'
  | 'crimson'
  | 'mango'
  | 'midnight'
  | 'sakura'
  | 'jade'
  | 'electric'
  | 'sunset'
  | 'emeraldGold'
  | 'neonMint'
  | 'deepOcean'
  | 'lavender'
  | 'terracotta'
  | 'arctic'

export interface ColorTheme {
  id: ThemeId
  name: string
  description: string
  emoji: string
  primary: string
  primaryDark: string
  accent: string
  accentDark: string
  secondary: string
  border: string
  ring: string
  gradient: string // gradient for card/button
  gradientAlt: string // from a different angle
}

export const COLOR_THEMES: ColorTheme[] = [
  // ── Classic Medical ──────────────────────────────────
  {
    id: 'emerald',
    name: 'Emerald Forest',
    description: 'Classic medical green — clean & trustworthy',
    emoji: '🌿',
    primary: '#16a34a',
    primaryDark: '#15803d',
    accent: '#0d9488',
    accentDark: '#0f766e',
    secondary: '#dcfce7',
    border: '#bbf7d0',
    ring: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)',
    gradientAlt: 'linear-gradient(160deg, #22c55e 0%, #14b8a6 100%)',
  },
  {
    id: 'jade',
    name: 'Deep Jade',
    description: 'Deep forest jade — earthy & precise',
    emoji: '🪨',
    primary: '#166534',
    primaryDark: '#14532d',
    accent: '#15803d',
    accentDark: '#166534',
    secondary: '#dcfce7',
    border: '#86efac',
    ring: '#166534',
    gradient: 'linear-gradient(135deg, #166534 0%, #15803d 100%)',
    gradientAlt: 'linear-gradient(160deg, #15803d 0%, #0f766e 100%)',
  },
  {
    id: 'emeraldGold',
    name: 'Emerald & Gold',
    description: 'Sophisticated green-to-gold — premium feel',
    emoji: '✨',
    primary: '#15803d',
    primaryDark: '#166534',
    accent: '#ca8a04',
    accentDark: '#a16207',
    secondary: '#fefce8',
    border: '#fef08a',
    ring: '#15803d',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #d97706 100%)',
    gradientAlt:
      'linear-gradient(160deg, #22c55e 0%, #f59e0b 50%, #eab308 100%)',
  },
  // ── Blues & Oceans ───────────────────────────────────
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Deep ocean blue — calm & professional',
    emoji: '🌊',
    primary: '#0284c7',
    primaryDark: '#0369a1',
    accent: '#0891b2',
    accentDark: '#0e7490',
    secondary: '#e0f2fe',
    border: '#bae6fd',
    ring: '#0284c7',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)',
    gradientAlt: 'linear-gradient(160deg, #38bdf8 0%, #06b6d4 100%)',
  },
  {
    id: 'deepOcean',
    name: 'Deep Ocean',
    description: 'Navy deep-sea — strong & commanding',
    emoji: '🌑',
    primary: '#1e40af',
    primaryDark: '#1e3a8a',
    accent: '#0284c7',
    accentDark: '#0369a1',
    secondary: '#dbeafe',
    border: '#93c5fd',
    ring: '#1e40af',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)',
    gradientAlt:
      'linear-gradient(160deg, #1d4ed8 0%, #0284c7 60%, #06b6d4 100%)',
  },
  {
    id: 'arctic',
    name: 'Arctic Ice',
    description: 'Cool ice blue — crisp & clinical',
    emoji: '🧊',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    accent: '#38bdf8',
    accentDark: '#0ea5e9',
    secondary: '#f0f9ff',
    border: '#bae6fd',
    ring: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    gradientAlt: 'linear-gradient(160deg, #0284c7 0%, #7dd3fc 100%)',
  },
  {
    id: 'teal',
    name: 'Deep Teal',
    description: 'Deep teal-cyan — refreshing & precise',
    emoji: '🩵',
    primary: '#0f766e',
    primaryDark: '#115e59',
    accent: '#0e7490',
    accentDark: '#155e75',
    secondary: '#f0fdfa',
    border: '#99f6e4',
    ring: '#0f766e',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)',
    gradientAlt: 'linear-gradient(160deg, #14b8a6 0%, #22d3ee 100%)',
  },
  // ── Purples & Violets ────────────────────────────────
  {
    id: 'royal',
    name: 'Royal Purple',
    description: 'Rich purple — sophisticated & modern',
    emoji: '👑',
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    accent: '#a855f7',
    accentDark: '#9333ea',
    secondary: '#ede9fe',
    border: '#ddd6fe',
    ring: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    gradientAlt: 'linear-gradient(160deg, #6d28d9 0%, #c084fc 100%)',
  },
  {
    id: 'violet',
    name: 'Violet Dusk',
    description: 'Deep violet-indigo — bold & striking',
    emoji: '🌌',
    primary: '#4f46e5',
    primaryDark: '#4338ca',
    accent: '#7c3aed',
    accentDark: '#6d28d9',
    secondary: '#eef2ff',
    border: '#c7d2fe',
    ring: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    gradientAlt: 'linear-gradient(160deg, #4338ca 0%, #9333ea 100%)',
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft lilac — gentle & calming',
    emoji: '💜',
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    accent: '#c084fc',
    accentDark: '#a855f7',
    secondary: '#f5f3ff',
    border: '#e9d5ff',
    ring: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)',
    gradientAlt: 'linear-gradient(160deg, #7c3aed 0%, #e879f9 100%)',
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo',
    description: 'Classic indigo-blue — trusted & stable',
    emoji: '🔵',
    primary: '#3730a3',
    primaryDark: '#312e81',
    accent: '#1d4ed8',
    accentDark: '#1e40af',
    secondary: '#eef2ff',
    border: '#c7d2fe',
    ring: '#3730a3',
    gradient: 'linear-gradient(135deg, #3730a3 0%, #1d4ed8 100%)',
    gradientAlt: 'linear-gradient(160deg, #312e81 0%, #2563eb 100%)',
  },
  {
    id: 'midnight',
    name: 'Midnight Storm',
    description: 'Dark navy-purple — mysterious & bold',
    emoji: '⚡',
    primary: '#1e1b4b',
    primaryDark: '#0f0c29',
    accent: '#4f46e5',
    accentDark: '#3730a3',
    secondary: '#eef2ff',
    border: '#c7d2fe',
    ring: '#4f46e5',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
    gradientAlt:
      'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  {
    id: 'electric',
    name: 'Electric Blue',
    description: 'Neon electric blue — high energy & bold',
    emoji: '⚡',
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    accent: '#06b6d4',
    accentDark: '#0891b2',
    secondary: '#eff6ff',
    border: '#bfdbfe',
    ring: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
    gradientAlt: 'linear-gradient(160deg, #1d4ed8 0%, #22d3ee 100%)',
  },
  // ── Pinks & Reds ─────────────────────────────────────
  {
    id: 'rose',
    name: 'Rose Gold',
    description: 'Warm rose — vibrant & energetic',
    emoji: '🌹',
    primary: '#e11d48',
    primaryDark: '#be123c',
    accent: '#f43f5e',
    accentDark: '#e11d48',
    secondary: '#fff1f2',
    border: '#fecdd3',
    ring: '#e11d48',
    gradient: 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)',
    gradientAlt: 'linear-gradient(160deg, #e11d48 0%, #fb7185 100%)',
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    description: 'Delicate pink — soft & whimsical',
    emoji: '🌸',
    primary: '#db2777',
    primaryDark: '#be185d',
    accent: '#ec4899',
    accentDark: '#db2777',
    secondary: '#fdf2f8',
    border: '#fbcfe8',
    ring: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
    gradientAlt: 'linear-gradient(160deg, #be185d 0%, #f9a8d4 100%)',
  },
  {
    id: 'crimson',
    name: 'Crimson Fire',
    description: 'Deep crimson red — powerful & urgent',
    emoji: '🔴',
    primary: '#b91c1c',
    primaryDark: '#991b1b',
    accent: '#dc2626',
    accentDark: '#b91c1c',
    secondary: '#fef2f2',
    border: '#fecaca',
    ring: '#b91c1c',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
    gradientAlt:
      'linear-gradient(160deg, #7f1d1d 0%, #dc2626 60%, #f87171 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Purple to pink aurora — magical & vivid',
    emoji: '🌅',
    primary: '#9333ea',
    primaryDark: '#7e22ce',
    accent: '#ec4899',
    accentDark: '#db2777',
    secondary: '#fdf4ff',
    border: '#f0abfc',
    ring: '#9333ea',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    gradientAlt:
      'linear-gradient(160deg, #7e22ce 0%, #a855f7 40%, #f472b6 100%)',
  },
  // ── Warm Tones ───────────────────────────────────────
  {
    id: 'amber',
    name: 'Amber Glow',
    description: 'Rich amber-orange — warm & inviting',
    emoji: '🌟',
    primary: '#d97706',
    primaryDark: '#b45309',
    accent: '#ea580c',
    accentDark: '#c2410c',
    secondary: '#fffbeb',
    border: '#fde68a',
    ring: '#d97706',
    gradient: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
    gradientAlt: 'linear-gradient(160deg, #d97706 0%, #f97316 100%)',
  },
  {
    id: 'mango',
    name: 'Mango Sunrise',
    description: 'Tropical yellow-orange — vibrant & joyful',
    emoji: '🥭',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    accent: '#f97316',
    accentDark: '#ea580c',
    secondary: '#fefce8',
    border: '#fef08a',
    ring: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    gradientAlt: 'linear-gradient(160deg, #eab308 0%, #fb923c 100%)',
  },
  {
    id: 'sunset',
    name: 'Sunset Blaze',
    description: 'Orange to pink sunset — dramatic & warm',
    emoji: '🌇',
    primary: '#ea580c',
    primaryDark: '#c2410c',
    accent: '#e11d48',
    accentDark: '#be123c',
    secondary: '#fff7ed',
    border: '#fed7aa',
    ring: '#ea580c',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #e11d48 100%)',
    gradientAlt:
      'linear-gradient(160deg, #f97316 0%, #f43f5e 60%, #db2777 100%)',
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    description: 'Vibrant coral to pink — fresh & lively',
    emoji: '🪸',
    primary: '#f97316',
    primaryDark: '#ea580c',
    accent: '#ec4899',
    accentDark: '#db2777',
    secondary: '#fff7ed',
    border: '#fed7aa',
    ring: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    gradientAlt: 'linear-gradient(160deg, #fb923c 0%, #f472b6 100%)',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    description: 'Earthy warm-brown — grounded & natural',
    emoji: '🏺',
    primary: '#b45309',
    primaryDark: '#92400e',
    accent: '#c2410c',
    accentDark: '#9a3412',
    secondary: '#fef3c7',
    border: '#fcd34d',
    ring: '#b45309',
    gradient: 'linear-gradient(135deg, #92400e 0%, #c2410c 100%)',
    gradientAlt:
      'linear-gradient(160deg, #78350f 0%, #b45309 50%, #ea580c 100%)',
  },
  // ── Neutrals ─────────────────────────────────────────
  {
    id: 'slate',
    name: 'Graphite',
    description: 'Dark graphite — minimal & corporate',
    emoji: '🖤',
    primary: '#334155',
    primaryDark: '#1e293b',
    accent: '#475569',
    accentDark: '#334155',
    secondary: '#f1f5f9',
    border: '#e2e8f0',
    ring: '#334155',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    gradientAlt:
      'linear-gradient(160deg, #0f172a 0%, #334155 60%, #64748b 100%)',
  },
  {
    id: 'neonMint',
    name: 'Neon Mint',
    description: 'Neon green to cyan — vibrant & futuristic',
    emoji: '💚',
    primary: '#059669',
    primaryDark: '#047857',
    accent: '#06b6d4',
    accentDark: '#0891b2',
    secondary: '#ecfdf5',
    border: '#6ee7b7',
    ring: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #06b6d4 100%)',
    gradientAlt: 'linear-gradient(160deg, #10b981 0%, #22d3ee 100%)',
  },
]

interface ThemeContextValue {
  theme: ColorTheme
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  allThemes: ColorTheme[]
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: COLOR_THEMES[0],
  themeId: 'emerald',
  setTheme: () => {},
  allThemes: COLOR_THEMES,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem('drugsmart-theme')
      if (stored && COLOR_THEMES.find((t) => t.id === stored)) {
        return stored as ThemeId
      }
    } catch {}
    return 'emerald'
  })

  const theme = COLOR_THEMES.find((t) => t.id === themeId) ?? COLOR_THEMES[0]

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--primary-dark', theme.primaryDark)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--accent-dark', theme.accentDark)
    root.style.setProperty('--secondary', theme.secondary)
    root.style.setProperty('--border', theme.border)
    root.style.setProperty('--ring', theme.ring)
    root.style.setProperty('--sidebar-primary', theme.primary)
    root.style.setProperty('--sidebar-accent', theme.secondary)
    root.style.setProperty('--sidebar-accent-foreground', theme.primary)
    root.style.setProperty('--sidebar-ring', theme.ring)
    root.style.setProperty('--secondary-foreground', theme.primary)
  }, [theme])

  const setTheme = (id: ThemeId) => {
    setThemeId(id)
    try {
      localStorage.setItem('drugsmart-theme', id)
    } catch {}
  }

  return (
    <ThemeContext.Provider
      value={{ theme, themeId, setTheme, allThemes: COLOR_THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
