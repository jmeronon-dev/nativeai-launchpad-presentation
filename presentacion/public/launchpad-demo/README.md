# Recorrido interactivo de AI Native Launchpad

Esta carpeta es el paquete estático de la demo que se embebe en la slide 7. Procede de `presentacion-ai-native-launchpad/animacion-clics/` y conserva su HTML, manifiestos de recorrido y fotogramas necesarios.

El visor integrado oculta cabecera, títulos y botones: muestra la captura 16:10 y 20 puntos centrados. Los puntos saltan a cada parada y las flechas del teclado avanzan las transiciones. Los fotogramas son capturas locales; navegar por ellas no conecta con Launchpad, no ejecuta acciones ni modifica workspaces.

El paquete ocupa aproximadamente 53 MB. Si se reemplaza el recorrido original, copiar de nuevo `presentacion.html`, `fotogramas/`, `ampliacion/recorrido.js` y `ampliacion/fotogramas/`, además de `detalles/recorrido.js` y `detalles/fotogramas/`. Mantener las rutas relativas; el HTML las carga desde esta misma carpeta.