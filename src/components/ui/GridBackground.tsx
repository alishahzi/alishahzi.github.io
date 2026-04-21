// Subtle animated dot-grid backdrop — used across sections.
// More modern than pure grid lines; plays well with the SiteBackground canvas.
export default function GridBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Dot grid — very subtle */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.07) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.6,
        }}
      />
      {/* Section-center radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(6,182,212,0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
