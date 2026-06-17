import { RiNotification3Line } from 'react-icons/ri'

export default function DashHeader({ user, onNotification }) {
  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'
  const firstName = user?.name?.split(' ')[0] || 'Cliente'

  return (
    <header className="flex items-center px-4 pt-4 pb-2">
      {/* avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
        aria-label={`Avatar de ${firstName}`}
      >
        {initials}
      </div>

      {/* greeting */}
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-xs text-gray-400 leading-none">Olá,</p>
        <p className="text-lg font-bold text-gray-900 leading-tight truncate">
          {firstName} ✨
        </p>
      </div>

      {/* notification */}
      <button
        onClick={onNotification}
        className="relative p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors shrink-0"
        aria-label="Notificações"
      >
        <RiNotification3Line size={22} />
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white"
          aria-hidden="true"
        />
      </button>
    </header>
  )
}
