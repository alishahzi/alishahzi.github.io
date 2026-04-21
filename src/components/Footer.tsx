import { personal } from '../data/content';

export default function Footer() {
  const yr = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-xs">S</span>
            </div>
            <span className="text-slate-500 text-sm">{personal.name}</span>
          </div>
          <p className="text-slate-700 text-xs">&copy; {yr} {personal.shortName} &middot; AI &amp; Deep Learning for Medical Imaging</p>
          <div className="flex gap-4 text-xs text-slate-700">
            <a href="https://github.com/alishahzi" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
            <a href={personal.cvUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">CV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}