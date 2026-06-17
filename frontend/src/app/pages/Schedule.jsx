import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServices }     from '../hooks/useServices'
import { useProfessionals } from '../hooks/useProfessionals'
import { appointmentService } from '../services/appointments'
import { toDateStr }  from '../utils/date'
import { ROUTES }     from '../../constants'

import StepHeader      from '../components/schedule/StepHeader'
import StepService     from '../components/schedule/StepService'
import StepProfessional from '../components/schedule/StepProfessional'
import StepDateTime    from '../components/schedule/StepDateTime'
import StepConfirm     from '../components/schedule/StepConfirm'
import StepSuccess     from '../components/schedule/StepSuccess'

const STEPS = {
  SERVICE:      1,
  PROFESSIONAL: 2,
  DATETIME:     3,
  CONFIRM:      4,
  SUCCESS:      5,
}

const STEP_TITLES = {
  [STEPS.SERVICE]:      'Escolha um serviço',
  [STEPS.PROFESSIONAL]: 'Escolha quem irá te atender',
  [STEPS.DATETIME]:     'Escolha data e horário',
  [STEPS.CONFIRM]:      'Confirme seu agendamento',
}

const INITIAL_BOOKING = {
  service:      null,
  professional: null,
  date:         null,
  time:         null,
}

export default function Schedule() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(STEPS.SERVICE)
  const [booking, setBooking] = useState(INITIAL_BOOKING)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState(null)

  const { services, categories, loading: loadingServices }   = useServices()
  const { professionals, loading: loadingProfessionals }     = useProfessionals()

  function canAdvance() {
    if (step === STEPS.SERVICE)      return !!booking.service
    if (step === STEPS.PROFESSIONAL) return booking.professional !== undefined
    if (step === STEPS.DATETIME)     return !!booking.date && !!booking.time
    return false
  }

  function handleBack() {
    if (step === STEPS.SERVICE) { navigate(ROUTES.DASHBOARD); return }
    if (step === STEPS.SUCCESS) { navigate(ROUTES.DASHBOARD); return }
    setStep((s) => s - 1)
  }

  function handleNext() {
    if (!canAdvance()) return
    if (step === STEPS.DATETIME) { setStep(STEPS.CONFIRM); return }
    setStep((s) => s + 1)
  }

  async function handleConfirm() {
    setError(null)
    setSubmitting(true)
    try {
      const d = new Date(booking.date)
      const [h, m] = booking.time.split(':').map(Number)
      d.setHours(h, m, 0, 0)

      await appointmentService.create({
        service_id:      booking.service.id,
        professional_id: booking.professional?.id ?? null,
        scheduled_at:    d.toISOString(),
      })

      setStep(STEPS.SUCCESS)
    } catch (e) {
      setError(e.message || 'Erro ao confirmar agendamento.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSuccess = step === STEPS.SUCCESS

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* centered card on desktop */}
      <div className="w-full max-w-lg md:my-8 md:rounded-3xl md:shadow-xl md:border md:border-gray-100 md:overflow-hidden flex flex-col">

        {/* step header (not shown on success) */}
        {!isSuccess && (
          <StepHeader
            step={step}
            title={STEP_TITLES[step]}
            onBack={handleBack}
          />
        )}

        {/* step content */}
        <div className="flex-1 overflow-y-auto pt-4 pb-32 md:pb-24">
          {step === STEPS.SERVICE && (
            <StepService
              services={services}
              categories={categories}
              loading={loadingServices}
              selected={booking.service}
              onSelect={(s) => setBooking((b) => ({ ...b, service: s, professional: null, date: null, time: null }))}
            />
          )}

          {step === STEPS.PROFESSIONAL && (
            <StepProfessional
              service={booking.service}
              professionals={professionals}
              loading={loadingProfessionals}
              selected={booking.professional}
              onSelect={(p) => setBooking((b) => ({ ...b, professional: p, date: null, time: null }))}
              onEditService={() => setStep(STEPS.SERVICE)}
            />
          )}

          {step === STEPS.DATETIME && (
            <StepDateTime
              serviceId={booking.service?.id}
              professionalId={booking.professional?.id ?? null}
              selectedDate={booking.date}
              selectedTime={booking.time}
              onSelectDate={(d) => setBooking((b) => ({ ...b, date: d, time: null }))}
              onSelectTime={(t) => setBooking((b) => ({ ...b, time: t }))}
            />
          )}

          {step === STEPS.CONFIRM && (
            <StepConfirm
              booking={booking}
              submitting={submitting}
              onConfirm={handleConfirm}
            />
          )}

          {step === STEPS.SUCCESS && (
            <StepSuccess
              booking={booking}
              onHome={() => navigate(ROUTES.DASHBOARD, { replace: true })}
            />
          )}

          {error && (
            <p className="mx-4 mt-3 text-xs text-red-500 text-center bg-red-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
        </div>

        {/* sticky bottom CTA (steps 1–3) */}
        {step < STEPS.CONFIRM && (
          <div
            className="fixed md:absolute bottom-0 left-0 right-0 md:left-auto md:right-auto w-full max-w-lg px-4 pb-6 pt-3 bg-white/90 backdrop-blur-sm border-t border-gray-100"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 50%, #c41d68 100%)' }}
            >
              › Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
