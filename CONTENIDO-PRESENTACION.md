# AI Native Launchpad

## Guion profesional de presentacion

**Subtitulo:** Del contexto al workspace  
**Ponente:** Javier Meroño Navarro, Delivery Lead en CUE · Mobile Lead & AI Architect  
**Duracion orientativa:** 25 minutos, incluida una demo breve  
**Audiencia:** equipos de producto, tecnologia y delivery

## Idea central

La adopcion de IA en desarrollo no depende solo del modelo. Para trabajar de forma consistente, los equipos necesitan contexto explicito, capacidades reutilizables, herramientas conectadas y validacion humana. AI Native Launchpad ayuda a organizar esos elementos y llevar la configuracion al workspace del equipo.

## 0. Introduccion

**Tiempo asignado:** 1:00

### En pantalla

**AI Native Launchpad**  
Del contexto al workspace

Javier Meroño Navarro

### Narracion

“La IA ya forma parte del trabajo de muchos equipos, pero usarla de forma puntual no es lo mismo que integrarla en el ciclo de desarrollo. En esta presentacion veremos que significa trabajar de forma AI Native, que problema aparece cuando cada equipo configura sus herramientas por separado y como AI Native Launchpad ayuda a organizar ese trabajo.”

### Direccion visual

Usar el nombre del producto como foco principal y una captura reconocible de Launchpad como fondo o imagen de apoyo. Mantener el subtitulo y el nombre del ponente como informacion secundaria.

## 1. Quien soy

**Tiempo asignado:** 2:00

### En pantalla

**Javier Meroño Navarro**  
Delivery Lead en CUE  
Mobile Lead & AI Architect  
14 años de experiencia
"Keep it simple"

### Narracion

“Soy Javier Meroño Navarro. Trabajo como Delivery Lead en CUE y como Mobile Lead y AI Architect. Tras 14 años de experiencia, mi interes está en conectar arquitectura, equipos y delivery: que las nuevas capacidades de IA se traduzcan en una forma de trabajo útil, comprensible y sostenible. Hoy os quiero enseñar esa perspectiva a través de AI Native Launchpad.”

### Direccion visual

Composicion sobria con el nombre como elemento principal. Añadir una fotografia profesional solo si se dispone de una imagen adecuada.

## 2. Que es AI Native

**Tiempo asignado:** 4:00

### En pantalla

**La especificacion guia el trabajo. Las personas mantienen la responsabilidad.**

**Principios**

- **SDD:** contexto y requisitos antes de implementar.
- **Human in the loop:** decisiones y validacion bajo supervision humana.
- **Iteracion:** implementar, probar, revisar y corregir en ciclos breves.
- **Mejora continua:** aprender de los resultados y refinar el proceso.

**Roles**

**AI Architect** · Define contexto, requisitos y arquitectura.  
**AI Lead** · Planifica, coordina y revisa el trabajo.  
**AI Developer** · Implementa, prueba y corrige segun la especificacion.  
**Outcome Validator** · Verifica criterios, calidad y evidencia.

### Narracion

“AI Native es una forma de integrar agentes de IA en el ciclo de desarrollo, no de delegarles la responsabilidad del producto. Con Spec-Driven Development hacemos explicitos los requisitos, las reglas de negocio, la arquitectura y los criterios de aceptacion antes de pedir una implementacion. Human in the loop mantiene a las personas en las decisiones, la supervision y la aceptacion. El AI Architect prepara el contexto; el AI Lead planifica y revisa; el AI Developer implementa, prueba y corrige; y el Outcome Validator comprueba criterios y evidencia. La iteracion convierte esa secuencia en ciclos breves de construir, probar, revisar y corregir. La mejora continua usa lo aprendido para refinar el contexto y el proceso.”

### Direccion visual

Presentar los cuatro principios —SDD, Human in the loop, iteracion y mejora continua— y el flujo **AI Architect → AI Lead → AI Developer → Outcome Validator**. Mostrar la supervision humana como capa transversal y devolver el feedback al contexto.

## 3. Problema: configuracion de IA distribuida

**Tiempo asignado:** 2:30

### En pantalla

**El contexto se fragmenta entre equipos y herramientas.**

- Instrucciones y prompts en distintos repositorios y conversaciones.
- Configuraciones diferentes para necesidades similares.
- Conocimiento dificil de descubrir, mantener y compartir.
- Incorporacion de personas dependiente de conocimiento informal.

### Narracion

“Cuando cada equipo configura sus herramientas por separado, el conocimiento util termina disperso. Una persona guarda un prompt en un chat; otra mantiene instrucciones en su repositorio; otra configura sus agentes y conexiones de una manera distinta. Con el tiempo cuesta saber que contenido está vigente, replicar una buena practica y preparar un entorno nuevo. El problema no es la falta de modelos: es que falta una forma compartida de organizar el contexto y las capacidades.”

### Direccion visual

Mostrar varias fuentes aisladas —repositorios, chats y configuraciones locales— y señalar el coste de la fragmentacion: duplicidad, variabilidad y dificultad de mantenimiento. Evitar representar Launchpad como una solucion que elimina toda configuracion local.

## 4. Conceptos: Skills, Agents y MCPs

**Tiempo asignado:** 3:30

### En pantalla

**Conocimiento. Roles. Herramientas.**

- **Skills:** instrucciones y practicas reutilizables para tareas concretas. Ejemplo: checklist de calidad o guia de API.
- **Agents:** roles especializados con objetivo, instrucciones y limites; pueden apoyarse en Skills. Ejemplo: investigar, implementar o revisar.
- **MCPs:** protocolo para que un cliente compatible acceda a herramientas y recursos externos autorizados. Ejemplo: consultar incidencias en Jira.

### Narracion

“Estas tres piezas resuelven problemas diferentes. Una Skill empaqueta conocimiento operativo que puede repetirse y mantenerse, como una convencion de API o una lista de comprobaciones de calidad. Un Agent define un rol con objetivo, instrucciones y limites; puede coordinar Skills para investigar, implementar o revisar. MCP, Model Context Protocol, es el protocolo que permite a un cliente compatible descubrir y utilizar herramientas o recursos expuestos por servidores autorizados. La disponibilidad no implica permiso ilimitado: depende de la configuracion y el acceso concedido. Se pueden combinar, pero no son intercambiables; separar sus responsabilidades hace mas claro que conocimiento se reutiliza, quien actua y a que sistema se conecta.”

### Direccion visual

Usar tres bloques con icono, definicion, responsabilidad y ejemplo. Conectar visualmente Skill (conocimiento), Agent (rol) y MCP (conexion), sin presentarlos como equivalentes.

## 5. Harness

**Tiempo asignado:** 3:30

### En pantalla

**El modelo aporta capacidad. El harness organiza su uso.**

- **Contexto:** documentacion, codigo y especificaciones del proyecto.
- **Instrucciones y capacidades:** reglas, Agents y Skills.
- **Orquestacion:** workflows, handoffs y puntos de aprobacion.
- **Herramientas y limites:** MCPs, CLI, permisos y sandbox.
- **Validacion y feedback:** tests, evaluaciones, observabilidad y revision humana.

**Distincion:** el modelo aporta capacidad de razonamiento; el harness prepara el contexto, las acciones disponibles y la comprobacion del resultado.

### Narracion

“El modelo aporta capacidad de razonamiento, pero no determina por si solo como trabaja el equipo. El harness comienza por el contexto: documentacion, codigo, especificaciones y decisiones vigentes. Las instrucciones y capacidades aportan reglas, Agents y Skills para orientar tareas. La orquestacion describe secuencia, handoffs, entradas, salidas y puntos de aprobacion. Las herramientas, mediante MCP o CLI, habilitan acciones concretas, siempre sujetas a permisos; un sandbox limita donde pueden ejecutarse. Finalmente, tests, evaluaciones, observabilidad y revision humana permiten contrastar la salida con criterios observables. Ese feedback puede corregir el contexto, las instrucciones o los limites del flujo. El harness no garantiza que la IA acierte: hace visible que recibe, que puede hacer y como se revisa.”

### Direccion visual

Separar el modelo de cinco bloques del harness. Cada bloque incluye una responsabilidad y ejemplos concretos; un bucle visual devuelve validacion y feedback al contexto.

## 6. AI Native Launchpad: que es y que hace

**Tiempo asignado:** 3:30

### En pantalla

**Un punto de gestion para llevar contexto y capacidades al workspace.**

- Organiza proyectos, tecnologias y artefactos.
- Centraliza referencias a Skills, Agents, MCPs y workflows.
- Resuelve el contexto adecuado para cada alcance.
- Prepara configuraciones para distintas herramientas de IA.

### Narracion

“AI Native Launchpad ayuda a organizar la configuracion de IA alrededor de los proyectos. Permite definir contexto en distintos niveles —proyecto, tecnologia y artefacto— y asociar las capacidades que necesita cada uno. Despues, ese contexto y los componentes seleccionados se pueden materializar en el workspace para las herramientas de IA configuradas. Asi el equipo parte de una base compartida, en lugar de reconstruir instrucciones y capacidades cada vez.”

“Launchpad prepara y distribuye configuracion; no reemplaza la autenticacion de cada herramienta ni hace que cualquier workflow sea automaticamente fiable. La ejecucion y la aceptacion de los resultados siguen dependiendo de las herramientas elegidas, sus limites y la validacion del equipo.”

### Direccion visual

Mostrar el flujo **Proyecto → Tecnologia o artefacto → Contexto y capacidades → Workspace**. Utilizar una captura real de Project Context o del modal de preparacion.

## 7. Recorriendo AI Native Launchpad

**Tiempo asignado:** 4:00

### En pantalla

**Caso: preparar el equipo de Checkout Web**

1. Seleccionar proyecto y contexto.
2. Revisar tecnologia y artefacto.
3. Explorar Skills, Agents y MCPs.
4. Consultar un prompt y un workflow.
5. Preparar el workspace.

### Narracion

"El caso es Atlas Commerce: preparar Checkout Web con React, sus capacidades y el workflow Feature Delivery. Este recorrido muestra veinte paradas desde proyectos y contexto hasta Skills, workflow, MCPs y workspace. Es una secuencia de capturas locales, no una conexión en vivo; avanzamos con Siguiente y podemos saltar desde el selector."

### Direccion visual y demo

La slide integra la presentación interactiva [presentacion.html](animacion-clics/presentacion.html). Recorrer proyecto, contexto, artefacto, Skill, prompt, workflow, resultado, catálogo MCP y workspace. La navegación usa capturas; no ejecuta acciones ni modifica Launchpad.

## 8. Gracias y fin

**Tiempo asignado:** 1:00

### En pantalla

**Gracias.**

Contexto compartido. Trabajo consistente. Validación humana.

### Narracion

“La tecnología puede acelerar el ciclo; la responsabilidad de las decisiones y de la calidad sigue siendo nuestra. Gracias. ¿Qué flujo probaríamos primero?”

### Direccion visual

Cerrar con AI Native Launchpad, el mensaje de responsabilidad compartida y una pregunta que abra la conversación.

## Recomendaciones para presentar

- Mantener en cada diapositiva una idea principal; utilizar la narracion para desarrollar el argumento.
- Usar capturas reales del producto en las diapositivas 6 y 7, sin convertirlas en un inventario de funcionalidades.
- En la demo, explicar primero el objetivo del recorrido y despues narrar solo las decisiones relevantes.
- Diferenciar configuracion, ejecucion y evidencia. No afirmar que una herramienta está conectada o que un cambio está validado si no se ha comprobado.
- La demo de la slide 7 se basa en capturas locales. No presentarla como navegación en vivo ni como evidencia de ejecución actual.

## Referencias de contenido

- [Definicion y principios de AI Native](../docs/NATIVE-AI.md)
- [Guion funcional de la demo](HAPPY-PATHS.md)
- [Recorrido interactivo y evidencia de la demo](animacion-clics/RECORRIDO.md)