import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Plus,
  Phone,
  User,
  Pill,
  Calendar,
  ChevronRight,
  X,
  Clock,
  TrendingUp,
  Users,
  HeartPulse,
  ShoppingBag,
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export const Route = createFileRoute('/app/patients/')({
  component: PatientsPage,
})

/* ── Types ────────────────────────────────────────────── */
export interface Medicine {
  name: string
  quantity: number
  price: number
  date: string
}

export interface Patient {
  id: string
  name: string
  phone: string
  dob?: string
  gender: 'Male' | 'Female' | 'Other'
  lastVisit: string
  totalVisits: number
  totalSpent: number
  medicines: Medicine[]
  notes?: string
}

/* ── Mock Data ────────────────────────────────────────── */
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Abena Mensah',
    phone: '+233 24 123 4567',
    dob: '1985-03-12',
    gender: 'Female',
    lastVisit: '2026-02-24',
    totalVisits: 8,
    totalSpent: 245.5,
    medicines: [
      {
        name: 'Paracetamol 500mg',
        quantity: 2,
        price: 5.0,
        date: '2026-02-24',
      },
      {
        name: 'Vitamin C 1000mg',
        quantity: 1,
        price: 35.0,
        date: '2026-02-24',
      },
      {
        name: 'Amoxicillin Syrup',
        quantity: 1,
        price: 15.0,
        date: '2026-01-15',
      },
    ],
    notes: 'Allergic to penicillin',
  },
  {
    id: '2',
    name: 'Kweku Darko',
    phone: '+233 50 987 6543',
    dob: '1972-11-05',
    gender: 'Male',
    lastVisit: '2026-02-23',
    totalVisits: 14,
    totalSpent: 892.0,
    medicines: [
      { name: 'Metformin 500mg', quantity: 3, price: 12.0, date: '2026-02-23' },
      { name: 'Omeprazole 20mg', quantity: 2, price: 6.0, date: '2026-02-23' },
      { name: 'Ibuprofen 400mg', quantity: 1, price: 4.0, date: '2026-01-30' },
      { name: 'Vitamin D3', quantity: 1, price: 28.0, date: '2026-01-10' },
    ],
    notes: 'Diabetic patient — regular refills',
  },
  {
    id: '3',
    name: 'Esi Adjoa Boateng',
    phone: '+233 20 345 6789',
    gender: 'Female',
    lastVisit: '2026-02-22',
    totalVisits: 3,
    totalSpent: 112.0,
    medicines: [
      { name: 'Cetirizine 10mg', quantity: 2, price: 11.0, date: '2026-02-22' },
      {
        name: 'Multivitamin Tablets',
        quantity: 1,
        price: 45.0,
        date: '2026-02-10',
      },
    ],
  },
  {
    id: '4',
    name: 'Kofi Asante',
    phone: '+233 27 654 3210',
    dob: '1990-07-18',
    gender: 'Male',
    lastVisit: '2026-02-20',
    totalVisits: 6,
    totalSpent: 318.5,
    medicines: [
      { name: 'Cough Syrup', quantity: 2, price: 24.0, date: '2026-02-20' },
      {
        name: 'Paracetamol 500mg',
        quantity: 3,
        price: 7.5,
        date: '2026-02-20',
      },
    ],
  },
  {
    id: '5',
    name: 'Akosua Frimpong',
    phone: '+233 55 111 2222',
    dob: '2001-01-30',
    gender: 'Female',
    lastVisit: '2026-02-18',
    totalVisits: 2,
    totalSpent: 58.0,
    medicines: [
      {
        name: 'Vitamin C 1000mg',
        quantity: 1,
        price: 35.0,
        date: '2026-02-18',
      },
      { name: 'Ibuprofen 400mg', quantity: 1, price: 4.0, date: '2026-01-05' },
    ],
  },
  {
    id: '6',
    name: 'Emmanuel Tawiah',
    phone: '+233 26 888 9999',
    dob: '1968-06-22',
    gender: 'Male',
    lastVisit: '2026-02-15',
    totalVisits: 22,
    totalSpent: 1540.0,
    medicines: [
      { name: 'Metformin 500mg', quantity: 4, price: 16.0, date: '2026-02-15' },
      { name: 'Amlodipine 5mg', quantity: 2, price: 9.0, date: '2026-02-15' },
      { name: 'Omeprazole 20mg', quantity: 1, price: 3.0, date: '2026-01-28' },
    ],
    notes: 'Hypertensive + diabetic, chronic patient',
  },
]

/* ── Page Component ───────────────────────────────────── */
function PatientsPage() {
  const { theme } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filtered = MOCK_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  )

  const stats = {
    total: MOCK_PATIENTS.length,
    active: MOCK_PATIENTS.filter((p) => {
      const days =
        (Date.now() - new Date(p.lastVisit).getTime()) / (1000 * 60 * 60 * 24)
      return days <= 30
    }).length,
    totalRevenue: MOCK_PATIENTS.reduce((s, p) => s + p.totalSpent, 0),
    avgVisits:
      Math.round(
        (MOCK_PATIENTS.reduce((s, p) => s + p.totalVisits, 0) /
          MOCK_PATIENTS.length) *
          10,
      ) / 10,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Patients
          </h1>
          <p className="text-slate-500 font-medium mt-0.5">
            Track patient records, contact details and medication history
          </p>
        </div>
        <button
          id="add-patient-btn"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            boxShadow: `0 6px 20px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
          }}
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Patients',
            value: stats.total,
            icon: Users,
            themed: true,
          },
          {
            label: 'Active (30d)',
            value: stats.active,
            icon: HeartPulse,
            color: '#10b981',
            bg: 'from-emerald-50 to-teal-50 border-emerald-200',
            iconGrad: 'linear-gradient(135deg,#10b981,#0d9488)',
            text: 'text-emerald-900',
            sub: 'text-emerald-600',
          },
          {
            label: 'Total Revenue',
            value: `GH₵ ${stats.totalRevenue.toFixed(0)}`,
            icon: ShoppingBag,
            color: '#7c3aed',
            bg: 'from-violet-50 to-purple-50 border-violet-200',
            iconGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            text: 'text-violet-900',
            sub: 'text-violet-600',
          },
          {
            label: 'Avg. Visits',
            value: stats.avgVisits,
            icon: TrendingUp,
            color: '#f97316',
            bg: 'from-orange-50 to-amber-50 border-orange-200',
            iconGrad: 'linear-gradient(135deg,#f97316,#eab308)',
            text: 'text-orange-900',
            sub: 'text-orange-600',
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 border-2 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 ${s.themed ? '' : `bg-gradient-to-br ${s.bg}`}`}
            style={
              s.themed
                ? {
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    boxShadow: `0 12px 32px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
                    border: 'none',
                  }
                : {
                    boxShadow: `0 4px 20px color-mix(in srgb, ${s.color} 12%, transparent)`,
                  }
            }
          >
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20"
              style={{
                background: `radial-gradient(circle, ${s.themed ? 'white' : s.color}, transparent)`,
              }}
            />
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
              style={{
                background: s.themed ? 'rgba(255,255,255,0.2)' : s.iconGrad,
              }}
            >
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p
              className={`text-3xl font-black tracking-tight mb-0.5 relative z-10 ${s.themed ? 'text-white' : s.text}`}
            >
              {s.value}
            </p>
            <p
              className={`text-xs font-bold uppercase tracking-wide relative z-10 ${s.themed ? 'text-white/70' : s.sub}`}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div
        className="rounded-2xl border bg-white/80 backdrop-blur-md p-4"
        style={{
          borderColor: `color-mix(in srgb, ${theme.primary} 12%, #e2e8f0)`,
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors"
            style={{ color: search ? theme.primary : '#94a3b8' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone number..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.primary
              e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${theme.primary} 12%, transparent)`
              e.currentTarget.style.background = 'white'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.background = ''
            }}
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            theme={theme}
            onClick={() => setSelectedPatient(patient)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: `color-mix(in srgb, ${theme.primary} 8%, #f1f5f9)`,
              }}
            >
              <User className="h-8 w-8" style={{ color: theme.primary }} />
            </div>
            <p className="font-bold text-slate-700">No patients found</p>
            <p className="text-sm text-slate-400 mt-1">
              Try a different name or phone number
            </p>
          </div>
        )}
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <PatientDrawer
          patient={selectedPatient}
          theme={theme}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* Add Patient Modal */}
      {isAddOpen && (
        <AddPatientModal theme={theme} onClose={() => setIsAddOpen(false)} />
      )}
    </div>
  )
}

/* ── Patient Card ─────────────────────────────────────── */
function PatientCard({
  patient,
  theme,
  onClick,
}: {
  patient: Patient
  theme: { primary: string; accent: string }
  onClick: () => void
}) {
  const daysSince = Math.floor(
    (Date.now() - new Date(patient.lastVisit).getTime()) /
      (1000 * 60 * 60 * 24),
  )

  const initials = patient.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <button
      id={`patient-card-${patient.id}`}
      onClick={onClick}
      className="text-left group rounded-2xl bg-white border p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${theme.primary} 10%, #e2e8f0)`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          `color-mix(in srgb, ${theme.primary} 35%, #e2e8f0)`
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          `0 12px 36px color-mix(in srgb, ${theme.primary} 12%, rgba(0,0,0,0.06))`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          `color-mix(in srgb, ${theme.primary} 10%, #e2e8f0)`
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Subtle corner orb */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${theme.primary} 8%, transparent), transparent)`,
        }}
      />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-black text-slate-800 text-sm leading-tight">
                {patient.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">
                  {patient.phone}
                </span>
              </div>
            </div>
            <ChevronRight
              className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform mt-0.5 shrink-0"
              style={{
                color: `color-mix(in srgb, ${theme.primary} 40%, #e2e8f0)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-50 my-3.5" />

      {/* Stats row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">
            {daysSince === 0
              ? 'Today'
              : daysSince === 1
                ? 'Yesterday'
                : `${daysSince}d ago`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">
            {patient.totalVisits} visits
          </span>
        </div>
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-lg"
          style={{
            color: theme.primary,
            background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
          }}
        >
          GH₵ {patient.totalSpent.toFixed(0)}
        </div>
      </div>

      {/* Top 2 medicines */}
      {patient.medicines.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {patient.medicines.slice(0, 2).map((m, i) => (
            <span
              key={i}
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100"
            >
              <Pill className="h-2.5 w-2.5" />
              {m.name.split(' ').slice(0, 2).join(' ')}
            </span>
          ))}
          {patient.medicines.length > 2 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
              style={{
                color: theme.accent,
                background: `color-mix(in srgb, ${theme.accent} 8%, transparent)`,
              }}
            >
              +{patient.medicines.length - 2} more
            </span>
          )}
        </div>
      )}
    </button>
  )
}

/* ── Patient Detail Drawer ────────────────────────────── */
function PatientDrawer({
  patient,
  theme,
  onClose,
}: {
  patient: Patient
  theme: { primary: string; accent: string }
  onClose: () => void
}) {
  const initials = patient.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div
          className="p-6 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, white, transparent)',
            }}
          />
          <div
            className="absolute -bottom-6 left-8 w-24 h-24 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, white, transparent)',
            }}
          />

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-lg shadow-lg">
              {initials}
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-xl font-black relative z-10">{patient.name}</h2>
          <p className="text-sm text-white/80 font-medium relative z-10 mt-0.5">
            {patient.gender} · {patient.phone}
          </p>
          {patient.dob && (
            <p className="text-xs text-white/60 relative z-10 mt-0.5">
              DOB:{' '}
              {new Date(patient.dob).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-0 border-b border-slate-100">
          {[
            { label: 'Visits', value: patient.totalVisits },
            { label: 'Medicines', value: patient.medicines.length },
            { label: 'Spent', value: `GH₵${patient.totalSpent.toFixed(0)}` },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 text-center border-r border-slate-100 last:border-r-0"
            >
              <p className="text-xl font-black text-slate-800">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Notes */}
        {patient.notes && (
          <div
            className="mx-4 mt-4 p-3 rounded-xl border text-sm text-slate-600 font-medium"
            style={{
              background: `color-mix(in srgb, ${theme.primary} 4%, #f8fafc)`,
              borderColor: `color-mix(in srgb, ${theme.primary} 15%, #e2e8f0)`,
            }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ color: theme.primary }}
            >
              Clinical Notes
            </p>
            {patient.notes}
          </div>
        )}

        {/* Medicine History */}
        <div className="p-4">
          <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2">
            <Pill className="h-4 w-4" style={{ color: theme.primary }} />
            Medicine History
          </h3>
          <div className="space-y-2.5">
            {patient.medicines.map((med, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-3.5 rounded-xl border bg-slate-50/50"
                style={{
                  borderColor: `color-mix(in srgb, ${theme.primary} 8%, #e2e8f0)`,
                }}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {med.name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Qty: {med.quantity} ·{' '}
                    {new Date(med.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div
                  className="text-xs font-black px-2.5 py-1 rounded-lg shrink-0"
                  style={{
                    color: theme.primary,
                    background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
                  }}
                >
                  GH₵ {(med.price * med.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Add Patient Modal ────────────────────────────────── */
function AddPatientModal({
  theme,
  onClose,
}: {
  theme: { primary: string; accent: string }
  onClose: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div
          className="p-6 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, white, transparent)',
            }}
          />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-lg font-black">New Patient</h2>
              <p className="text-sm text-white/75">
                Fill in the patient's details below
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {[
            {
              id: 'patient-name',
              label: 'Full Name',
              placeholder: 'e.g. Abena Mensah',
              type: 'text',
            },
            {
              id: 'patient-phone',
              label: 'Phone Number',
              placeholder: 'e.g. +233 24 000 0000',
              type: 'tel',
            },
            {
              id: 'patient-dob',
              label: 'Date of Birth',
              placeholder: '',
              type: 'date',
            },
          ].map(({ id, label, placeholder, type }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1.5"
              >
                {label}
              </label>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.primary
                  e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${theme.primary} 10%, transparent)`
                  e.currentTarget.style.background = 'white'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.background = ''
                }}
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
              Gender
            </label>
            <div className="flex gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-slate-50 hover:border-transparent hover:text-white transition-all duration-200"
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
                    ;(e.currentTarget as HTMLElement).style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = ''
                    ;(e.currentTarget as HTMLElement).style.color = ''
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="patient-notes"
              className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1.5"
            >
              Notes (Optional)
            </label>
            <textarea
              id="patient-notes"
              rows={2}
              placeholder="Allergies, chronic conditions..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none transition-all resize-none placeholder:text-slate-400"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.primary
                e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${theme.primary} 10%, transparent)`
                e.currentTarget.style.background = 'white'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.background = ''
              }}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              className="flex-1 h-11 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                boxShadow: `0 6px 20px color-mix(in srgb, ${theme.primary} 30%, transparent)`,
              }}
            >
              Save Patient
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
