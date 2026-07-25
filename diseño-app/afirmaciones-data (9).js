<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="card-data-oscura.js"></script>
<script src="oraculo-data.js"></script>
<script src="codigos-data.js"></script>
<script src="vibra-data.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0720;font-family:'Hanken Grotesk',sans-serif}
a{color:#e7cf9b}a:hover{color:#f3ecdc}
@keyframes paPulse{0%,100%{opacity:.55}50%{opacity:1}}
.pa-scroll::-webkit-scrollbar{display:none}
</style>
</helmet>
<div style="position:relative;height:100vh;width:100%;display:flex;justify-content:center;background:#0a0720;overflow:hidden">
<div style="position:relative;width:100%;max-width:430px;height:100vh;display:flex;flex-direction:column">

  <div class="pa-scroll" style="flex:1;overflow-y:auto;overflow-x:hidden">
    <sc-if value="{{ isCamino }}" hint-placeholder-val="{{ true }}">
      <div data-screen-label="Mi Camino" style="position:relative;min-height:100%;background:radial-gradient(135% 80% at 50% -10%, #241a4f 0%, #150d34 46%, #0a0720 100%);padding:26px 22px 40px">
        <div style="position:absolute;inset:0;pointer-events:none;opacity:.7;background-image:radial-gradient(1.4px 1.4px at 12% 8%,rgba(255,255,255,.9),transparent),radial-gradient(1px 1px at 28% 18%,rgba(231,207,155,.7),transparent),radial-gradient(1.4px 1.4px at 62% 6%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 82% 14%,rgba(205,189,242,.8),transparent),radial-gradient(1px 1px at 92% 30%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 44% 40%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 6% 56%,rgba(231,207,155,.6),transparent),radial-gradient(1px 1px at 24% 82%,rgba(255,255,255,.5),transparent)"></div>
        <div style="position:relative">

          <div style="display:flex;align-items:center;gap:14px;margin-top:4px">
            <div style="{{ logoStyle }}"></div>
            <div style="flex:1">
              <div style="font-size:10.5px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:rgba(205,189,242,.6)">Prisma Azul</div>
              <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:32px;color:#e7cf9b;line-height:1.05;margin-top:2px">Mi Camino</div>
            </div>
            <div style="font-size:11px;color:rgba(205,189,242,.55);text-align:right;line-height:1.4">{{ hoyLabel }}</div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px;align-items:stretch">

            <div style="position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(231,207,155,.45);background:linear-gradient(150deg,#241a4f,#150d34 75%);display:flex;flex-direction:column">
              <div style="{{ vibraHalo }}"></div>
              <div style="position:relative;display:flex;flex-direction:column;flex:1;padding:14px 14px 12px">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                  <div style="{{ vibraCircleStyle }}"><span style="{{ vibraSymbolStyle }}">{{ vibraSimbolo }}</span></div>
                  <div style="font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(205,189,242,.55);text-align:right;line-height:1.4">Tu día más alto<br>esta semana</div>
                </div>
                <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:28px;color:#e7cf9b;line-height:1.05;margin-top:10px">{{ vibraDia }}</div>
                <div style="{{ vibraTituloStyle }}">{{ vibraTitulo }}</div>
                <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14.5px;line-height:1.4;color:rgba(243,236,220,.9);margin-top:8px;text-wrap:pretty">“{{ vibraMsg }}”</div>
                <div style="flex:1"></div>
                <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(205,189,242,.5);margin-top:10px;padding-top:9px;border-top:1px solid rgba(205,189,242,.16)">{{ vibraPlaneta }}</div>
              </div>
            </div>

            <div onClick="{{ goAfirmaciones }}" style="position:relative;border-radius:20px;border:1px solid rgba(231,207,155,.28);background:rgba(21,13,52,.55);box-shadow:inset 3px 0 0 #e79ab4;padding:14px;cursor:pointer;display:flex;flex-direction:column">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <div style="{{ afirmIconStyle }}"></div>
                <div style="{{ afirmPillStyle }}">{{ afirmPillLabel }}</div>
              </div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,189,242,.6);margin-top:9px">Afirmación</div>
              <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:16.5px;line-height:1.35;color:#f3ecdc;margin-top:7px;text-wrap:pretty">{{ afirmTexto }}</div>
              <sc-if value="{{ afirmNombre }}" hint-placeholder-val="{{ false }}">
                <div style="font-size:10.5px;font-weight:600;color:rgba(231,154,180,.85);margin-top:6px;letter-spacing:.08em;text-transform:uppercase">{{ afirmNombre }}</div>
              </sc-if>
              <div style="flex:1"></div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:9px;border-top:1px solid rgba(205,189,242,.16)">
                <span style="font-size:11.5px;font-weight:600;color:rgba(231,207,155,.9)">{{ afirmCta }}</span>
                <span style="font-family:'Cormorant Garamond',serif;font-size:20px;color:rgba(231,207,155,.7);line-height:.8">›</span>
              </div>
            </div>

            <div onClick="{{ goCodigos }}" style="position:relative;border-radius:20px;border:1px solid rgba(231,207,155,.28);background:rgba(21,13,52,.55);box-shadow:inset 3px 0 0 #ecc874;padding:14px;cursor:pointer;display:flex;flex-direction:column">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <div style="{{ codIconStyle }}"></div>
                <div style="{{ codPillStyle }}">{{ codPillLabel }}</div>
              </div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,189,242,.6);margin-top:9px">Código sagrado</div>
              <sc-if value="{{ hasCod }}" hint-placeholder-val="{{ false }}">
                <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:36px;letter-spacing:.08em;color:#ecc874;line-height:1.1;margin-top:6px;text-shadow:0 0 18px rgba(236,200,116,.4)">{{ codNum }}</div>
                <div style="font-size:10.5px;font-weight:600;color:rgba(236,200,116,.8);letter-spacing:.08em;text-transform:uppercase;margin-top:2px">{{ codCat }}</div>
                <div style="font-size:11.5px;line-height:1.5;color:rgba(205,189,242,.75);margin-top:7px">{{ codDesc }}</div>
              </sc-if>
              <sc-if value="{{ noCod }}" hint-placeholder-val="{{ true }}">
                <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:17px;line-height:1.3;color:#f3ecdc;margin-top:7px">Aún no has activado un código</div>
                <div style="font-size:11.5px;line-height:1.5;color:rgba(205,189,242,.75);margin-top:6px">Un número sagrado para repetir toda la semana.</div>
              </sc-if>
              <div style="flex:1"></div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:9px;border-top:1px solid rgba(205,189,242,.16)">
                <span style="font-size:11.5px;font-weight:600;color:rgba(231,207,155,.9)">{{ codCta }}</span>
                <span style="font-family:'Cormorant Garamond',serif;font-size:20px;color:rgba(231,207,155,.7);line-height:.8">›</span>
              </div>
            </div>

            <div onClick="{{ goOraculo }}" style="position:relative;border-radius:20px;border:1px solid rgba(231,207,155,.28);background:rgba(21,13,52,.55);box-shadow:inset 3px 0 0 #cdbdf2;padding:14px;cursor:pointer;display:flex;flex-direction:column">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <div style="{{ oraIconStyle }}"></div>
                <div style="{{ oraPillStyle }}">{{ oraPillLabel }}</div>
              </div>
              <div style="font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,189,242,.6);margin-top:9px">Oráculo del día</div>
              <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:17px;line-height:1.3;color:#f3ecdc;margin-top:7px;text-wrap:pretty">{{ oraTitulo }}</div>
              <div style="font-size:11.5px;line-height:1.5;color:rgba(205,189,242,.75);margin-top:6px">{{ oraBody }}</div>
              <div style="flex:1"></div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:9px;border-top:1px solid rgba(205,189,242,.16)">
                <span style="font-size:11.5px;font-weight:600;color:rgba(231,207,155,.9)">{{ oraCta }}</span>
                <span style="font-family:'Cormorant Garamond',serif;font-size:20px;color:rgba(231,207,155,.7);line-height:.8">›</span>
              </div>
            </div>

          </div>

          <div onClick="{{ goCruz }}" style="position:relative;border-radius:20px;border:1px solid rgba(231,207,155,.35);background:linear-gradient(150deg,rgba(42,31,87,.75),rgba(21,13,52,.6));box-shadow:inset 3px 0 0 #e79ab4;padding:18px 16px 16px;cursor:pointer;margin-top:12px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="{{ cruzIconStyle }}"></div>
              <div style="flex:1;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,189,242,.6)">Cruz de Vida · Mensual</div>
              <div style="{{ cruzPillStyle }}">{{ cruzPillLabel }}</div>
            </div>
            <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:22px;color:#f3ecdc;margin-top:11px;line-height:1.2">{{ cruzTitulo }}</div>
            <div style="font-size:12.5px;line-height:1.55;color:rgba(205,189,242,.75);margin-top:5px">{{ cruzBody }}</div>
            <div style="display:flex;gap:10px;margin-top:14px">
              <div style="flex:1;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0d488,#ecc874 55%,#d9ab55);color:#1c1338;font-weight:700;font-size:13.5px">Ir a la Cruz</div>
              <div onClick="{{ openPaywall }}" style="flex:1;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(231,207,155,.4);color:#e7cf9b;font-weight:600;font-size:13.5px">Más lecturas</div>
            </div>
            <div style="font-size:11px;color:rgba(205,189,242,.5);margin-top:10px;text-align:center">{{ cruzUso }}</div>
          </div>

          <div onClick="{{ goBaraja }}" style="display:flex;align-items:center;gap:15px;margin-top:12px;padding:16px;border-radius:20px;cursor:pointer;border:1px solid rgba(231,207,155,.28);background:rgba(21,13,52,.55);box-shadow:inset 3px 0 0 #8db0ec">
            <div style="{{ barajaIconStyle }}"></div>
            <div style="flex:1">
              <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;line-height:1.15;color:#f3ecdc">La Baraja</div>
              <div style="font-size:12px;color:rgba(205,189,242,.68);margin-top:3px">Los significados de las 40 cartas · Siempre disponible</div>
            </div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:rgba(231,207,155,.7);line-height:.8">›</div>
          </div>

          <div style="text-align:center;font-size:11.5px;color:rgba(205,189,242,.45);margin-top:24px">Nuevos rituales llegarán con las próximas lunas ✦</div>
        </div>
      </div>
    </sc-if>

    <sc-if value="{{ isCruz }}" hint-placeholder-val="{{ false }}">
      <div style="background:#0a0720"><dc-import name="Cruz de Vida" on-exit="{{ goHome }}" hint-size="100%,900px"></dc-import></div>
    </sc-if>
    <sc-if value="{{ isOraculo }}" hint-placeholder-val="{{ false }}">
      <div style="background:#0a0720"><dc-import name="Oráculo" on-exit="{{ goHome }}" hint-size="100%,900px"></dc-import></div>
    </sc-if>
    <sc-if value="{{ isCodigos }}" hint-placeholder-val="{{ false }}">
      <div style="background:#0a0720"><dc-import name="Códigos Sagrados" on-exit="{{ goHome }}" hint-size="100%,900px"></dc-import></div>
    </sc-if>
    <sc-if value="{{ isAfirmaciones }}" hint-placeholder-val="{{ false }}">
      <div style="background:#0a0720"><dc-import name="Afirmaciones" on-exit="{{ goHome }}" hint-size="100%,900px"></dc-import></div>
    </sc-if>
    <sc-if value="{{ isBaraja }}" hint-placeholder-val="{{ false }}">
      <div style="background:#0a0720"><dc-import name="Significados" on-exit="{{ goHome }}" hint-size="100%,900px"></dc-import></div>
    </sc-if>
  </div>

  <sc-if value="{{ showPaywall }}" hint-placeholder-val="{{ false }}">
    <div style="position:fixed;inset:0;z-index:60;background:rgba(8,5,22,.75);backdrop-filter:blur(6px)" onClick="{{ closePaywall }}"></div>
    <div style="position:fixed;left:50%;bottom:0;transform:translateX(-50%);z-index:61;width:100%;max-width:430px;border-radius:26px 26px 0 0;background:linear-gradient(180deg,#241a4f,#150d34 70%);border:1px solid rgba(231,207,155,.3);border-bottom:none;padding:26px 24px 34px">
      <div style="width:38px;height:4px;border-radius:99px;background:rgba(205,189,242,.35);margin:0 auto 18px"></div>
      <h3 style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:27px;color:#e7cf9b;text-align:center">Desbloquear más lecturas</h3>
      <p style="font-size:13px;line-height:1.6;color:rgba(205,189,242,.75);text-align:center;margin-top:8px">La Cruz de Vida se abre una vez al mes.<br>Puedes recibir hasta dos lecturas adicionales.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px">
        <sc-for list="{{ payOpts }}" as="p" hint-placeholder-count="2">
          <div onClick="{{ p.onPick }}" style="{{ p.style }}">
            <div style="{{ p.dotStyle }}"></div>
            <div style="flex:1">
              <div style="font-size:15px;font-weight:600;color:#f3ecdc">{{ p.titulo }}</div>
              <div style="font-size:12px;color:rgba(205,189,242,.65);margin-top:2px">{{ p.sub }}</div>
            </div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:#ecc874">{{ p.precio }}</div>
          </div>
        </sc-for>
      </div>
      <div style="font-size:11.5px;color:rgba(205,189,242,.5);text-align:center;margin-top:12px">Máximo 3 lecturas por mes · Pago único</div>
      <div onClick="{{ comprar }}" style="{{ comprarStyle }}">Continuar</div>
      <div onClick="{{ closePaywall }}" style="height:46px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(205,189,242,.7);font-size:13.5px;font-weight:500;margin-top:4px">Quizá después</div>
    </div>
  </sc-if>

  <sc-if value="{{ toast }}" hint-placeholder-val="{{ false }}">
    <div style="position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:80;background:rgba(21,13,52,.95);border:1px solid rgba(231,207,155,.5);border-radius:999px;padding:12px 20px;font-size:13px;color:#f3ecdc;box-shadow:0 12px 30px rgba(0,0,0,.5);white-space:nowrap">{{ toast }}</div>
  </sc-if>

</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:&quot;430px&quot;,&quot;height&quot;:&quot;930px&quot;}}">
class Component extends DCLogic {
  state = { vista:'camino', showPaywall:false, payPick:null, now:Date.now(), toast:null };
  timers = [];
  componentDidMount() {
    if (typeof window !== 'undefined' && (!window.CARD_OSCURA || !window.VIBRA_DIAS || !window.ORACULO_DATA || !window.CODIGOS_DATA)) {
      const t = setInterval(() => { if (window.CARD_OSCURA && window.VIBRA_DIAS && window.ORACULO_DATA && window.CODIGOS_DATA) { clearInterval(t); this.forceUpdate(); } }, 60);
      setTimeout(() => clearInterval(t), 4000);
    }
    this.tick = setInterval(() => { if (this.state.vista==='camino') this.setState({now:Date.now()}); }, 1000);
  }
  componentWillUnmount() { clearInterval(this.tick); this.timers.forEach(clearTimeout); }
  after(ms, fn) { this.timers.push(setTimeout(fn, ms)); }
  ls(k) { try { return localStorage.getItem(k); } catch(e){ return null; } }
  lsj(k) { try { return JSON.parse(localStorage.getItem(k)||'null'); } catch(e){ return null; } }
  ym() { const d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1); }
  fmt(ms) {
    if (ms<=0) return 'ahora';
    const d=Math.floor(ms/86400000), h=Math.floor(ms%86400000/3600000), m=Math.floor(ms%3600000/60000), s=Math.floor(ms%60000/1000);
    return d>0 ? d+' d '+h+' h' : h>0 ? h+' h '+String(m).padStart(2,'0')+' m' : m+' m '+String(s).padStart(2,'0')+' s';
  }
  snip(s, n) { s = s||''; return s.length>n ? s.slice(0, n-1).replace(/\s+\S*$/,'')+'…' : s; }
  emblemStyle(palo, size, extra) {
    const CO = (typeof window!=='undefined' && window.CARD_OSCURA) || {};
    const uri = CO[palo] || '';
    return uri ? Object.assign({width:size,height:size,backgroundImage:'url("'+uri+'")',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center'}, extra||{}) : {display:'none'};
  }
  pillParts(locked, label) {
    return { label, style: {fontSize:'10px', fontWeight:600, borderRadius:'999px', padding:'4px 9px', whiteSpace:'nowrap', flex:'0 0 auto',
      color: locked ? 'rgba(205,189,242,.75)' : '#1c1338',
      border: locked ? '1px solid rgba(205,189,242,.35)' : 'none',
      background: locked ? 'transparent' : 'linear-gradient(135deg,#f0d488,#d9ab55)'} };
  }
  renderVals() {
    const st = this.state, now = st.now;
    const OD = (typeof window!=='undefined' && window.ORACULO_DATA) || {oraculos:[]};
    const CD = (typeof window!=='undefined' && window.CODIGOS_DATA) || {categorias:[]};

    // — Día que vibras más alto (aleatorio, fijo por semana) —
    const mon = new Date(now); mon.setHours(0,0,0,0); mon.setDate(mon.getDate() - ((mon.getDay()+6)%7));
    const weekKey = mon.getFullYear()+'-'+(mon.getMonth()+1)+'-'+mon.getDate();
    let vj = this.lsj('pa_vibra');
    if (!vj || vj.week !== weekKey) { vj = {week:weekKey, idx:Math.floor(Math.random()*7)}; try{localStorage.setItem('pa_vibra', JSON.stringify(vj));}catch(e){} }
    const vd = ((typeof window!=='undefined' && window.VIBRA_DIAS) || [])[vj.idx] || {};
    const vColor = vd.color || '#e7cf9b';

    // — Afirmación —
    const aLast = this.lsj('pa_afirmacion_last');
    const aLock = Math.max(0, Number(this.ls('pa_afirmacion_lock')||0) - now);
    const aPill = aLock>0 ? this.pillParts(true,'Nueva en '+this.fmt(aLock)) : this.pillParts(false,'Disponible');
    let afirmTexto = 'Aún no has recibido tu palabra del día.', afirmNombre = '', afirmCta = 'Recibir la mía';
    if (aLast && aLast.texto) {
      const larga = aLast.texto.length > 150;
      afirmTexto = '“'+(larga ? this.snip(aLast.texto, 120) : aLast.texto)+'”';
      afirmNombre = aLast.nombre || '';
      afirmCta = larga ? 'Leer completa' : (aLock>0 ? 'Ver afirmaciones' : 'Recibir una nueva');
    }

    // — Código sagrado —
    const cAct = this.lsj('pa_codigo_activo');
    const cLock = Math.max(0, (cAct ? Number(cAct.unlockAt||0) : 0) - now);
    const cPill = cLock>0 ? this.pillParts(true,'Nuevo en '+this.fmt(cLock)) : this.pillParts(false,'Disponible');
    let codNum='', codCat='', codDesc='';
    if (cAct) { const cat = CD.categorias.find(k=>k.key===cAct.cat); const code = cat && (cat.codigos||[])[cAct.idx];
      if (code) { codNum = code.c; codCat = cat.nombre; codDesc = this.snip(code.p, 95); } }

    // — Oráculo —
    const oLast = this.lsj('pa_oraculo_last');
    const oLock = Math.max(0, Number(this.ls('pa_oraculo_lock')||0) - now);
    const oPill = oLock>0 ? this.pillParts(true,'Nuevo en '+this.fmt(oLock)) : this.pillParts(false,'Disponible');
    let oraTitulo='Aún no has pedido tu oráculo', oraBody='Tres mensajes que tu alma necesita, cada 24 horas.', oraCta='Recibir mi oráculo';
    if (oLast) { const oo = OD.oraculos.find(x=>x.key===oLast.key);
      oraTitulo = 'Tu último oráculo te espera'+(oo ? ' · '+oo.nombre : '');
      oraBody = 'Toca para volver a leer tus tres mensajes.';
      oraCta = oLock>0 ? 'Ver mi último oráculo' : 'Recibir uno nuevo'; }

    // — Cruz de Vida —
    const cruzLast = this.lsj('pa_cruz_last');
    const mes = this.lsj('pa_cruz_mes'); const enMes = mes && mes.ym===this.ym();
    const usadas = enMes && mes.usadas!=null ? mes.usadas : 0;
    const compradas = enMes ? (mes.compradas||0) : 0;
    const hasLect = usadas < 1+compradas;
    const cruzNextMs = Math.max(0, Number(this.ls('pa_cruz_next')||0) - now);
    const cruzPill = hasLect ? this.pillParts(false,'Disponible') : this.pillParts(true, cruzNextMs>0 ? 'Gratis en '+this.fmt(cruzNextMs) : 'Sin lecturas');
    const cruzTitulo = cruzLast ? 'Tu última lectura te espera' : 'Aún no tienes lecturas guardadas';
    const cruzBody = cruzLast
      ? 'Toca para volver a leerla · '+new Date(cruzLast.fecha).toLocaleDateString('es-MX',{day:'numeric',month:'long'})
      : 'Haz tu pregunta y deja que la cruz te responda.';

    const payOpts = [
      {n:1, titulo:'1 lectura adicional', sub:'Una pregunta más este mes', precio:'$49'},
      {n:2, titulo:'2 lecturas adicionales', sub:'Completa tus 3 lecturas del mes', precio:'$79'},
    ].map(o => ({ ...o,
      onPick: (e)=>{ if(e&&e.stopPropagation) e.stopPropagation(); this.setState({payPick:o.n}); },
      dotStyle: {width:'18px', height:'18px', borderRadius:'50%', flex:'0 0 auto', border:'2px solid rgba(231,207,155,.6)',
        background: st.payPick===o.n ? 'radial-gradient(circle, #ecc874 45%, transparent 52%)' : 'transparent'},
      style: {display:'flex', alignItems:'center', gap:'13px', padding:'14px 15px', borderRadius:'16px', cursor:'pointer',
        border:'1px solid rgba(231,207,155,'+(st.payPick===o.n?'.75':'.25')+')',
        background: st.payPick===o.n ? 'rgba(236,200,116,.08)' : 'rgba(21,13,52,.5)', transition:'all .2s ease'} }));

    return {
      isCamino: st.vista==='camino', isCruz: st.vista==='cruz', isOraculo: st.vista==='oraculo',
      isCodigos: st.vista==='codigos', isAfirmaciones: st.vista==='afirmaciones', isBaraja: st.vista==='baraja',
      logoStyle: this.emblemStyle('corona', '46px', {flex:'0 0 auto', filter:'drop-shadow(0 0 14px rgba(236,200,116,.5))'}),
      hoyLabel: new Date(now).toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'short'}),

      vibraDia: vd.dia||'', vibraTitulo: vd.titulo||'', vibraMsg: vd.msg||'', vibraPlaneta: vd.planeta||'', vibraSimbolo: vd.simbolo||'',
      vibraHalo: {position:'absolute', left:'-40px', top:'-50px', width:'190px', height:'190px', borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle, '+vColor+'2e 0%, transparent 65%)'},
      vibraCircleStyle: {width:'46px', height:'46px', borderRadius:'50%', flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'center',
        border:'1px solid '+vColor+'88', background:'rgba(10,7,32,.5)', boxShadow:'0 0 18px '+vColor+'44'},
      vibraSymbolStyle: {fontFamily:"'Cormorant Garamond',serif", fontSize:'26px', lineHeight:1, color:vColor, textShadow:'0 0 12px '+vColor+'99'},
      vibraTituloStyle: {fontSize:'9.5px', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:vColor, marginTop:'4px'},

      afirmIconStyle: this.emblemStyle('copas', '22px', {flex:'0 0 auto', filter:'drop-shadow(0 0 7px rgba(231,154,180,.5))'}),
      afirmPillLabel: aPill.label, afirmPillStyle: aPill.style,
      afirmTexto, afirmNombre: afirmNombre ? 'Afirmación de '+afirmNombre : '', afirmCta,

      codIconStyle: this.emblemStyle('oros', '22px', {flex:'0 0 auto', filter:'drop-shadow(0 0 7px rgba(236,200,116,.5))'}),
      codPillLabel: cPill.label, codPillStyle: cPill.style,
      hasCod: !!codNum, noCod: !codNum, codNum, codCat, codDesc,
      codCta: codNum && cLock>0 ? 'Ver mi código' : 'Activar un código',

      oraIconStyle: this.emblemStyle('bastos', '22px', {flex:'0 0 auto', filter:'drop-shadow(0 0 7px rgba(205,189,242,.5))'}),
      oraPillLabel: oPill.label, oraPillStyle: oPill.style,
      oraTitulo, oraBody, oraCta,

      cruzIconStyle: this.emblemStyle('copas', '24px', {flex:'0 0 auto', filter:'drop-shadow(0 0 7px rgba(231,154,180,.5))'}),
      cruzPillLabel: cruzPill.label, cruzPillStyle: cruzPill.style,
      cruzTitulo, cruzBody,
      cruzUso: usadas+' de '+(1+compradas)+' lecturas usadas este mes · Máximo 3',

      barajaIconStyle: this.emblemStyle('espadas', '40px', {flex:'0 0 auto', filter:'drop-shadow(0 0 9px rgba(141,176,236,.5))'}),

      goCruz: () => this.setState({vista:'cruz'}),
      goOraculo: () => this.setState({vista:'oraculo'}),
      goCodigos: () => this.setState({vista:'codigos'}),
      goAfirmaciones: () => this.setState({vista:'afirmaciones'}),
      goBaraja: () => this.setState({vista:'baraja'}),
      goHome: () => this.setState({vista:'camino', now:Date.now()}),
      showPaywall: st.showPaywall, payOpts,
      openPaywall: (e) => { if(e&&e.stopPropagation) e.stopPropagation(); this.setState({showPaywall:true, payPick:null}); },
      closePaywall: () => this.setState({showPaywall:false}),
      comprarStyle: {marginTop:'16px', height:'52px', borderRadius:'999px', display:'flex', alignItems:'center', justifyContent:'center',
        cursor: st.payPick?'pointer':'default',
        background: st.payPick?'linear-gradient(135deg,#f0d488,#ecc874 55%,#d9ab55)':'rgba(205,189,242,.14)',
        color: st.payPick?'#1c1338':'rgba(205,189,242,.4)', fontWeight:700, fontSize:'15px', transition:'all .25s ease'},
      comprar: () => {
        const p = this.state.payPick; if (!p) return;
        const m2 = this.lsj('pa_cruz_mes'); const en2 = m2 && m2.ym===this.ym();
        const nuevo = {ym:this.ym(), usadas: en2 ? m2.usadas : null, compradas: Math.min(2, (en2?(m2.compradas||0):0) + p)};
        try { localStorage.setItem('pa_cruz_mes', JSON.stringify(nuevo)); } catch(e){}
        this.setState({showPaywall:false, toast:'🌙 Lecturas añadidas a tu mes'});
        this.after(2400, ()=>this.setState({toast:null}));
      },
      toast: st.toast,
    };
  }
}
</script>
</body>
</html>
