import { Component, ReactNode, ErrorInfo } from "react";
import Navbar       from "./components/Navbar";
import Hero         from "./components/Hero";
import About        from "./components/About";
import Education    from "./components/Education";
import Experience   from "./components/Experience";
import Publications from "./components/Publications";
import Projects     from "./components/Projects";
import Contact      from "./components/Contact";
import StarField    from "./components/StarField";

interface EBState { hasError: boolean; error?: Error; }
interface EBProps  { children: ReactNode; name: string; }
class EB extends Component<EBProps, EBState> {
  constructor(p: EBProps) { super(p); this.state = { hasError: false }; }
  static getDerivedStateFromError(e: Error): EBState { return { hasError: true, error: e }; }
  componentDidCatch(e: Error, i: ErrorInfo) { console.error(`[${this.props.name}]`, e, i); }
  render() {
    if (this.state.hasError) return (
      <div className="py-12 text-center border border-red-900/30 rounded-xl mx-6 my-4" style={{ background: 'rgba(30,5,5,0.7)' }}>
        <p className="text-sm font-semibold text-red-400 mb-1">{this.props.name} section failed to load</p>
        <p className="text-xs text-slate-600">{this.state.error?.message}</p>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#04080f' }}>
      {/* Moving constellation star field — fixed, covers whole site */}
      <StarField />
      {/* Page content above the canvas */}
      <div className="relative" style={{ zIndex: 1 }}>
        <EB name="Navbar"><Navbar /></EB>
        <main>
          <EB name="Hero"><Hero /></EB>
          <section id="about">    <EB name="About"><About /></EB>           </section>
          <section id="education"><EB name="Education"><Education /></EB>   </section>
          <section id="research"> <EB name="Publications"><Publications /></EB> </section>
          <section id="experience"><EB name="Experience"><Experience /></EB></section>
          <section id="projects"> <EB name="Projects"><Projects /></EB>     </section>
          <section id="contact">  <EB name="Contact"><Contact /></EB>       </section>
        </main>
      </div>
    </div>
  );
}
