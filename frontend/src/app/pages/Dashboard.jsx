import { useNavigate }        from 'react-router-dom'
import { useAuth }             from '../hooks/useAuth'
import { useNextAppointment }  from '../hooks/useNextAppointment'
import { useProfessionals }    from '../hooks/useProfessionals'
import { ROUTES }              from '../../constants'

import AppSidebar          from '../components/AppSidebar'
import BottomNav           from '../components/BottomNav'
import DashHeader          from '../components/dashboard/DashHeader'
import NextAppointmentCard from '../components/dashboard/NextAppointmentCard'
import QuickActions        from '../components/dashboard/QuickActions'
import ProfessionalsList   from '../components/dashboard/ProfessionalsList'

export default function Dashboard() {
  const { user }                               = useAuth()
  const navigate                               = useNavigate()
  const { appointment, loading: aptLoading }   = useNextAppointment()
  const { professionals, loading: prosLoading } = useProfessionals()

  function handleQuickAction(id) {
    if (id === 'agendar') navigate(ROUTES.SCHEDULE)
  }

  const initials  = user?.name
    ?.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'
  const firstName = user?.name?.split(' ')[0] || 'Cliente'

  return (
    <div className="min-h-screen flex bg-white md:bg-gray-50 font-sans">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* mobile header */}
        <div className="md:hidden">
          <DashHeader user={user} onNotification={() => {}} />
        </div>

        {/* desktop header */}
        <header className="hidden md:flex items-center px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Painel da Cliente</p>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Olá, {firstName} ✨
            </h1>
          </div>
          <div className="ml-auto">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
            >
              {initials}
            </div>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
        >
          {/* mobile */}
          <div className="md:hidden flex flex-col gap-5 pt-2 pb-4">
            <NextAppointmentCard
              appointment={appointment}
              loading={aptLoading}
              onBook={() => navigate(ROUTES.SCHEDULE)}
              onDetails={() => {}}
              onReschedule={() => navigate(ROUTES.SCHEDULE)}
            />
            <QuickActions onAction={handleQuickAction} />
            <ProfessionalsList professionals={professionals} loading={prosLoading} onViewAll={() => {}} />
          </div>

          {/* desktop */}
          <div className="hidden md:block p-6">
            <div className="grid grid-cols-[1fr_320px] gap-5 mb-5">
              <NextAppointmentCard
                appointment={appointment}
                loading={aptLoading}
                onBook={() => navigate(ROUTES.SCHEDULE)}
                onDetails={() => {}}
                onReschedule={() => navigate(ROUTES.SCHEDULE)}
              />
              <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Ações rápidas</p>
                <QuickActions onAction={handleQuickAction} className="" />
              </div>
            </div>
            <ProfessionalsList professionals={professionals} loading={prosLoading} onViewAll={() => {}} />
          </div>
        </main>
      </div>

      <BottomNav onAdd={() => navigate(ROUTES.SCHEDULE)} />
    </div>
  )
}
