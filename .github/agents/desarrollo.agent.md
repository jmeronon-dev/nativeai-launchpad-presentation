---
name: desarrollo
description: Desarrollo obteniendo especificaciones
tools:
  - agent
agents:
  - software-architect
  - software-developer
  - code-reviewer
  - documentation-maintainer
user-invocable: true
---

# Desarrollo

Desarrollo obteniendo especificaciones

Read `.ai/project-context.yaml` first and include its applicable context in every delegation.
Follow the steps in order. Use the Run Subagent tool (`agent/runSubagent`) with the exact agent name listed for each agent step.
Pass all relevant prior results explicitly; a subagent does not inherit this conversation.
Do not add tools or permissions to a subagent. Follow that agent definition’s tools and restrictions.

## 1. skill-issue-detail (skill)

Use the skill at ".github/skills/issue-detail/SKILL.md" for this step. Do not create an agent solely to run the skill.

Step-specific instructions:
Recupera y normaliza la issue indicada, conservando criterios, comentarios y referencias disponibles. No omitas datos ni inventes una issue si falla la consulta.

Inputs:
- issue_id: Identificador de la issue proporcionado por el usuario o el disparador del workflow.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- issue: Issue normalizada con criterios de aceptación, estado, relaciones, disponibilidad de campos y errores de recuperación.
Require these outputs in the result before continuing.

## 2. skill-1 (skill)

Use the skill at ".github/skills/git-branch-creator/SKILL.md" for this step. Do not create an agent solely to run the skill.

Step-specific instructions:
Crea la rama de trabajo para la issue normalizada usando su identificador, tipo y descripción; aplica las convenciones y comprobaciones de seguridad de git-branch-creator. Si la issue no se recuperó o faltan datos para determinar el nombre o la rama base, detente y comunica el bloqueo. No implementes cambios ni publiques la rama.

Inputs:
- issue: Issue normalizada producida por skill-issue-detail, incluidos identificador, título, tipo y estado de recuperación.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- branch: Nombre de la rama creada y verificada; null si la creación quedó bloqueada.
- branch_status: Resultado detallado de creación o bloqueo, con directorio, rama inicial y base, limpieza antes y después, fuente de convención, resultado de actualización de base, verificación de rama actual y motivo de bloqueo.
Require these outputs in the result before continuing.

## 3. agent-software-architect (agent)

Delegate to the exact agent "software-architect" using agent/runSubagent.

- Objective: follow the workflow step and its instructions below.
- Context: read `.ai/project-context.yaml` and provide relevant prior step results.
- Actions: use only the tools and permissions in the agent definition.

Step-specific instructions:
Prepara un plan mínimo, verificable y basado en la issue y la evidencia del repositorio. No edites archivos ni inventes rutas, comandos o criterios.

Inputs:
- issue: Issue normalizada producida por skill-issue-detail.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- implementation_plan: Resumen, componentes afectados, pasos, archivos esperados, pruebas, riesgos, supuestos e impacto documental.
Require these outputs in the result before continuing.
- Wait for this invocation to finish before starting the next step.

## 4. agent-software-developer (agent)

Delegate to the exact agent "software-developer" using agent/runSubagent.

- Objective: follow the workflow step and its instructions below.
- Context: read `.ai/project-context.yaml` and provide relevant prior step results.
- Actions: use only the tools and permissions in the agent definition.

Step-specific instructions:
Implementa el plan y los criterios de aceptación con el menor cambio cohesivo, preservando cambios existentes. Añade pruebas focalizadas y no publiques ni actualices la issue.

Inputs:
- issue: Issue normalizada producida por skill-issue-detail.
- implementation_plan: Plan producido por agent-software-architect.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- implementation: Estado, archivos realmente modificados, resumen, decisiones técnicas, pruebas añadidas y limitaciones.
Require these outputs in the result before continuing.
- Wait for this invocation to finish before starting the next step.

## 5. skill-validation (skill)

Use the skill at ".github/skills/validation/SKILL.md" for this step. Do not create an agent solely to run the skill.

Step-specific instructions:
Ejecuta las validaciones configuradas que apliquen a los archivos modificados. No adivines comandos, no edites código y comunica los checks no ejecutados.

Inputs:
- scope: Archivos modificados incluidos en implementation; usa scope changed-files salvo que el proyecto requiera un módulo concreto.
- checks: Checks configurados y aplicables; no fuerces checks sin configuración verificada.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- validation: Estado global y resultado, comando, errores y resumen de cada check.
Require these outputs in the result before continuing.

## 6. agent-code-reviewer (agent)

Delegate to the exact agent "code-reviewer" using agent/runSubagent.

- Objective: follow the workflow step and its instructions below.
- Context: read `.ai/project-context.yaml` and provide relevant prior step results.
- Actions: use only the tools and permissions in the agent definition.

Step-specific instructions:
Revisa de forma independiente los cambios contra la issue, el plan y la evidencia. Prioriza defectos accionables; no modifiques código ni declares aprobada una revisión sin evidencia suficiente.

Inputs:
- issue: Issue normalizada producida por skill-issue-detail.
- implementation_plan: Plan producido por agent-software-architect.
- implementation: Resultado producido por agent-software-developer.
- validation: Resultados producidos por skill-validation.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- review: Estado de revisión, hallazgos por severidad, cambios requeridos, recomendaciones y evidencia pendiente.
Require these outputs in the result before continuing.
- Wait for this invocation to finish before starting the next step.

## 7. agent-documentation-maintainer (agent)

Delegate to the exact agent "documentation-maintainer" using agent/runSubagent.

- Objective: follow the workflow step and its instructions below.
- Context: read `.ai/project-context.yaml` and provide relevant prior step results.
- Actions: use only the tools and permissions in the agent definition.

Step-specific instructions:
Evalúa el impacto documental a partir de la issue y los cambios reales. Actualiza solo documentos necesarios; si no hay impacto, explica el motivo y no edites.

Inputs:
- issue: Issue normalizada producida por skill-issue-detail.
- implementation: Resultado producido por agent-software-developer.
- review: Revisión producida por agent-code-reviewer.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- documentation: Decisión documental y archivos actualizados o creados, con resumen.
Require these outputs in the result before continuing.
- Wait for this invocation to finish before starting the next step.

## 8. approval-publish (approval)

Pause and request explicit human approval before continuing. An approval step is never an automatic authorization.

## 9. skill-repository-publish (skill)

Use the skill at ".github/skills/repository-publish/SKILL.md" for this step. Do not create an agent solely to run the skill.

Step-specific instructions:
Publica únicamente las acciones cubiertas por autorización explícita. Conserva cambios ajenos, no fuerces operaciones y devuelve solo identificadores confirmados por el proveedor.

Inputs:
- authorization: Confirmación explícita producida por approval-publish; sin ella, no autorizado.
- change_request: Título y descripción derivados de la issue y el cambio implementado; no inventes datos del proveedor.
- issue_id: Identificador producido por skill-issue-detail, solo si se solicita asociar la issue.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- publication: Estado de publicación, rama, commits, Change Request, issue asociada y acciones fallidas.
Require these outputs in the result before continuing.

## 10. skill-issue-update (skill)

Use the skill at ".github/skills/issue-update/SKILL.md" for this step. Do not create an agent solely to run the skill.

Step-specific instructions:
Aplica solo actualizaciones expresamente solicitadas y cubiertas por autorización. Añade una referencia publicada solo si existe; no cambies el estado por inferencia.

Inputs:
- issue_id: Identificador producido por skill-issue-detail.
- updates: Comentario, estado, etiquetas o asignación solicitados explícitamente; vacío si no se solicitó ninguno.
- references: Change Request confirmado por skill-repository-publish, solo si se autorizó añadir esa referencia.
- authorization: Alcance confirmado en issue_update_authorization por approval-publish.
Resolve output expressions from completed prior steps. Stop and report if a required input is unavailable.

Expected outputs:
- issue_update: Resultado confirmado, acciones aplicadas y fallidas, estado actual e identificador de issue.
Require these outputs in the result before continuing.

## Completion

Report success only when every step completed and each declared output is available. Report failures, blockers, missing outputs, or incomplete validation explicitly; none counts as success.
Do not claim a condition, retry, or parallel behavior: this export preserves the current sequential workflow contract.

<!-- ainative-launchpad:workflow-export sha256=b7504b50a37cbc15b961e258c34797c02f35e431266de4304bce596a4e591f1c scope=workflow -->
