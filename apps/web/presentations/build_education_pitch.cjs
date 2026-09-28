const pptxgen = require('C:/Users/david/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs');
const path = require('node:path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'T1GER';
pptx.subject = 'El sistema educativo T1GER';
pptx.title = 'T1GER — Lo mejor de internet, convertido en aprendizaje real';
pptx.lang = 'es-ES';
pptx.company = 'T1GER';

const S = pptx.ShapeType;
const C = { bg:'0D0D10', panel:'17171C', panel2:'202027', white:'F7F3ED', muted:'ABA8AA', quiet:'77757B', orange:'FF7300', light:'FF9A45', line:'3B383B', cream:'F7F3ED' };
const W = 13.333, H = 7.5;
const out = path.join(__dirname, 'T1GER_Educacion_que_se_queda.pptx');

function box(slide,x,y,w,h,fill=C.panel,line=C.line,radius=true) {
  slide.addShape(radius ? S.roundRect : S.rect,{x,y,w,h,rectRadius:0.13,fill:{color:fill},line:{color:line,width:0.9}});
}
function line(slide,x1,y1,x2,y2,color=C.line,width=1) {
  slide.addShape(S.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color,width}});
}
function tx(slide,text,x,y,w,h,size=22,color=C.white,bold=false,extra={}) {
  slide.addText(text,{x,y,w,h,fontFace:'Arial',fontSize:size,color,bold,margin:0,breakLine:false,fit:'shrink',valign:'mid',...extra});
}
function base(n,label='EDUCACIÓN QUE SE QUEDA') {
  const s=pptx.addSlide();
  s.background={color:C.bg};
  s.addShape(S.rect,{x:0,y:0,w:0.11,h:H,fill:{color:C.orange},line:{color:C.orange}});
  tx(s,'T1GER',0.55,0.34,1.5,0.36,18,C.white,true,{charSpacing:2.2});
  tx(s,label,9.0,0.4,3.72,0.22,8.5,C.quiet,true,{align:'right',charSpacing:2.2});
  line(s,0.55,6.98,12.82,6.98,C.line,0.8);
  tx(s,'LEARN IT.  APPLY IT.  MASTER IT.',0.55,7.08,5.0,0.18,8,C.quiet,true,{charSpacing:1.6});
  tx(s,String(n).padStart(2,'0'),12.25,7.07,0.55,0.2,9,C.quiet,true,{align:'right'});
  return s;
}
function tag(slide,text,x,y,w=2.2) {
  tx(slide,text,x,y,w,0.24,10,C.orange,true,{charSpacing:1.4});
}
function heading(slide,text,y=1.08,size=37,h=1.0) {
  tx(slide,text,0.7,y,11.95,h,size,C.white,true,{breakLine:false});
}

// 01 — Promise
{
  const s=base(1,'LA TESIS');
  tag(s,'T1GER / SISTEMA EDUCATIVO',0.72,1.15,4.1);
  tx(s,'Lo mejor de internet,',0.7,1.72,10.9,0.72,49,C.white,true);
  tx(s,'convertido en aprendizaje real.',0.7,2.46,11.95,0.85,48,C.orange,true);
  tx(s,'Seleccionamos conocimiento fiable. Lo convertimos en decisiones prácticas. Lo hacemos volver cuando hace falta recordarlo.',0.75,3.68,10.75,0.85,22,C.muted,false,{breakLine:false});
  s.addShape(S.ellipse,{x:9.3,y:4.45,w:2.35,h:2.35,fill:{color:C.bg,transparency:100},line:{color:C.orange,width:2.2}});
  s.addShape(S.ellipse,{x:9.78,y:4.94,w:1.37,h:1.37,fill:{color:C.orange},line:{color:C.orange}});
  tx(s,'1',10.11,5.05,0.7,0.9,53,C.bg,true,{align:'center'});
  tx(s,'De información a capacidad.',0.74,5.4,7.7,0.5,26,C.white,true);
}

// 02 — Problem
{
  const s=base(2,'EL PROBLEMA');
  tag(s,'UNA BRECHA REAL',0.72,1.1);
  heading(s,'Internet informa. Aprender exige más.',1.47,39,0.7);
  tx(s,'El valor no está en acumular contenido, sino en saber qué hacer con él.',0.72,2.25,11.5,0.52,20,C.muted);
  const cards=[
    ['01','Ruido','Fuentes de calidad y opiniones mezcladas en el mismo feed.'],
    ['02','Pasividad','Ver un vídeo no demuestra que puedas tomar una decisión.'],
    ['03','Olvido','Sin recuperar una idea después, es difícil conservarla.'],
  ];
  cards.forEach((c,i)=>{
    const x=0.72+i*4.17;
    box(s,x,3.23,3.8,2.7);
    tx(s,c[0],x+0.28,3.55,0.65,0.39,19,C.orange,true);
    tx(s,c[1],x+0.28,4.1,3.1,0.48,27,C.white,true);
    tx(s,c[2],x+0.28,4.75,3.22,0.79,16,C.muted);
  });
}

// 03 — Curation
{
  const s=base(3,'EL FILTRO T1GER');
  tag(s,'CURADURÍA + DISEÑO ORIGINAL',0.72,1.06,4.5);
  heading(s,'Tomamos buenas fuentes. Construimos mejores experiencias.',1.42,34,0.93);
  const steps=[
    {n:'01',a:'Seleccionar',b:'Fuentes primarias y conocimiento útil.',c:'SEC · CFPB'},
    {n:'02',a:'Verificar',b:'Qué afirma cada fuente, supuestos y límites.',c:'EVIDENCIA TRAZABLE'},
    {n:'03',a:'Transformar',b:'Una lección original alrededor de una decisión.',c:'PREDICCIÓN + MODELO'},
    {n:'04',a:'Revisar',b:'Fecha de revisión y conceptos que deben actualizarse.',c:'CONTROL DE CALIDAD'},
  ];
  steps.forEach((d,i)=>{
    const x=0.69+i*3.15;
    box(s,x,2.88,2.9,2.65);
    tx(s,d.n,x+0.22,3.13,0.6,0.35,18,C.orange,true);
    tx(s,d.a,x+0.22,3.64,2.45,0.4,22,C.white,true);
    tx(s,d.b,x+0.22,4.15,2.45,0.72,14.5,C.muted);
    tx(s,d.c,x+0.22,5.05,2.43,0.19,8,C.light,true,{charSpacing:1});
    if(i<3) tx(s,'→',x+2.92,3.8,0.22,0.38,19,C.orange,true,{align:'center'});
  });
  tx(s,'Ejemplo real: “Cash loses too” une el riesgo de inflación (SEC) con el papel del fondo de emergencia (CFPB).',0.72,5.95,11.85,0.5,16,C.white);
}

// 04 — Learning loop
{
  const s=base(4,'EL MÉTODO');
  tag(s,'UNA IDEA → UNA DECISIÓN → UNA MEMORIA',0.72,1.07,5.6);
  heading(s,'Learn it. Apply it. Master it.',1.45,43,0.75);
  const items=[
    {n:'01',title:'LEARN',verb:'Entender',body:'Predices, exploras el modelo y ves la evidencia con sus límites.',example:'¿Qué pasa con el poder de compra del efectivo?'},
    {n:'02',title:'APPLY',verb:'Decidir',body:'Transformas el concepto en una regla para una situación concreta.',example:'Define para qué sirve tu reserva de efectivo.'},
    {n:'03',title:'MASTER',verb:'Recordar',body:'Recuperas la idea después y la fortaleces con repasos espaciados.',example:'Explica por qué guardar efectivo aún puede ser útil.'},
  ];
  items.forEach((d,i)=>{
    const x=0.71+i*4.19;
    box(s,x,2.75,3.8,3.43,i===1?'211912':C.panel,i===1?C.orange:C.line);
    tx(s,d.n,x+0.27,3.03,0.6,0.33,19,C.orange,true);
    tx(s,d.title,x+0.27,3.5,2.8,0.38,26,C.white,true,{charSpacing:1.1});
    tx(s,d.verb,x+0.27,3.99,2.9,0.33,17,C.light,true);
    tx(s,d.body,x+0.27,4.42,3.22,0.68,15.2,C.muted);
    line(s,x+0.27,5.27,x+3.52,5.27,C.line,0.8);
    tx(s,d.example,x+0.27,5.42,3.19,0.52,12.6,C.white,false,{italic:true});
  });
}

// 05 — Evidence, carefully scoped
{
  const s=base(5,'POR QUÉ PUEDE FUNCIONAR');
  tag(s,'DISEÑO INFORMADO POR INVESTIGACIÓN',0.72,1.04,5.2);
  heading(s,'Diseñado para participar y volver.',1.43,40,0.75);
  box(s,0.72,2.63,5.85,3.62);
  box(s,6.77,2.63,5.85,3.62);
  tx(s,'01  APRENDIZAJE ACTIVO',1.02,2.94,5.2,0.31,15,C.orange,true,{charSpacing:1.2});
  tx(s,'Hacer antes de recibir la respuesta.',1.02,3.49,5.13,0.78,27,C.white,true);
  tx(s,'T1GER pide una predicción y una decisión. La investigación sobre aprendizaje activo respalda la participación frente a la escucha pasiva; el estudio citado se realizó en cursos STEM universitarios.',1.02,4.45,5.08,1.32,16,C.muted);
  tx(s,'02  RECUPERACIÓN + ESPACIADO',7.07,2.94,5.2,0.31,15,C.orange,true,{charSpacing:1.2});
  tx(s,'Volver a sacar la idea de la memoria.',7.07,3.49,5.13,0.78,27,C.white,true);
  tx(s,'El repaso mediante preguntas y la práctica distribuida figuran entre las técnicas de mayor utilidad en una revisión amplia. T1GER las incorpora en Master.',7.07,4.45,5.08,1.32,16,C.muted);
  tx(s,'La evidencia apoya el diseño pedagógico; todavía no demuestra resultados superiores de T1GER frente a otros productos.',0.75,6.43,11.8,0.28,10.5,C.quiet);
}

// 06 — Closing + compact references
{
  const s=base(6,'LA PROPUESTA');
  tag(s,'NUESTRA AMBICIÓN',0.72,1.03,3.0);
  tx(s,'La educación más útil',0.7,1.58,11.85,0.69,45,C.white,true);
  tx(s,'no se encuentra. Se construye.',0.7,2.3,11.85,0.69,45,C.orange,true);
  tx(s,'Fuentes fiables  ×  experiencias activas  ×  memoria que vuelve.',0.74,3.45,11.75,0.56,23,C.white,true);
  box(s,0.72,4.35,11.9,0.96,C.panel2,C.orange);
  tx(s,'T1GER convierte conocimiento público de calidad en criterio que una persona puede usar.',1.02,4.6,11.28,0.44,21,C.white,true);
  tx(s,'Base actual: 2 lecciones web de Smart Money auditadas. La eficacia del producto con usuarios reales está por medir.',0.75,5.59,11.75,0.36,11.5,C.muted);
  tx(s,'FUENTES',0.75,6.13,1.18,0.2,8.8,C.orange,true,{charSpacing:1.3});
  tx(s,'SEC Investor.gov · CFPB · Freeman et al., PNAS (2014) · Dunlosky et al., APS (2013)',1.68,6.1,10.8,0.23,9.4,C.muted);
  const links=[
    ['SEC', 'https://www.investor.gov/introduction-investing/investing-basics/what-risk'],
    ['CFPB', 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/'],
    ['Freeman et al.', 'https://doi.org/10.1073/pnas.1319030111'],
    ['Dunlosky et al.', 'https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html'],
  ];
  links.forEach((p,i)=>tx(s,p[0],0.75+i*2.62,6.45,2.3,0.21,8.8,C.quiet,false,{hyperlink:{url:p[1]}}));
}

pptx.writeFile({fileName:out});
