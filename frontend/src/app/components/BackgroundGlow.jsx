export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(175deg, #8b0847 0%, #b5175e 30%, #c41d68 55%, #8b0847 80%, #5a0630 100%)',
        }}
      />
      <div
        className="absolute left-1/2 w-[340px] h-[340px] rounded-full"
        style={{
          top: '-60px',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle, rgba(255,180,220,0.55) 0%, rgba(232,65,156,0.45) 35%, rgba(194,24,91,0.2) 60%, transparent 75%)',
          filter: 'blur(28px)',
        }}
      />
      <div
        className="absolute left-1/2 w-[500px] h-[260px] rounded-full"
        style={{
          top: '40px',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(240,108,186,0.2) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
