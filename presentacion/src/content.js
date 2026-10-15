import notes from './notes.json' with { type: 'json' };

  const story = [
    {
      id: 'quien-soy', noteIndex: 1, timing: '2:00', group: 0, layout: 'split', kicker: 'Quién soy',
      title: 'Javier Meroño Navarro', lead: 'Delivery Lead en CUE · Mobile Lead & AI Architect', image: 'portrait',
      body: ['14 años de experiencia conectando arquitectura, equipos y delivery.'],
      quote: 'Keep it simple.',
    },
    {
      id: 'ai-native', noteIndex: 2, timing: '4:00', group: 0, layout: 'process', kicker: 'Qué es AI Native',
      title: 'La responsabilidad es humana.',
      lead: 'SDD · Human in the loop · iteración · mejora continua',
      featureCards: [
        { icon: 'FileText', title: 'SDD', description: 'Acordar contexto, requisitos, reglas y criterios antes de implementar.' },
        { icon: 'UserRoundCheck', title: 'Human in the loop', description: 'Las personas resuelven ambigüedades, deciden y aceptan el resultado.' },
        { icon: 'RefreshCw', title: 'Iteración', description: 'Implementar, probar, revisar y corregir en ciclos breves.' },
        { icon: 'TrendingUp', title: 'Mejora continua', description: 'Usar resultados y feedback para refinar contexto y proceso.' },
      ],
      steps: [
        { icon: 'Compass', title: 'AI Architect', text: 'Contexto y arquitectura.' },
        { icon: 'ListChecks', title: 'AI Lead', text: 'Planifica y revisa.' },
        { icon: 'Code', title: 'AI Developer', text: 'Implementa y prueba.' },
        { icon: 'BadgeCheck', title: 'Outcome Validator', text: 'Comprueba criterios y evidencia.' },
      ],
    },
    {
      id: 'problema', noteIndex: 3, timing: '2:30', group: 1, layout: 'statement', kicker: 'Configuración de IA distribuida',
      title: 'El problema',
      body: ['Instrucciones y prompts repartidos entre repositorios y conversaciones.', 'Configuraciones distintas para necesidades similares.', 'Conocimiento difícil de descubrir, mantener y compartir.', 'La incorporación depende demasiado del conocimiento informal.'],
    },
    {
      id: 'conceptos', noteIndex: 4, timing: '3:30', group: 1, layout: 'data', kicker: 'Conocimiento · roles · herramientas',
      title: 'Tres piezas distintas. Tres responsabilidades claras.',
      lead: 'Se combinan en el mismo entorno, pero ninguna sustituye a las otras.',
      featureCards: [
        { icon: 'BookOpen', title: 'Skill · conocimiento', description: 'Empaqueta instrucciones y prácticas que se reutilizan en una tarea concreta.', detail: 'Ej.: checklist de calidad o guía de API.' },
        { icon: 'Bot', title: 'Agent · responsabilidad', description: 'Define un rol, un objetivo, sus instrucciones y sus límites.', detail: 'Ej.: investigar, implementar o revisar.' },
        { icon: 'Cable', title: 'MCP · conexión', description: 'Conecta un cliente compatible con herramientas y recursos externos autorizados.', detail: 'Ej.: consultar incidencias en Jira.' },
      ],
    },
    {
      id: 'harness', noteIndex: 5, timing: '3:30', group: 1, layout: 'statement', kicker: 'El entorno alrededor del modelo',
      title: 'Harness',
      lead: 'Organizando el trabajo del modelo',
      featureCards: [
        { icon: 'FileText', title: 'Contexto', description: 'Docs, código, decisiones y requisitos.', detail: 'Qué sabe el modelo y para qué proyecto.' },
        { icon: 'BookOpen', title: 'Instrucciones y capacidades', description: 'Reglas del equipo, Agents y Skills.', detail: 'Cómo abordar la tarea.' },
        { icon: 'GitBranch', title: 'Orquestación', description: 'Workflows, secuencia y handoffs.', detail: 'Entradas, salidas y aprobación.' },
        { icon: 'Wrench', title: 'Herramientas y límites', description: 'MCPs, CLI, permisos y sandbox.', detail: 'Qué acciones están permitidas.' },
        { icon: 'ShieldCheck', title: 'Validación y feedback', description: 'Tests, evaluaciones y revisión humana.', detail: 'Qué evidencia aceptar; feedback al contexto.' },
      ],
      callToAction: 'No garantiza aciertos: hace explícito qué revisar y cómo mejorar.',
    },
    {
      id: 'flujo-desarrollo', noteIndex: 6, timing: '2:00', group: 1, layout: 'statement', kicker: 'Harness en acción',
      title: 'Flujo de desarrollo con agentes',
      figure: { src: './flujo-desarrollo.png', alt: 'GitHub Copilot y el modelo de IA conectados al harness con documentación, MCPs, Skills y Agentes, aplicados a tres flujos: refinamiento y planificación, desarrollo de tarea y revisión de Pull Request.' },
    },
    {
      id: 'launchpad', noteIndex: 7, timing: '3:30', group: 2, layout: 'statement', kicker: 'AI Native Launchpad',
      title: 'Un punto de gestión para llevar contexto y capacidades al workspace.',
      body: ['Organiza proyectos, tecnologías y artefactos.', 'Centraliza referencias a Skills, Agents, MCPs y workflows.', 'Resuelve el contexto adecuado para cada alcance.', 'Prepara configuraciones para distintas herramientas de IA.'],
      diagram: ['Proyecto', 'Tecnología o artefacto', 'Contexto y capacidades', 'Workspace'], connected: true,
    },
    {
      id: 'demo', noteIndex: 8, timing: '4:00', group: 3, layout: 'statement', kicker: 'Demo guiada · AI Native Launchpad',
      title: 'Recorrido interactivo: 20 paradas.',
      lead: 'Capturas locales de Atlas Commerce · recorrido guiado, no conexión en vivo.',
      walkthrough: {
        src: './launchpad-demo/presentacion.html?v=5',
        title: 'Recorrido interactivo de AI Native Launchpad: 20 paradas',
      },
    },
    {
      id: 'cierre', noteIndex: 9, timing: '1:00', group: 4, layout: 'closing', kicker: 'Gracias · Cierre de sesión',
      title: 'Gracias.',
      lead: 'Contexto compartido. Trabajo consistente. Validación humana.',
      callToAction: '¿Qué flujo probaríamos primero?',
    },
  ];

  export const groups = ['Personas y principios', 'Problema y piezas', 'Launchpad', 'Demo interactiva', 'Cierre'];

  const centers = [[-3, 1.2, 0], [-1.6, -1.4, 0.1], [1.1, 1.35, -0.3], [3.4, -0.2, 0.5], [1, -1.7, 0]];
  const counts = groups.map((_, groupIndex) => story.filter((slide) => slide.group === groupIndex).length);
  const offsets = groups.map(() => 0);
  const nodes = story.map((slide) => {
    const index = offsets[slide.group]++;
    const angle = index / counts[slide.group] * Math.PI * 2;
    const center = centers[slide.group];
    return {
      id: `node-${slide.id}`,
      position: [center[0] + Math.cos(angle) * 0.65, center[1] + Math.sin(angle) * 0.6, center[2] + index * 0.12],
      cameraOffset: [-0.9, 0.1, 3.5], lookAtOffset: [-0.9, 0, 0], fov: 42, weight: 1.1,
    };
  });

  export const presentation = {
    meta: {
      title: 'AI Native Launchpad', eyebrow: 'Javier Meroño Navarro · Delivery Lead en CUE · Mobile Lead & AI Architect',
      subtitle: 'Del contexto al workspace', language: 'es', theme: 'ntt-neural', duration: '25 minutos',
      logo: './brand/ntt-data-logo.svg',
      overviewNotes: notes[0].markdown,
    },
    overviewCamera: { position: [0, 0.15, 11.6], target: [0, 0, 0], fov: 48 },
    keywords: ['Contexto', 'Skills', 'Agents', 'MCP', 'Harness', 'Workflows', 'Workspace', 'Criterio', 'Validación'],
    nodes,
    slides: story.map((slide, index) => {
      const { noteIndex, ...content } = slide;
      return { ...content, nodeId: `node-${slide.id}`, order: index + 1, notes: notes[noteIndex].markdown };
    }),
  };
