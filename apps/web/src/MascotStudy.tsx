import { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Mascot3D from './Mascot3D';
import { appHref } from './basePath';
import './mascot.css';

export default function MascotStudy() {
  const [replay, setReplay] = useState(0), [slow, setSlow] = useState(false), [ready, setReady] = useState(false), [playing, setPlaying] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <main className="mascot-study">
    <header><a href={appHref('/')}><ArrowLeft size={17}/> T1GER</a><span>MOTION STUDY / 01</span></header>
    <section className="mascot-study-content">
      <p className="study-eyebrow">A LITTLE WIN. A LITTLE MOMENTUM.</p>
      <h1>That’s a good idea.</h1>
      <p className="study-intro">Tu mascota. Una nueva forma de celebrar.</p>
      <div className="mascot-stage"><div className="stage-halo"/><Mascot3D celebrate replay={replay} slow={slow} onReady={() => setReady(true)} onComplete={() => setPlaying(false)} onUnavailable={() => setUnavailable(true)}/></div>
      <div className="study-controls"><button className="study-play" disabled={!ready || unavailable} onClick={() => { setReplay(n => n + 1); setPlaying(true); }}><RotateCcw size={18}/>{unavailable ? 'Vista estática' : !ready ? 'Preparando…' : playing && (!reduced || replay > 0) ? 'Volver a empezar' : 'Repetir animación'}</button><button className="study-speed" disabled={unavailable} aria-pressed={slow} onClick={() => setSlow(n => !n)}>Velocidad {slow ? '0.5×' : '1×'}</button></div>
      <p className="study-note" role="status">{unavailable ? 'No se pudo cargar la animación. Recarga la página para intentarlo de nuevo.' : reduced && replay === 0 ? 'Movimiento reducido activo. Pulsa Repetir para ver la muestra.' : 'Anticipación · salto · giro · aterrizaje'}</p>
    </section>
    <footer>01 — CELEBRACIÓN<span>Una muestra para revisar antes de ampliar el repertorio.</span></footer>
  </main>;
}
