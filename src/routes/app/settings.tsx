import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useTheme,
  COLOR_THEMES,
  ThemeId,
  ColorTheme,
} from '@/lib/theme-context'
import {
  Palette,
  Check,
  Bell,
  Shield,
  Globe,
  User,
  Monitor,
  ChevronRight,
  Sparkles,
  Store,
  Clock,
} from 'lucide-react'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { themeId, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('appearance')

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'pharmacy', label: 'Pharmacy Info', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'regional', label: 'Regional', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Customize your DrugSmart experience
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-2 space-y-1">
            {sections.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  id={`settings-nav-${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                          boxShadow: `0 4px 14px color-mix(in srgb, var(--primary) 30%, transparent)`,
                        }
                      : {}
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {sec.label}
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-70" />
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeSection === 'appearance' && (
            <AppearanceSection activeThemeId={themeId} setTheme={setTheme} />
          )}
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'pharmacy' && <PharmacySection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'security' && <SecuritySection />}
          {activeSection === 'regional' && <RegionalSection />}
        </div>
      </div>
    </div>
  )
}

/* =====================================================
   APPEARANCE SECTION - Theme Picker
   ===================================================== */
function AppearanceSection({
  activeThemeId,
  setTheme,
}: {
  activeThemeId: ThemeId
  setTheme: (id: ThemeId) => void
}) {
  const activeTheme = COLOR_THEMES.find((t) => t.id === activeThemeId)!
  return (
    <div className="space-y-6">
      {/* Active Theme Preview Banner */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
        style={{ background: activeTheme.gradientAlt }}
      >
        {/* Floating orbs for depth */}
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-16 w-32 h-32 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-2xl">
              {activeTheme.emoji}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                Active Theme
              </p>
              <h2 className="text-xl font-black tracking-tight">
                {activeTheme.name}
              </h2>
            </div>
          </div>
          <p className="text-sm text-white/80 max-w-md">
            {activeTheme.description}
          </p>

          {/* Sample UI preview */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold">
              <Check className="h-4 w-4" /> Primary Action
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium text-white/80">
              Secondary
            </div>
            <div className="h-2.5 flex-1 bg-white/20 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full w-[65%] bg-white/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          <h2 className="text-lg font-bold text-slate-800">
            Choose Your Colour Theme
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          {COLOR_THEMES.length} colour combinations — changes apply instantly
          across the entire app.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {COLOR_THEMES.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onSelect={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Display settings */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Monitor className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          Display Preferences
        </h3>
        <div className="space-y-4">
          <ToggleRow
            label="Compact Mode"
            description="Reduce spacing and padding for a denser layout"
            defaultChecked={false}
          />
          <ToggleRow
            label="Animated Transitions"
            description="Enable smooth page and component animations"
            defaultChecked={true}
          />
          <ToggleRow
            label="High Contrast Mode"
            description="Increase contrast ratios for accessibility"
            defaultChecked={false}
          />
        </div>
      </div>
    </div>
  )
}

function ThemeCard({
  theme,
  isActive,
  onSelect,
}: {
  theme: ColorTheme
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      id={`theme-card-${theme.id}`}
      onClick={onSelect}
      className={`group relative text-left rounded-2xl p-1 transition-all duration-300 ${
        isActive
          ? 'shadow-xl scale-[1.03]'
          : 'hover:scale-[1.02] hover:shadow-md'
      }`}
      style={
        isActive
          ? {
              outline: `2.5px solid ${theme.primary}`,
              outlineOffset: '2px',
              boxShadow: `0 10px 32px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
            }
          : { outline: '1.5px solid #e2e8f0', outlineOffset: '1px' }
      }
    >
      {/* Dual-gradient swatch */}
      <div className="w-full h-24 rounded-xl relative overflow-hidden">
        {/* Primary gradient fills the whole cell */}
        <div
          className="absolute inset-0"
          style={{ background: theme.gradient }}
        />
        {/* Alt gradient overlays a triangle in the bottom-right */}
        <div
          className="absolute inset-0"
          style={{
            background: theme.gradientAlt,
            clipPath: 'polygon(100% 40%, 100% 100%, 30% 100%)',
            opacity: 0.85,
          }}
        />

        {/* Mini UI mock */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-[8px]">{theme.emoji}</span>
            </div>
            <div className="h-2 w-10 rounded-full bg-white/40" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-white/40" />
            <div className="h-1.5 w-1/2 rounded-full bg-white/30" />
          </div>
          <div className="flex gap-1">
            <div className="h-5 px-2 rounded-md bg-white/25 flex items-center">
              <div className="h-1 w-6 bg-white/70 rounded-full" />
            </div>
            <div className="h-5 px-2 rounded-md bg-white/15 flex items-center">
              <div className="h-1 w-4 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Active checkmark */}
        {isActive && (
          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md">
            <Check
              className="h-3.5 w-3.5"
              style={{ color: theme.primary, strokeWidth: 3 }}
            />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="pt-2.5 pb-1 px-1">
        <p
          className={`text-xs font-bold tracking-tight transition-colors ${isActive ? '' : 'text-slate-700'}`}
          style={isActive ? { color: theme.primary } : {}}
        >
          {theme.name}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-1">
          {theme.description}
        </p>
      </div>
    </button>
  )
}

/* =====================================================
   TOGGLE ROW
   ===================================================== */
function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? '' : 'bg-slate-200'}`}
        style={
          checked
            ? {
                background:
                  'linear-gradient(135deg, var(--primary), var(--accent))',
              }
            : {}
        }
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${checked ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

/* =====================================================
   OTHER SETTING SECTIONS (Stubs with real-looking UI)
   ===================================================== */

function ProfileSection() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <h2 className="font-bold text-slate-800 text-lg">Profile Information</h2>
      <div className="flex items-center gap-4">
        <div
          className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        >
          DK
        </div>
        <div>
          <p className="font-bold text-slate-800">Dr. Kwame</p>
          <p className="text-sm text-slate-500">Owner · kwame@drugsmart.com</p>
          <button
            className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--primary)',
              background: 'color-mix(in srgb, var(--primary) 8%, transparent)',
              border:
                '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
            }}
          >
            Change Photo
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {['Full Name', 'Email Address', 'Phone Number', 'Job Title'].map(
          (f) => (
            <div key={f}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                {f}
              </label>
              <input
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:border-transparent focus:ring-2 transition-all"
                style={
                  { '--tw-ring-color': 'var(--primary)' } as React.CSSProperties
                }
                placeholder={f}
              />
            </div>
          ),
        )}
      </div>
      <div className="flex justify-end pt-2">
        <button
          className="text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--accent))',
            boxShadow: 'var(--primary) 0 6px 20px -6px',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function PharmacySection() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <h2 className="font-bold text-slate-800 text-lg">Pharmacy Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          'Pharmacy Name',
          'Registration Number',
          'Address',
          'City',
          'Region',
          'Country',
        ].map((f) => (
          <div key={f} className={f === 'Address' ? 'sm:col-span-2' : ''}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
              {f}
            </label>
            <input
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 transition-all"
              placeholder={f}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button
          className="text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-90"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const notifGroups = [
    {
      group: 'Inventory Alerts',
      items: [
        {
          label: 'Low stock alerts',
          description: 'Notify when items fall below threshold',
        },
        {
          label: 'Expiry warnings',
          description: 'Alert 30 days before expiry',
        },
        {
          label: 'Out of stock',
          description: 'Immediate alert when item hits zero',
        },
      ],
    },
    {
      group: 'Sales & Revenue',
      items: [
        {
          label: 'Daily sales summary',
          description: 'End-of-day revenue report',
        },
        {
          label: 'Transaction receipts',
          description: 'Confirmation for each sale',
        },
      ],
    },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
      <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
        <Bell className="h-5 w-5" style={{ color: 'var(--primary)' }} />
        Notification Preferences
      </h2>
      {notifGroups.map((group) => (
        <div key={group.group}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            {group.group}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <ToggleRow
                key={item.label}
                label={item.label}
                description={item.description}
                defaultChecked={true}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          Security Settings
        </h2>
        <div className="space-y-4">
          {['Current Password', 'New Password', 'Confirm New Password'].map(
            (f) => (
              <div key={f}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  {f}
                </label>
                <input
                  type="password"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 transition-all"
                  placeholder="••••••••"
                />
              </div>
            ),
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{
              background:
                'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          Session & Access
        </h3>
        <ToggleRow
          label="Two-Factor Authentication"
          description="Add an extra layer of account security"
          defaultChecked={false}
        />
        <ToggleRow
          label="Auto-logout after inactivity"
          description="Sign out after 30 minutes of no activity"
          defaultChecked={true}
        />
      </div>
    </div>
  )
}

function RegionalSection() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
        <Globe className="h-5 w-5" style={{ color: 'var(--primary)' }} />
        Regional & Language
      </h2>
      {[
        {
          label: 'Language',
          options: ['English (UK)', 'English (US)', 'Twi', 'Hausa'],
        },
        {
          label: 'Currency',
          options: [
            'GH₵ Ghanaian Cedi',
            'USD US Dollar',
            'EUR Euro',
            'GBP British Pound',
          ],
        },
        {
          label: 'Timezone',
          options: [
            'Africa/Accra (GMT+0)',
            'Africa/Lagos (GMT+1)',
            'Europe/London (GMT+0)',
          ],
        },
        {
          label: 'Date Format',
          options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
        },
      ].map(({ label, options }) => (
        <div key={label}>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
            {label}
          </label>
          <select className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 transition-all">
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button
          className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
          style={{
            background:
              'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  )
}
