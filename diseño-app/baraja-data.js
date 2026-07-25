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
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="card-data-oscura.js"></script>
<script src="baraja-data.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0720;font-family:'Hanken Grotesk',sans-serif}
a{color:#e7cf9b}a:hover{color:#f3ecdc}
.sg-scroll::-webkit-scrollbar{display:none}
.sg-tabs::-webkit-scrollbar{display:none}
</style>
</helmet>
<div style="position:relative;min-height:100vh;width:100%;display:flex;justify-content:center;background:radial-gradient(135% 80% at 50% -10%, #241a4f 0%, #150d34 46%, #0a0720 100%)">
<div style="position:absolute;inset:0;pointer-events:none;opacity:.7;background-image:radial-gradient(1.4px 1.4px at 12% 8%,rgba(255,255,255,.9),transparent),radial-gradient(1px 1px at 28% 18%,rgba(231,207,155,.7),transparent),radial-gradient(1.4px 1.4px at 62% 6%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 82% 14%,rgba(205,189,242,.8),transparent),radial-gradient(1px 1px at 92% 30%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 44% 40%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 6% 56%,rgba(231,207,155,.6),transparent),radial-gradient(1px 1px at 24% 82%,rgba(255,255,255,.5),transparent)"></div>

<div class="sg-scroll" style="position:relative;width:100%;max-width:430px;min-height:100vh;display:flex;flex-direction:column;padding:18px 22px 34px">

  <header style="display:flex;align-items:center;gap:12px;padding:6px 0 2px">
    <div onClick="{{ goBack }}" style="width:44px;height:44px;margin-left:-10px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(231,207,155,.85);font-size:22px;font-family:'Cormorant Garamond',serif">‹</div>
    <div style="flex:1">
      <div style="font-size:11px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:rgba(205,189,242,.6)">Siempre disponible</div>
      <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:26px;line-height:1.05;color:#e7cf9b">La Baraja</div>
    </div>
    <div style="font-size:11px;font-weight:600;color:rgba(231,207,155,.85);border:1px solid rgba(231,207,155,.35);border-radius:999px;padding:7px 12px;white-space:nowrap">40 cartas</div>
  </header>

  <sc-if value="{{ isLista }}" hint-placeholder-val="{{ true }}">
    <p style="text-align:center;font-size:13.5px;line-height:1.6;color:rgba(205,189,242,.75);margin:16px auto 0;max-width:320px">El significado de cada carta, tal como la lee Gilda. Toca una carta para conocerla.</p>
    <div style="display:flex;gap:8px;margin-top:18px">
      <sc-for list="{{ paloTabs }}" as="p" hint-placeholder-count="4">
        <div onClick="{{ p.onPick }}" style="{{ p.style }}">
          <div style="{{ p.iconStyle }}"></div>
          <div style="{{ p.labelStyle }}">{{ p.nombre }}</div>
        </div>
      </sc-for>
    </div>
    <div style="display:flex;align-items:baseline;gap:10px;margin:20px 2px 4px">
      <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:24px;color:#e7cf9b">{{ paloNombre }}</div>
      <div style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(205,189,242,.55)">{{ paloElemento }}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px 12px;margin-top:12px">
      <sc-for list="{{ cartas }}" as="c" hint-placeholder-count="10">
        <div onClick="{{ c.onPick }}" style="{{ c.cellStyle }}">
          <div style="width:100%;aspect-ratio:5/7;position:relative">
            <dc-import name="Carta" num="{{ c.num }}" idx="{{ c.idx }}" rank-name="{{ c.rankName }}" color-main="{{ c.color }}" idx-color="{{ c.idxColor }}" emblem-uri="{{ c.emblem }}" crown-uri="{{ c.crown }}" hint-size="100%,100%"></dc-import>
            <sc-if value="{{ c.proximamente }}" hint-placeholder-val="{{ false }}">
              <div style="position:absolute;inset:0;border-radius:9px;background:rgba(10,7,32,.55);display:flex;align-items:center;justify-content:center">
                <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(205,189,242,.85);border:1px solid rgba(205,189,242,.4);border-radius:999px;padding:5px 8px;background:rgba(10,7,32,.7)">Próximamente</div>
              </div>
            </sc-if>
          </div>
          <div style="{{ c.captionStyle }}">{{ c.caption }}</div>
        </div>
      </sc-for>
    </div>
  </sc-if>

  <sc-if value="{{ isDetalle }}" hint-placeholder-val="{{ false }}">
    <div style="display:flex;gap:18px;align-items:center;margin-top:18px">
      <div style="width:108px;flex:0 0 auto;aspect-ratio:5/7;filter:drop-shadow(0 14px 30px rgba(0,0,0,.5))">
        <dc-import name="Carta" num="{{ det.num }}" idx="{{ det.idx }}" rank-name="{{ det.rankName }}" color-main="{{ det.color }}" idx-color="{{ det.idxColor }}" emblem-uri="{{ det.emblem }}" crown-uri="{{ det.crown }}" hint-size="108px,151px"></dc-import>
      </div>
      <div style="flex:1">
        <div style="font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(205,189,242,.55)">{{ det.paloElemento }}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:32px;line-height:1.1;color:#f3ecdc;margin-top:4px">{{ det.titulo }}</div>
        <sc-if value="{{ det.rankLabel }}" hint-placeholder-val="{{ false }}">
          <div style="font-size:12px;color:rgba(231,207,155,.8);margin-top:4px">{{ det.rankLabel }}</div>
        </sc-if>
      </div>
    </div>
    <div class="sg-tabs" style="display:flex;gap:8px;margin-top:22px;overflow-x:auto;padding-bottom:4px">
      <sc-for list="{{ tabs }}" as="t" hint-placeholder-count="4">
        <div onClick="{{ t.onPick }}" style="{{ t.style }}">{{ t.label }}</div>
      </sc-for>
    </div>
    <div style="margin-top:16px;border:1px solid rgba(205,189,242,.2);border-radius:18px;padding:18px;background:rgba(21,13,52,.45)">
      <p style="font-size:14.5px;line-height:1.75;color:rgba(243,236,220,.92);text-wrap:pretty">{{ tabTexto }}</p>
    </div>
    <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:rgba(205,189,242,.65);margin-top:16px;text-align:center">La carta habla; tu intuición completa el mensaje.</div>
    <div style="flex:1"></div>
    <div onClick="{{ volverLista }}" style="width:100%;margin-top:24px;height:50px;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid rgba(231,207,155,.4);color:#e7cf9b;font-weight:600;font-size:14px">Volver a la baraja</div>
  </sc-if>

</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:&quot;430px&quot;,&quot;height&quot;:&quot;900px&quot;},&quot;paloInicial&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;default&quot;:&quot;oros&quot;,&quot;options&quot;:[&quot;oros&quot;,&quot;copas&quot;,&quot;espadas&quot;,&quot;bastos&quot;],&quot;tsType&quot;:&quot;string&quot;,&quot;section&quot;:&quot;Estado&quot;}}">
class Component extends DCLogic {
  state = { palo:null, sel:null, tab:'general' };
  componentDidMount() {
    if (typeof window !== 'undefined' && (!window.BARAJA_DATA || !window.CARD_OSCURA)) {
      const t = setInterval(() => { if (window.BARAJA_DATA && window.CARD_OSCURA) { clearInterval(t); this.forceUpdate(); } }, 60);
      setTimeout(() => clearInterval(t), 4000);
    }
  }
  data() { return (typeof window!=='undefined' && window.BARAJA_DATA) || {palos:[],cartas:{},sinContenido:[8,9]}; }
  numName(n) { return {1:'As',2:'Dos',3:'Tres',4:'Cuatro',5:'Cinco',6:'Seis',7:'Siete',8:'Ocho',9:'Nueve',10:'Diez',11:'Once',12:'Doce'}[n]; }
  rankName(n) { return n===10?'Sota':n===11?'Caballo':n===12?'Rey':''; }
  cardProps(paloDef, num) {
    const CO = (typeof window!=='undefined' && window.CARD_OSCURA) || {};
    return { num, idx:String(num), rankName:this.rankName(num), color:paloDef.color, idxColor:paloDef.idxColor,
      emblem:CO[paloDef.key]||'', crown:CO['corona']||'' };
  }
  renderVals() {
    const D = this.data(), st = this.state;
    const paloKey = st.palo || this.props.paloInicial || 'oros';
    const paloDef = D.palos.find(p=>p.key===paloKey) || D.palos[0] || {key:'oros',nombre:'',elemento:'',color:'#ecc874',idxColor:'#f0d488'};

    const paloTabs = D.palos.map(p => {
      const CO = (typeof window!=='undefined' && window.CARD_OSCURA) || {};
      const act = p.key===paloKey;
      return { nombre:p.nombre,
        onPick: () => this.setState({palo:p.key}),
        style: {flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', padding:'11px 4px 9px',
          borderRadius:'14px', cursor:'pointer', transition:'all .2s ease',
          border:'1px solid '+(act?'rgba(236,200,116,.85)':'rgba(205,189,242,.18)'),
          background: act?'rgba(236,200,116,.08)':'rgba(21,13,52,.4)'},
        iconStyle: CO[p.key] ? {width:'26px', height:'26px', backgroundImage:'url("'+CO[p.key]+'")', backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'center', filter:'drop-shadow(0 0 6px '+p.color+'55)'} : {display:'none'},
        labelStyle: {fontSize:'11px', fontWeight:600, color: act?'#e7cf9b':'rgba(205,189,242,.65)'} };
    });

    const nums = [1,2,3,4,5,6,7,10,11,12];
    const cartas = nums.map(n => {
      const cp = this.cardProps(paloDef, n);
      return { ...cp, proximamente:false,
        caption: this.numName(n) + (this.rankName(n) ? ' · '+this.rankName(n) : ''),
        captionStyle: {fontSize:'11px', fontWeight:500, color:'rgba(231,207,155,.7)', textAlign:'center', marginTop:'6px'},
        cellStyle: {display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'},
        onPick: () => this.setState({sel:{palo:paloDef.key, num:n}, tab:'general'}) };
    });

    let det = null, tabs = [], tabTexto = '';
    if (st.sel) {
      const selPalo = D.palos.find(p=>p.key===st.sel.palo) || paloDef;
      const info = D.cartas[st.sel.palo+'-'+st.sel.num] || {};
      const cp = this.cardProps(selPalo, st.sel.num);
      det = { ...cp, paloElemento: selPalo.nombre+' · '+selPalo.elemento,
        titulo: st.sel.num+' de '+selPalo.nombre,
        rankLabel: this.rankName(st.sel.num) ? this.rankName(st.sel.num)+' — figura de la corte' : '' };
      const base = [ {key:'general',label:'General'}, {key:'amor',label:'Amor'}, {key:'trabajo',label:'Trabajo'}, {key:'dinero',label:'Dinero'} ];
      const extras = (info.extras||[]).map((e,i)=>({key:'x'+i, label:e.t}));
      tabs = base.concat(extras).map(t => ({ label:t.label,
        onPick: () => this.setState({tab:t.key}),
        style: {flex:'0 0 auto', padding:'9px 16px', borderRadius:'999px', cursor:'pointer', fontSize:'12.5px', fontWeight:600,
          whiteSpace:'nowrap', transition:'all .2s ease',
          color: st.tab===t.key?'#1c1338':'rgba(205,189,242,.75)',
          background: st.tab===t.key?'linear-gradient(135deg,#f0d488,#d9ab55)':'rgba(21,13,52,.5)',
          border: st.tab===t.key?'1px solid transparent':'1px solid rgba(205,189,242,.25)'} }));
      if (st.tab.startsWith('x')) { const e = (info.extras||[])[Number(st.tab.slice(1))]; tabTexto = e?e.x:''; }
      else tabTexto = info[st.tab] || '';
    }

    return {
      isLista: !st.sel, isDetalle: !!st.sel,
      paloTabs, cartas, paloNombre: paloDef.nombre, paloElemento: paloDef.elemento,
      det: det || {num:1, idx:'1', rankName:'', color:'#ecc874', idxColor:'#f0d488', emblem:'', crown:'', paloElemento:'', titulo:'', rankLabel:''},
      tabs, tabTexto,
      volverLista: () => this.setState({sel:null}),
      goBack: () => { if (!this.state.sel && this.props.onExit) this.props.onExit(); else this.setState({sel:null}); },
    };
  }
}
</script>
</body>
</html>
