import { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Mascot3D from './Mascot3D';
import { appHref } from './basePath';
import './mascot.css';
import type { MascotAnimation } from './mascotMotion';

const scenes: { id: MascotAnimation; label: string; title: string; context: string }[] = [
  { id: 'welcome', label: 'Bienvenida', title: 'Vamos a explorar.', context: 'Al entrar al onboarding o a una nueva lección.' },
  { id: 'thinking', label: 'Pensando', title: 'Tómate un momento.', context: 'Mientras eliges una respuesta o recuperas una idea.' },
  { id: 'correct', label: 'Acierto', title: 'Buen razonamiento.', context: 'Al comprobar una respuesta correcta.' },
  { id: 'retry', label: 'Reintento', title: 'Un error útil.', context: 'Una reacción amable cuando toca volver a intentarlo.' },
  { id: 'saved', label: 'Guardado', title: 'Una idea puesta a trabajar.', context: 'Después de guardar correctamente tu ejercicio.' },
  { id: 'recall', label: 'Repaso', title: 'La trajiste de vuelta.', context: 'Al revelar la idea o terminar una sesión de repaso.' },
  { id: 'celebrate', label: 'Lección', title: 'That’s a good idea.', context: 'Al completar Learn, Apply y Master.' },
  { id: 'milestone', label: 'Ruta completa', title: 'Mira lo que construiste.', context: 'Una celebración mayor al completar la quinta idea de una ruta.' },
];

export default function MascotStudy() {
  const [replay, setReplay] = useState(0), [slow, setSlow] = useState(false), [ready, setReady] = useState(false), [playing, setPlaying] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [scene, setScene] = useState(scenes[6]);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <main className="mascot-study">
    <header><a href={appHref('/')}><ArrowLeft size={17}/> T1GER</a><span>T1GER / MOTION</span></header>
    <section className="mascot-study-content">
      <p className="study-eyebrow">A LITTLE WIN. A LITTLE MOMENTUM.</p>
      <h1>{scene.title}</h1>
      <p className="study-intro">{scene.context}</p>
      <div className="motion-scenes" aria-label="Momentos del aprendizaje">{scenes.map(item => <button key={item.id} aria-pressed={scene.id === item.id} onClick={() => { setScene(item); setReplay(n => n + 1); setPlaying(true); }}>{item.label}</button>)}</div>
      <div className="mascot-stage"><div className="stage-halo"/><Mascot3D animation={scene.id} replay={replay} slow={slow} onReady={() => setReady(true)} onComplete={() => setPlaying(false)} onUnavailable={() => setUnavailable(true)}/></div>
      <div className="study-controls"><button className="study-play" disabled={!ready || unavailable} onClick={() => { setReplay(n => n + 1); setPlaying(true); }}><RotateCcw size={18}/>{unavailable ? 'Vista estática' : !ready ? 'Preparando…' : playing && (!reduced || replay > 0) ? 'Volver a empezar' : 'Repetir animación'}</button><button className="study-speed" disabled={unavailable} aria-pressed={slow} onClick={() => setSlow(n => !n)}>Velocidad {slow ? '0.5×' : '1×'}</button></div>
      <p className="study-note" role="status">{unavailable ? 'No se pudo cargar la animación. Recarga la página para intentarlo de nuevo.' : reduced && replay === 0 ? 'Movimiento reducido activo. Pulsa Repetir para ver la muestra.' : `${scene.label} · Muestra de animación, sin cambios en tu progreso.`}</p>
    </section>
    <footer>OCHO MOMENTOS. UN MISMO PERSONAJE.<span>Reacciones conectadas al aprendizaje.</span></footer>
  </main>;
}
