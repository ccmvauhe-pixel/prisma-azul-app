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
<script src="codigos-data.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0720;font-family:'Hanken Grotesk',sans-serif}
a{color:#e7cf9b}a:hover{color:#f3ecdc}
@keyframes csShufA{0%,100%{transform:translate(-50%,0) rotate(0deg)}25%{transform:translate(calc(-50% - 40px),-6px) rotate(-11deg)}75%{transform:translate(calc(-50% + 34px),4px) rotate(8deg)}}
@keyframes csShufB{0%,100%{transform:translate(-50%,0) rotate(0deg)}25%{transform:translate(calc(-50% + 40px),5px) rotate(10deg)}75%{transform:translate(calc(-50% - 34px),-5px) rotate(-9deg)}}
@keyframes csPulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes csGlow{0%,100%{box-shadow:0 0 18px rgba(236,200,116,.35)}50%{box-shadow:0 0 36px rgba(236,200,116,.7)}}
.cs-scroll::-webkit-scrollbar{display:none}
</style>
</helmet>
<div style="position:relative;min-height:100vh;width:100%;display:flex;justify-content:center;background:radial-gradient(135% 80% at 50% -10%, #241a4f 0%, #150d34 46%, #0a0720 100%)">
<div style="position:absolute;inset:0;pointer-events:none;opacity:.7;background-image:radial-gradient(1.4px 1.4px at 12% 8%,rgba(255,255,255,.9),transparent),radial-gradient(1px 1px at 28% 18%,rgba(231,207,155,.7),transparent),radial-gradient(1.4px 1.4px at 62% 6%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 82% 14%,rgba(205,189,242,.8),transparent),radial-gradient(1px 1px at 92% 30%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 44% 40%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 6% 56%,rgba(231,207,155,.6),transparent),radial-gradient(1px 1px at 70% 66%,rgba(205,189,242,.5),transparent),radial-gradient(1px 1px at 24% 82%,rgba(255,255,255,.5),transparent)"></div>

<div class="cs-scroll" style="position:relative;width:100%;max-width:430px;min-height:100vh;display:flex;flex-direction:column;padding:18px 22px 34px">

  <header style="display:flex;align-items:center;gap:12px;padding:6px 0 2px">
    <div onClick="{{ goBack }}" style="width:44px;height:44px;margin-left:-10px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(231,207,155,.85);font-size:22px;font-family:'Cormorant Garamond',serif">‹</div>
    <div style="flex:1">
      <div style="font-size:11px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:rgba(205,189,242,.6)">Uno por semana</div>
      <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:26px;line-height:1.05;color:#e7cf9b">Código sagrado</div>
    </div>
    <div style="{{ pillStyle }}">{{ pillLabel }}</div>
  </header>

  <sc-if value="{{ isElegir }}" hint-placeholder-val="{{ true }}">
    <p style="text-align:center;font-size:14px;line-height:1.65;color:rgba(205,189,242,.78);max-width:330px;margin:22px auto 0">¿Qué buscas esta semana? El universo elegirá un solo código para ti: repítelo 45 veces al día durante toda la semana.</p>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:22px">
      <sc-for list="{{ categorias }}" as="c" hint-placeholder-count="5">
        <div onClick="{{ c.onPick }}" style="{{ c.style }}">
          <div style="{{ c.iconStyle }}"></div>
          <div style="flex:1">
            <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;line-height:1.15;color:#f3ecdc">{{ c.nombre }}</div>
            <div style="font-size:12px;color:rgba(205,189,242,.65);margin-top:3px;line-height:1.4">{{ c.sub }}</div>
          </div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:rgba(231,207,155,.7)">›</div>
        </div>
      </sc-for>
    </div>
    <div style="text-align:center;font-size:11.5px;color:rgba(205,189,242,.45);margin-top:18px">Un solo código a la vez: la constancia es el ritual ✦</div>
  </sc-if>

  <sc-if value="{{ isBarajar }}" hint-placeholder-val="{{ false }}">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:26px;color:#f3ecdc;text-align:center">{{ catNombre }}</div>
      <div style="position:relative;width:200px;height:230px;margin-top:36px">
        <sc-for list="{{ shuffleCards }}" as="s" hint-placeholder-count="8">
          <div style="{{ s.style }}">
            <div style="position:absolute;inset:0;opacity:.6;background-image:repeating-linear-gradient(45deg, rgba(231,207,155,.10) 0 2px, transparent 2px 9px), repeating-linear-gradient(-45deg, rgba(205,189,242,.08) 0 2px, transparent 2px 9px)"></div>
            <div style="position:absolute;inset:6px;border:1.5px solid rgba(231,207,155,.8);border-radius:7px"></div>
            <div style="{{ backEmblemStyle }}"></div>
          </div>
        </sc-for>
      </div>
      <div style="margin-top:34px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:rgba(231,207,155,.9);animation:csPulse 1.6s ease-in-out infinite">El universo elige tu código…</div>
      <div style="font-size:12.5px;color:rgba(205,189,242,.6);margin-top:8px">Concéntrate en lo que deseas atraer.</div>
    </div>
  </sc-if>

  <sc-if value="{{ isRevelar }}" hint-placeholder-val="{{ false }}">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center">
      <div style="margin:18px 0 4px;font-size:11px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(205,189,242,.55)">{{ catNombre }}</div>
      <h2 style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:30px;color:#e7cf9b;text-align:center">Tu código de la semana</h2>
      <div style="width:100%;max-width:340px;margin-top:24px;perspective:1000px">
        <div style="{{ flipInnerStyle }}">
          <div style="position:relative;backface-visibility:hidden;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,#2a1f57,#150d34 62%,#0b0726);border:1px solid rgba(231,207,155,.6);padding:30px 24px 26px;text-align:center">
            <div style="position:absolute;inset:0;opacity:.5;background-image:radial-gradient(1px 1px at 20% 24%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 76% 32%,rgba(231,207,155,.6),transparent),radial-gradient(1px 1px at 38% 70%,rgba(205,189,242,.6),transparent),radial-gradient(1px 1px at 86% 76%,rgba(255,255,255,.5),transparent)"></div>
            <div style="position:absolute;inset:9px;border:1px solid rgba(231,207,155,.35);border-radius:15px;pointer-events:none"></div>
            <div style="{{ revealEmblemStyle }}"></div>
            <div style="position:relative;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:56px;letter-spacing:.06em;color:#f0d488;line-height:1;margin-top:14px;text-shadow:0 0 30px rgba(236,200,116,.4)">{{ codigoNumero }}</div>
            <div style="position:relative;font-size:14px;line-height:1.6;color:rgba(243,236,220,.92);margin-top:12px;text-wrap:pretty">{{ codigoProposito }}</div>
          </div>
          <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:22px;overflow:hidden;background:linear-gradient(160deg,#2a1f57,#150d34 60%,#0b0726);border:1px solid rgba(231,207,155,.45)">
            <div style="position:absolute;inset:0;opacity:.55;background-image:repeating-linear-gradient(45deg, rgba(231,207,155,.10) 0 2px, transparent 2px 10px), repeating-linear-gradient(-45deg, rgba(205,189,242,.08) 0 2px, transparent 2px 10px)"></div>
            <div style="{{ backEmblemMidStyle }}"></div>
          </div>
        </div>
      </div>
      <div style="width:100%;max-width:340px;margin-top:18px;border:1px solid rgba(205,189,242,.22);border-radius:16px;padding:14px 16px;background:rgba(21,13,52,.45)">
        <div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(231,207,155,.75)">Cómo usarlo</div>
        <div style="font-size:13px;line-height:1.65;color:rgba(243,236,220,.88);margin-top:6px">Repítelo <strong style="color:#e7cf9b">45 veces al día</strong>, en voz alta, escrito o en tu mente. Hazlo con fe, gratitud y en tiempo presente, toda la semana.</div>
      </div>
      <div style="flex:1"></div>
      <div onClick="{{ activar }}" style="width:100%;margin-top:22px;height:54px;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:linear-gradient(135deg,#f0d488,#ecc874 55%,#d9ab55);color:#1c1338;font-weight:700;font-size:15.5px;box-shadow:0 10px 26px rgba(236,200,116,.28)">Recibir mi código</div>
    </div>
  </sc-if>

  <sc-if value="{{ isActivo }}" hint-placeholder-val="{{ false }}">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center">
      <div style="margin:20px 0 4px;font-size:11px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:rgba(205,189,242,.55)">{{ activoCat }} · Código activo</div>
      <div style="width:100%;max-width:340px;margin-top:10px;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,#2a1f57,#150d34 62%,#0b0726);border:1px solid rgba(231,207,155,.6);padding:26px 24px 22px;text-align:center;position:relative;animation:csGlow 4s ease-in-out infinite">
        <div style="position:absolute;inset:0;opacity:.5;background-image:radial-gradient(1px 1px at 20% 24%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 76% 32%,rgba(231,207,155,.6),transparent),radial-gradient(1px 1px at 38% 70%,rgba(205,189,242,.6),transparent)"></div>
        <div style="position:absolute;inset:9px;border:1px solid rgba(231,207,155,.35);border-radius:15px;pointer-events:none"></div>
        <div style="{{ activoEmblemStyle }}"></div>
        <div style="position:relative;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:52px;letter-spacing:.06em;color:#f0d488;line-height:1;margin-top:12px;text-shadow:0 0 30px rgba(236,200,116,.4)">{{ activoNumero }}</div>
        <div style="position:relative;font-size:13.5px;line-height:1.6;color:rgba(243,236,220,.92);margin-top:10px;text-wrap:pretty">{{ activoProposito }}</div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;margin-top:16px">
        <div style="font-size:12px;color:rgba(205,189,242,.65)">Nueva semana, nuevo código en</div>
        <div style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:20px;color:#e7cf9b">{{ countdown }}</div>
      </div>

      <div style="width:100%;max-width:340px;margin-top:16px;border:1px solid rgba(205,189,242,.22);border-radius:16px;padding:14px 16px;background:rgba(21,13,52,.45)">
        <div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(231,207,155,.75)">Cómo usarlo</div>
        <div style="font-size:13px;line-height:1.65;color:rgba(243,236,220,.88);margin-top:6px">Repítelo <strong style="color:#e7cf9b">45 veces al día</strong>, en voz alta, escrito o en tu mente, con fe y en presente, toda la semana.</div>
      </div>

      <div style="width:100%;max-width:340px;margin-top:16px;border:1px solid rgba(205,189,242,.25);border-radius:16px;overflow:hidden">
        <div style="display:flex;gap:12px;align-items:center;padding:13px 14px;background:rgba(21,13,52,.6)">
          <div style="width:34px;height:34px;border-radius:9px;flex:0 0 auto;background:linear-gradient(160deg,#2a1f57,#0b0726);border:1px solid rgba(231,207,155,.5);display:flex;align-items:center;justify-content:center">
            <div style="{{ notifEmblemStyle }}"></div>
          </div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;gap:8px"><span style="font-size:12.5px;font-weight:700;color:#f3ecdc">Prisma Azul</span><span style="font-size:11px;color:rgba(205,189,242,.5)">lunes 9:00</span></div>
            <div style="font-size:12.5px;color:rgba(243,236,220,.85);margin-top:1px">🌙 Nueva semana, nuevo código. Ven a recibirlo.</div>
          </div>
        </div>
        <div onClick="{{ toggleNotif }}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 14px;cursor:pointer;border-top:1px solid rgba(205,189,242,.15)">
          <div style="font-size:13.5px;color:rgba(243,236,220,.9)">Avisarme cada semana</div>
          <div style="{{ notifTrackStyle }}"><div style="{{ notifKnobStyle }}"></div></div>
        </div>
      </div>
      <div style="flex:1"></div>
      <div onClick="{{ resetDemo }}" style="margin-top:24px;font-size:12px;color:rgba(205,189,242,.5);cursor:pointer;text-decoration:underline;padding:10px">Restablecer (demo)</div>
    </div>
  </sc-if>

  <sc-if value="{{ toast }}" hint-placeholder-val="{{ false }}">
    <div style="position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:80;background:rgba(21,13,52,.95);border:1px solid rgba(231,207,155,.5);border-radius:999px;padding:12px 20px;font-size:13px;color:#f3ecdc;box-shadow:0 12px 30px rgba(0,0,0,.5);white-space:nowrap">{{ toast }}</div>
  </sc-if>

</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:&quot;430px&quot;,&quot;height&quot;:&quot;900px&quot;},&quot;ritmoRitual&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;default&quot;:&quot;ritual&quot;,&quot;options&quot;:[&quot;ritual&quot;,&quot;ágil&quot;],&quot;tsType&quot;:&quot;string&quot;,&quot;section&quot;:&quot;Ritual&quot;},&quot;estadoInicial&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;default&quot;:&quot;auto&quot;,&quot;options&quot;:[&quot;auto&quot;,&quot;desbloqueado&quot;],&quot;tsType&quot;:&quot;string&quot;,&quot;section&quot;:&quot;Estado&quot;}}">
class Component extends DCLogic {
  state = { step:'elegir', cat:null, codigoIdx:null, flipped:false, unlockAt:null, now:Date.now(), notif:true, toast:null, reps:0 };
  timers = [];
  componentDidMount() {
    if (typeof window !== 'undefined' && (!window.CODIGOS_DATA || !window.CARD_OSCURA)) {
      const t = setInterval(() => { if (window.CODIGOS_DATA && window.CARD_OSCURA) { clearInterval(t); this.forceUpdate(); } }, 60);
      setTimeout(() => clearInterval(t), 4000);
    }
    try {
      const raw = localStorage.getItem('pa_codigo_activo');
      if (raw && this.props.estadoInicial !== 'desbloqueado') {
        const j = JSON.parse(raw);
        if (j.unlockAt > Date.now()) this.setState({ step:'activo', cat:j.cat, codigoIdx:j.idx, unlockAt:j.unlockAt, reps:this.repsHoy() });
        else localStorage.removeItem('pa_codigo_activo');
      }
    } catch(e){}
    this.tick = setInterval(() => { if (this.state.step==='activo') this.setState({now:Date.now()}); }, 1000);
  }
  componentWillUnmount() { this.timers.forEach(clearTimeout); clearInterval(this.tick); }
  after(ms, fn) { this.timers.push(setTimeout(fn, ms)); }
  data() { return (typeof window!=='undefined' && window.CODIGOS_DATA) || {categorias:[]}; }
  catSel(key) { return this.data().categorias.find(c=>c.key===(key||this.state.cat)); }
  hoyKey() { const d=new Date(); return 'pa_codigo_reps_'+d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
  repsHoy() { try { return Number(localStorage.getItem(this.hoyKey())||0); } catch(e){ return 0; } }
  emblemStyle(palo, size, extra) {
    const CO = (typeof window!=='undefined' && window.CARD_OSCURA) || {};
    const uri = CO[palo] || CO['oros'] || '';
    return uri ? Object.assign({width:size,height:size,backgroundImage:'url("'+uri+'")',backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center'}, extra||{}) : {display:'none'};
  }
  renderVals() {
    const D = this.data(), st = this.state;
    const agil = this.props.ritmoRitual === 'ágil';
    const cat = this.catSel();
    const codigo = (cat && st.codigoIdx != null) ? cat.codigos[st.codigoIdx] : null;

    const categorias = D.categorias.map(c => ({
      nombre:c.nombre, sub:c.sub,
      iconStyle: this.emblemStyle(c.palo, '42px', {flex:'0 0 auto', filter:'drop-shadow(0 0 8px '+c.color+'55)'}),
      style: {display:'flex', alignItems:'center', gap:'15px', padding:'16px 16px', borderRadius:'18px', cursor:'pointer',
        border:'1px solid rgba(231,207,155,.28)', background:'rgba(21,13,52,.5)',
        boxShadow:'inset 3px 0 0 '+c.color, transition:'all .2s ease'},
      onPick: () => {
        const idx = Math.floor(Math.random()*c.codigos.length);
        this.setState({cat:c.key, codigoIdx:idx, step:'barajar', flipped:false});
        this.after(agil?1400:2400, () => {
          this.setState({step:'revelar'});
          this.after(350, ()=>this.setState({flipped:true}));
        });
      }
    }));

    const shuffleCards = Array.from({length:8}, (_,i) => ({
      style: {position:'absolute', left:'50%', top:(20+i*2)+'px', width:'118px', aspectRatio:'5/7',
        transform:'translate(-50%,0)', borderRadius:'10px', overflow:'hidden',
        background:'linear-gradient(160deg,#2a1f57,#150d34 60%,#0b0726)',
        border:'1px solid rgba(231,207,155,'+(0.35+i*0.06)+')', boxShadow:'0 8px 22px rgba(0,0,0,.45)',
        animation:(i%2?'csShufA':'csShufB')+' '+(agil?0.5:0.7)+'s ease-in-out '+(i*0.07)+'s infinite'}
    }));

    let countdown = '';
    if (st.step==='activo' && st.unlockAt) {
      const ms = Math.max(0, st.unlockAt - st.now);
      const d = Math.floor(ms/86400000), h = Math.floor((ms%86400000)/3600000), m = Math.floor((ms%3600000)/60000);
      countdown = d>0 ? d+' d '+h+' h' : h+' h '+String(m).padStart(2,'0')+' m';
      if (ms===0) { try{localStorage.removeItem('pa_codigo_activo');}catch(e){} }
    }

    return {
      isElegir: st.step==='elegir', isBarajar: st.step==='barajar', isRevelar: st.step==='revelar', isActivo: st.step==='activo',
      categorias, shuffleCards, countdown,
      catNombre: cat ? cat.nombre : '',
      pillLabel: st.step==='activo' ? 'Activo' : 'Disponible',
      pillStyle: {fontSize:'11px', fontWeight:600, borderRadius:'999px', padding:'7px 12px', whiteSpace:'nowrap',
        color: st.step==='activo' ? 'rgba(205,189,242,.75)' : '#1c1338',
        border: st.step==='activo' ? '1px solid rgba(205,189,242,.35)' : 'none',
        background: st.step==='activo' ? 'transparent' : 'linear-gradient(135deg,#f0d488,#d9ab55)'},
      backEmblemStyle: this.emblemStyle(cat?cat.palo:'oros', '46%', {position:'absolute', left:'27%', top:'30%'}),
      backEmblemMidStyle: this.emblemStyle(cat?cat.palo:'oros', '52px', {position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)'}),
      revealEmblemStyle: this.emblemStyle(cat?cat.palo:'oros', '36px', {position:'relative', margin:'0 auto', filter:'drop-shadow(0 0 8px '+(cat?cat.color:'#ecc874')+'55)'}),
      flipInnerStyle: {position:'relative', transformStyle:'preserve-3d', transition:'transform .8s cubic-bezier(.35,.1,.25,1)',
        transform: st.flipped?'rotateY(0deg)':'rotateY(180deg)', minHeight:'240px'},
      codigoNumero: codigo ? codigo.c : '', codigoProposito: codigo ? codigo.p : '',
      activar: () => {
        const unlockAt = Date.now() + 7*86400000;
        try { localStorage.setItem('pa_codigo_activo', JSON.stringify({cat:this.state.cat, idx:this.state.codigoIdx, unlockAt})); } catch(e){}
        this.setState({step:'activo', unlockAt, reps:this.repsHoy()});
      },
      activoCat: cat ? cat.nombre : '', activoNumero: codigo ? codigo.c : '', activoProposito: codigo ? codigo.p : '',
      activoEmblemStyle: this.emblemStyle(cat?cat.palo:'oros', '34px', {position:'relative', margin:'0 auto', filter:'drop-shadow(0 0 8px '+(cat?cat.color:'#ecc874')+'55)'}),
      notifEmblemStyle: this.emblemStyle('oros', '20px', {}),
      notifTrackStyle: {width:'46px', height:'28px', borderRadius:'999px', flex:'0 0 auto', position:'relative', transition:'background .25s',
        background: st.notif ? 'linear-gradient(135deg,#f0d488,#d9ab55)' : 'rgba(205,189,242,.25)'},
      notifKnobStyle: {position:'absolute', top:'3px', left: st.notif?'21px':'3px', width:'22px', height:'22px', borderRadius:'50%', background:'#f3ecdc', transition:'left .25s', boxShadow:'0 2px 6px rgba(0,0,0,.35)'},
      toggleNotif: () => this.setState(s=>({notif:!s.notif})),
      goBack: () => {
        if ((this.state.step==='elegir' || this.state.step==='activo') && this.props.onExit) { this.props.onExit(); return; }
        try {
          const raw = localStorage.getItem('pa_codigo_activo');
          if (raw && this.props.estadoInicial!=='desbloqueado') { const j = JSON.parse(raw);
            if (j.unlockAt > Date.now()) { this.setState({step:'activo', cat:j.cat, codigoIdx:j.idx, unlockAt:j.unlockAt, reps:this.repsHoy()}); return; } }
        } catch(e){}
        this.setState({step:'elegir', cat:null, codigoIdx:null});
      },
      resetDemo: () => { try{localStorage.removeItem('pa_codigo_activo');}catch(e){} this.setState({step:'elegir', cat:null, codigoIdx:null, unlockAt:null}); },
      toast: st.toast,
    };
  }
}
</script>
</body>
</html>
