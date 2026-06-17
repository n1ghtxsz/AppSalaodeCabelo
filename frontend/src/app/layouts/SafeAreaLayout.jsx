export default function SafeAreaLayout({ children, className = '' }) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {children}
    </div>
  )
}
