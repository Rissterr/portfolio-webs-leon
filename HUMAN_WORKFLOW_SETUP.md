# PROTOCOLO DE TRABAJO HUMANO Y SINCRONIZACIÓN — León Webs Comercial

**Proyecto:** León Webs Comercial  
**ID:** $projectId  
**Estado:** Regla permanente activa (Protocolo DOPP v1)  
**Fecha:** 2026-09-24  

---

## 1. 🎯 PRINCIPIO MAESTRO ANTI-RUIDO

- **No registrar microcambios:** Modificaciones de tipografía, márgenes, colores, mover cajas, probar variantes o corregir pequeñas erratas NUNCA deben generar actualizaciones independientes ni tareas en ClickUp.
- **Regla de Consolidación:** 20 cambios pequeños en una sesión = 1 sola actualización útil, clara y comprensible al terminar.
- **Regla de los 5 segundos:** Si Ezequiel o Sheila no entienden una tarea en menos de 5 segundos, debe reescribirse inmediatamente en lenguaje natural sin tecnicismos.

---

## 2. 🏛️ LAS TRES CAPAS DE INFORMACIÓN

### Capa 1: 👥 Vista Humana (Comprensible)
Diseñada para responder de un vistazo:
- 🎯 ¿Qué estamos haciendo?
- ⏳ ¿Qué falta?
- ✅ ¿Qué está terminado?
- ⛔ ¿Qué está bloqueado?
- 👉 ¿Qué toca después?
- 📊 ¿Cuánto se ha avanzado?

**Vocabulario:** Lenguaje normal. Queda prohibido usar en la vista principal términos técnicos como *frontend, backend, deploy, repository, branch, component, refactor, commit, API, endpoint, pipeline, schema*.

### Capa 2: 📋 PROJECT_STATE.md (Estado Maestro)
- Resumen global del proyecto con su sección ## 👀 VISTA HUMANA y su sección secundaria ## 🔧 Información técnica.
- Se actualiza **una sola vez al final de la sesión** o ante cambios relevantes (fin de tarea, cambio de fase, nuevo bloqueo o publicación).

### Capa 3: ⚙️ Git y Archivos (Historial Técnico Secundario)
- Conserva el detalle técnico profundo (archivos modificados, commits, ramas, pruebas de código).
- Subordinado a la vista humana. No se duplica en ClickUp.

---

## 3. 🎨 EMOJIS Y ESTADOS VISUALES NORMALIZADOS

### Estados Visibles
- 📝 **Por hacer**
- 🔵 **Trabajando ahora**
- 🟡 **Esperando**
- 👀 **Hay que revisar**
- ⛔ **No se puede continuar**
- ✅ **Terminado**

### Fases Visibles
- 💡 Idea
- 🔎 Investigación
- 📝 Preparando contenido
- 🎨 Diseñando
- 🛠️ Construyendo
- 👀 Revisando
- 🚀 Listo para publicar
- 🌍 Publicado
- 🔧 Mantenimiento
- 📦 Archivado

---

## 4. 📋 TAREAS EN LENGUAJE NO TÉCNICO

- ✅ Definir el mensaje principal de la agencia
- ✅ Diseñar la portada y estructura de la web
- ✅ Añadir los servicios de diseño y automatización
- ✅ Conectar el formulario de contacto y WhatsApp
- ✅ Comprobar que se ve perfecto en móviles y ordenadores
- ✅ Publicar la web en https://leonwebs.es
- 🔵 Actualizar los trabajos y casos de clientes realizados
- 📝 Preparar contenidos para que nos encuentren en León (SEO local)
- 👀 Revisión de diseño antes de lanzar captación comercial

---

## 5. 📦 CONSOLIDACIÓN DE SESIÓN (SESSION BUFFER)

Durante la sesión, el agente anota internamente los microcambios en un buffer temporal:
``text
SESSION_BUFFER:
- cambio 1
- cambio 2
- cambio 3
``

Al terminar la sesión, consolida todo en un único resumen humano:
> 📦 **Resumen de sesión:**  
> - 🎨 Se refinó el bloque principal con textos claros y composición cuidada.  
> - **Estado actual:** 🔵 En curso / 👀 Hay que revisar.  
> - **Siguiente paso:** Pasar a la siguiente tarea visible.  
> - **Bloqueo:** Ninguno.  

---

## 6. 🚫 REGLAS DE CONTROL Y DECISIONES MASTER

- **Sincronización ClickUp:** Cuando se active la sincronización con ClickUp, se enviará únicamente esta vista humana resumida.
- No duplicar cada cambio en tres plataformas.
- No ejecutar llamadas a ClickUp de forma automática o descontrolada.
- Respetar siempre las decisiones MASTER vigentes del proyecto.