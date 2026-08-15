# Auditoría de red y seguridad — equipo YOSOY

**Fecha:** 31 de julio de 2026, 19:58
**Usuario:** YOSOY\danny (sin privilegios de administrador durante la auditoría)
**Motivo:** app de Expo ejecutada en WiFi público; sospecha de ngrok, firewall
desactivado, tráfico apareciendo como VPN/proxy, y posible PUP/adware.

---

## Veredicto corto

**No se encontró malware, VPN, proxy ni secuestro de DNS.** El firewall nunca
estuvo desactivado y no hay proxy configurado en ningún nivel. La IP pública es
residencial de Total Play, no de un centro de datos.

Sí se encontró **software no deseado (PUP) preinstalado**, ajeno a Expo, y uno
de sus componentes escucha en un puerto de red abierto a todas las interfaces.

---

## Cambios aplicados

| # | Qué | Cómo revertirlo |
|---|---|---|
| 1 | Desinstalado `@expo/ngrok@4.1.3` **global** | `npm install -g @expo/ngrok@^4.1.0` |

**No se tocó nada más.** El firewall y el proxy ya estaban en el estado deseado,
así que no hubo nada que restablecer.

### Conservado a propósito

- `eas-cli@21.2.0` (global) — necesario para compilar la app para las tiendas
- `@expo/ngrok` **local** en `node_modules` — declarado en `package.json`; deja
  disponible el modo túnel para la próxima vez que estés en un WiFi que aísle
  clientes
- Las 2 reglas de firewall de Node — sin ellas se rompe el modo LAN

---

## Estado verificado tras los cambios

- Modo LAN: **funciona** (2 reglas de Node activas, apuntando a `node.exe` real)
- Modo túnel: **funciona** (ngrok local intacto)
- `adb reverse`: **no disponible — adb no está instalado** (condición previa, no
  causada por esta limpieza)

---

## FASE 2 — Clasificación completa

### (a) Legítimo y esperado

| Elemento | Por qué es normal |
|---|---|
| `Wi-Fi` — MediaTek MT7921 | Único adaptador físico |
| `WAN Miniport (SSTP / IKEv2 / L2TP / PPTP / PPPOE)` | Pila VPN **integrada de Windows**. Está en todos los equipos, desconectada. No es software de VPN instalado. |
| `Microsoft Wi-Fi Direct Virtual Adapter` ×2 | Integrado (Miracast / zona con cobertura) |
| `Teredo`, `6to4`, `IP-HTTPS` | Estado *Not Present* — inactivos |
| DNS `192.168.5.1` | Puerta de enlace de tu router Tenda |
| DNS `fec0:0:0:ffff::1-3` | Direcciones IPv6 por defecto de Windows |
| Tabla DoH (Quad9/Google/Cloudflare) | Lista de plantillas **de fábrica** de Windows 11, no configurada por nadie |
| Ruta por defecto única → `192.168.5.1` | Sin duplicados ni rutas inyectadas |
| `hosts` | Solo comentarios, **cero entradas activas** |
| WinHTTP: acceso directo · `ProxyEnable=0` · sin `AutoConfigURL` | Sin proxy en ningún nivel |
| Firewall: **activado** en Dominio, Privado y Público, `BlockInbound` | Nunca estuvo desactivado |
| Defender: RTP, antivirus, antispyware, monitor de comportamiento, NIS — todos **activos**; firmas del 31/07 | Protección al día |
| `WinHttpAutoProxySvc`, `ApxSvc`, portapapeles | Servicios estándar de Windows. Ninguno es VPN. |
| Reglas de firewall "Node.js JavaScript Runtime" ×2 | Creadas por ti al aceptar el aviso de Windows; apuntan a `C:\program files\nodejs\node.exe`, firma **OpenJS Foundation** válida |
| IP pública `187.191.39.199` — Total Play, CDMX | Conexión residencial. DNS inverso `fixed-...totalplay.net`. **No es VPN ni proxy.** |

### (b) Sobra pero es inofensivo — *resuelto o conservado*

| Elemento | Acción |
|---|---|
| `@expo/ngrok` global | **Desinstalado** |
| `@expo/ngrok` local | Conservado (útil, declarado en `package.json`) |
| Reglas de Node abiertas a *cualquier puerto* en los *tres* perfiles | Ver recomendación de refuerzo abajo |
| Red de casa clasificada como **Pública** | Ver recomendación de refuerzo abajo |

Sin carpetas `.ngrok2` / `%LOCALAPPDATA%\ngrok`: **ngrok nunca se autenticó**, así
que no quedó ningún token ni túnel persistente.

### (c) Requiere tu decisión

Ninguno es malware — **las tres firmas digitales son válidas y auténticas**. Son
programas legítimos de fabricantes reales, clasificados habitualmente como PUP
(*programa potencialmente no deseado*) por su comportamiento: arrancar solos,
mostrar ofertas y, en un caso, abrir un puerto de red.

#### c.1 — Wondershare NativePush · **el hallazgo más relevante**

- **Binario:** `%LOCALAPPDATA%\Wondershare\Wondershare NativePush\WsToastNotification.exe`
- **Firma:** válida — Wondershare Technology Group Co.
- **Comportamiento:** escucha en **`0.0.0.0:8090`**, es decir en *todas* las
  interfaces de red, no solo en local
- **Riesgo:** mientras estuviste en el WiFi de Starbucks, ese puerto quedó
  alcanzable por cualquier equipo de esa red
- **Qué es:** componente de notificaciones push de Filmora
- **Si lo quitas:** pierdes avisos promocionales de Wondershare. Filmora sigue
  funcionando.

#### c.2 — Wondershare Helper Compact

- **Binario:** `C:\Program Files (x86)\Common Files\Wondershare\Wondershare Helper Compact\WSHelper.exe`
- **Firma:** válida — Wondershare Technology Co. (binario de 2017)
- **Arranca:** en cada inicio de sesión (`HKLM\...\WOW6432Node\...\Run`)
- **Qué es:** actualizador y lanzador residente
- **Si lo quitas:** Filmora sigue funcionando; se actualiza manualmente.

#### c.3 — Lenovo Now

- **Binarios:** `C:\Program Files (x86)\Lenovo\LenovoNow\x86\LenovoNow.exe` y `LenovoNow.Task.exe`
- **Firma:** válida — Lenovo
- **Arranca:** 3 tareas programadas (`LenovoNowLauncher`, `LenovoNowTask`, `LenovoNowQuarterlyLaunch`)
- **Qué es:** entrega de ofertas y contenido promocional de Lenovo (*bloatware* de fábrica)
- **Si lo quitas:** no afecta drivers ni garantía. **Lenovo Vantage es otra cosa**
  y sí conviene conservarlo: gestiona drivers y batería.

#### c.4 — Protección PUA desactivada

- **Estado:** `PUAProtection = 0`
- **Qué es:** el módulo de Defender que detecta justamente este tipo de software
- **Por qué importa:** con esto activo, Defender habría marcado los tres puntos anteriores
- **Requiere administrador**

---

## Puntos ciegos de esta auditoría

Honestidad sobre lo que **no** pude comprobar sin privilegios de administrador:

1. **Exclusiones de Defender.** `Get-MpPreference` devolvió
   *"Must be an administrator to view exclusions"*. Las exclusiones son un
   escondite habitual: un atacante añade una carpeta y Defender deja de mirarla.
   **Queda pendiente revisarlas.**
2. **Reglas de firewall a nivel de directiva de grupo** (`solo almacén de GPO`).
3. Fecha de modificación del archivo `hosts`: 25/07/2026, dentro de la ventana de
   trabajo. El contenido es 100 % el de fábrica, así que lo clasifico como limpio,
   pero lo dejo anotado.

---

## Sobre "mi tráfico aparece como VPN o proxy"

**No hay VPN ni proxy en este equipo.** Verificado en cinco frentes: sin
adaptadores TAP, sin servicios de VPN, sin proxy en WinHTTP ni en el registro,
ruta por defecto única hacia tu router, y todas las conexiones salientes
pertenecen a procesos identificados (navegadores, Teams, Slack, Grammarly,
Defender).

Causas probables de ese reporte, ninguna bajo tu control:

- **CGNAT.** Total Play comparte una misma IP pública entre muchos clientes.
  Los sistemas antifraude marcan las IP muy compartidas como "proxy".
- **Reputación heredada.** Las IP residenciales rotan; si un usuario anterior
  hizo algo indebido con `187.191.39.199`, la marca persiste un tiempo.
- **DNS sobre HTTPS.** Si el navegador resuelve por Cloudflare o Google, algunos
  servicios de geolocalización deducen mal tu ubicación.

---

## Recomendaciones de refuerzo (requieren administrador)

Ninguna es urgente. En orden de utilidad:

1. **Activar protección PUA** — habría detectado los tres puntos de (c)
2. **Revisar exclusiones de Defender** — el punto ciego que más importa
3. **Marcar tu red de casa como Privada** — hoy Tenda 103 está como *Pública*
4. **Acotar las reglas de Node** al puerto 8081 y al perfil Privado, en vez de
   *cualquier puerto* en los tres perfiles

Los comandos exactos están en la conversación.

---

*Generado durante la auditoría del 31/07/2026. Los datos provienen de la
inspección directa del sistema, no de estimaciones.*
