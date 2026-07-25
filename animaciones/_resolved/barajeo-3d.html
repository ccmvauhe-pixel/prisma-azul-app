<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Barajeo 3D — Prisma Azul</title><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet"><script src="./card-emblems.js"></script><style>*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;font-family:'Hanken Grotesk',sans-serif;color:#f3ecdc;background:radial-gradient(120% 90% at 50% 0%,#1d1442 0%,#120b30 55%,#0b0726 100%)}
h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:28px;color:#f3ecdc}
.sub{font-size:12.5px;color:rgba(205,189,242,.7)}
.btn{height:48px;padding:0 28px;border:none;border-radius:999px;cursor:pointer;background:linear-gradient(135deg,#f0d488,#ecc874 55%,#d9ab55);color:#1c1338;font-weight:700;font-size:14px;font-family:inherit;box-shadow:0 10px 26px rgba(236,200,116,.28)}
.ghost{background:transparent;color:#e7cf9b;border:1px solid rgba(231,207,155,.4);box-shadow:none;font-weight:600}
.row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.pz-card-inner{position:absolute;inset:0;border-radius:10px;overflow:hidden;background:linear-gradient(160deg,#2a1f57,#150d34 60%,#0b0726);box-shadow:0 12px 26px rgba(0,0,0,.5)}
.pz-lattice{position:absolute;inset:0;opacity:.6;background-image:repeating-linear-gradient(45deg, rgba(231,207,155,.10) 0 2px, transparent 2px 9px), repeating-linear-gradient(-45deg, rgba(205,189,242,.08) 0 2px, transparent 2px 9px)}
.pz-frame{position:absolute;inset:6px;border:1.5px solid rgba(231,207,155,.8);border-radius:7px}
.pz-emblem{position:absolute;left:24%;top:24%;width:52%;height:52%;background-size:contain;background-repeat:no-repeat;background-position:center}
@keyframes pzShufL{0%,58%,100%{transform:translate3d(0,0,0) rotateZ(0deg) rotateY(0deg)}12%{transform:translate3d(-96px,6px,40px) rotateZ(-13deg) rotateY(-30deg)}30%{transform:translate3d(-40px,-58px,86px) rotateZ(-5deg) rotateY(-10deg)}46%{transform:translate3d(-2px,-8px,18px) rotateZ(-1deg) rotateY(0deg)}}
@keyframes pzShufR{0%,58%,100%{transform:translate3d(0,0,0) rotateZ(0deg) rotateY(0deg)}12%{transform:translate3d(96px,8px,40px) rotateZ(13deg) rotateY(30deg)}30%{transform:translate3d(40px,-56px,86px) rotateZ(5deg) rotateY(10deg)}46%{transform:translate3d(2px,-8px,18px) rotateZ(1deg) rotateY(0deg)}}
@keyframes pzDeckShadow{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.72;transform:translate(-50%,-50%) scale(1.1)}}
.stage{position:relative;width:260px;height:250px;perspective:850px}
.tilt{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateX(30deg)}
.deck-shadow{position:absolute;left:50%;top:60%;width:180px;height:140px;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.5),transparent 68%);filter:blur(7px);animation:pzDeckShadow 1.1s ease-in-out infinite}
.pz-card{position:absolute;left:50%;top:50%;width:120px;aspect-ratio:5/7;transform-style:preserve-3d}
.msg{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:rgba(231,207,155,.9)}
</style></head><body>
<h1>Barajeo 3D</h1>
<div class="sub">Usado en Cruz de Vida (palo: oros) y en el Oráculo (palo del oráculo elegido)</div>
<div class="stage"><div class="tilt" id="tilt"><div class="deck-shadow"></div></div></div>
<div class="msg">Barajando las cartas…</div>
<div class="row" id="palos"></div>
<script>
var tilt = document.getElementById('tilt');
var cards = [];
for (var i = 0; i < 8; i++) {
  var c = document.createElement('div');
  c.className = 'pz-card';
  c.style.transform = 'translate(-50%,-56%) translateZ(' + (i*2.4) + 'px) rotateZ(' + ((i%2?1:-1)*(0.5+i*0.3)) + 'deg)';
  c.innerHTML = '<div class="pz-card-inner" style="border:1px solid rgba(231,207,155,' + (0.35+i*0.06) + ');animation:' + (i%2?'pzShufL':'pzShufR') + ' 1.1s cubic-bezier(.45,.05,.3,1) ' + (i*0.135).toFixed(2) + 's infinite"><div class="pz-lattice"></div><div class="pz-frame"></div><div class="pz-emblem"></div></div>';
  tilt.appendChild(c); cards.push(c);
}
function setPalo(p) {
  document.querySelectorAll('.pz-emblem').forEach(function(e){ e.style.backgroundImage = 'url("' + CARD_OSCURA[p] + '")'; });
  document.querySelectorAll('#palos .btn').forEach(function(b){ b.classList.toggle('ghost', b.dataset.p !== p); });
}
['oros','copas','espadas','bastos'].forEach(function(p){
  var b = document.createElement('button');
  b.className = 'btn ghost'; b.dataset.p = p; b.textContent = p[0].toUpperCase()+p.slice(1);
  b.onclick = function(){ setPalo(p); };
  document.getElementById('palos').appendChild(b);
});
setPalo('oros');
</script></body></html>