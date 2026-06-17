# LifeOS

Su sistema operativo personal, _mobile-first_. No es una app de tareas ni un
calendario mejorado: es un mayordomo digital que recibe al usuario, entiende su
vida real y le dice qué necesita atención hoy.

> «No rellene nada. Háblelo, súbalo o hágale una foto. LifeOS lo entiende.»

Este repositorio contiene un **prototipo navegable** (datos simulados, sin
backend) construido con Next.js, React, TypeScript y Tailwind CSS.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # build de producción
```

Diseñado para verse premium en un iPhone 14 (390 px de ancho). En pantallas
grandes se muestra dentro de un marco de dispositivo.

## Qué incluye

Cinco pestañas, capturar en el centro:

- **Inicio** — saludo, resumen de «Hoy» y un máximo de elementos que
  «Requieren su atención» (con agrupación «Ver todos»). Avatar arriba a la
  derecha → ajustes, privacidad, biblioteca de análisis, exportar/borrar datos.
- **Calendario** — vista mensual y semanal con color de carga (tranquilo /
  ocupado / saturado). Al pulsar un día, una hoja inferior con eventos,
  vencimientos y una recomendación de LifeOS.
- **Capturar** — el corazón de la app. Flujos simulados de **voz**
  (transcripción + análisis por módulos), **documento** (análisis, qué guardar,
  jerarquía de acciones) y **foto** (análisis de salón / coche / microondas con
  presupuesto orientativo). Más «Preguntar» → asistente.
- **Espacios** — Casa, Coche, Mascotas y Familia. Cada espacio tiene su detalle
  con secciones, proyectos visuales y recomendaciones de IA.
- **Persona** — resumen semanal, métricas, últimos días, insights cruzados y
  hábitos. Registro de «cómo estoy hoy».

Más: **asistente único** «Hablar con LifeOS» (responde a las 8 preguntas
ejemplo desde el estado real), **onboarding** conversacional para usuarios
nuevos, y el flujo completo **Capturar → Confirmar → aparece en Inicio,
Calendario y Espacios** con _toast_ y micro-animación.

> Pruébelo: en el menú del avatar, «Borrar mis datos» le lleva al onboarding y
> al estado cero; «Restablecer datos de ejemplo» recupera la demo.

## Estructura

```
src/
  app/                 layout, estilos globales y tokens de diseño
  components/
    screens/           Inicio, Calendario, Capturar, Espacios, Persona, detalle
    modals/            voz, documento, foto, asistente, perfil, día, check-in
    ui/                primitivas (Button, Card, Sheet, Icon, Toast…)
  state/               AppContext (reducer + navegación) y tipos
  data/mock/           datos simulados (creíbles y coherentes con «hoy»)
  lib/                 utilidades de fecha y la lógica del asistente
```

## Notas

- Estado en memoria con `useReducer`. No hay Stripe, OCR, voz ni APIs externas.
- «Hoy» está anclado al 17 de junio de 2026 para mantener la demo coherente.
- Tono formal, calmado y adulto. Trato de «usted» en toda la interfaz.
