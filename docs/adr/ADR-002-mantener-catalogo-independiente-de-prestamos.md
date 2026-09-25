# ADR-002 · Mantener el catálogo independiente de los préstamos

## Contexto
El catálogo de libros necesita poder consultarse en cualquier momento —para
navegar el listado, buscar un título o revisar disponibilidad— incluso si el
subsistema de préstamos tiene un error, está en mantenimiento o simplemente no
se está usando en ese momento.

## Driver que manda
Una falla en el módulo de préstamos no puede dejar sin funcionar la consulta
del catálogo de libros.

## Decisión
`catalogo.js` no importa nada de `prestamos.js`. La dependencia va en un solo
sentido: `prestamos.js` consulta a `catalogo.js` (para saber si hay copias
disponibles, reservar una copia o liberarla), pero `catalogo.js` no sabe que
`prestamos.js` existe.

## Alternativa descartada
Que `catalogo.js` le pregunte a `prestamos.js` cuántas copias están prestadas
activamente, en vez de que el catálogo mantenga su propio contador de
`disponibles`. Es más "correcto" en el sentido de tener una sola fuente de
verdad, pero invierte la dependencia: el catálogo dejaría de poder consultarse
solo, y cualquier error en préstamos tumbaría también la vista del catálogo.

## Qué pagamos
`catalogo.js` y `prestamos.js` mantienen datos que hay que sincronizar
manualmente: el contador `disponibles` se actualiza en dos operaciones
separadas (`reservarCopia` y `liberarCopia`) en vez de calcularse a partir de
una sola fuente de verdad. Si alguna de esas dos funciones no se llama en el
momento correcto, el contador se puede desincronizar del número real de
préstamos activos.
