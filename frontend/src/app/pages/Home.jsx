import { useNavigate } from 'react-router-dom'
import SafeAreaLayout from '../layouts/SafeAreaLayout'
import BackgroundGlow from '../components/BackgroundGlow'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import HeroSection from '../components/HeroSection'
import PrimaryButton from '../components/PrimaryButton'
import AuthLink from '../components/AuthLink'
import { ROUTES } from '../../constants'

export default function Home() {
  const navigate = useNavigate()

  return (
    <SafeAreaLayout>
      <BackgroundGlow />
      <Header />

      <main className="relative z-10 flex flex-col justify-end min-h-[calc(100vh-80px)] px-6 pb-10 gap-0">
        <div className="flex flex-col gap-6">
          <StatusBadge />
          <HeroSection />

          <div className="flex flex-col gap-4 pt-2">
            <PrimaryButton
              label="Agendar agora"
              onClick={() => navigate(ROUTES.SCHEDULE)}
            />
            <AuthLink
              text="Já tem conta?"
              linkLabel="Entrar"
              onClick={() => navigate(ROUTES.LOGIN)}
            />
          </div>
        </div>
      </main>
    </SafeAreaLayout>
  )
}
