# ADR-001 · Aislar los avisos del flujo de préstamos

## Contexto
El sistema envía una notificación cada vez que se registra un préstamo o una
devolución. Ese envío depende de un servicio externo (simulado por ahora, pero
en producción sería correo o SMS), propenso a fallar por timeouts, caídas del
proveedor o errores de red. Ese servicio no debería poder afectar la operación
central del negocio: registrar el préstamo de un libro.

## Driver que manda
Un fallo al enviar el aviso de notificación no puede impedir que el préstamo
quede registrado en el sistema.

## Decisión
El módulo `prestamos.js` no importa ni llama directamente a `avisos.js`. La
llamada al aviso se dispara desde `app.js`, y solo después de que
`prestamos.js` ya confirmó y registró el préstamo — nunca antes ni como parte
de esa misma operación.

## Alternativa descartada
Llamar `avisarPrestamo()` directamente desde dentro de `prestarLibro()`, en
`prestamos.js`, apenas se resuelve el préstamo. Es lo más natural de escribir
—una función que llama a la otra en el mismo flujo— pero acopla una operación
crítica de negocio a un servicio secundario: si `avisos.js` lanza una
excepción o se cuelga, el préstamo completo fallaría aunque el libro esté
disponible y el socio tenga derecho a llevarlo.

## Qué pagamos
`app.js` queda con más responsabilidad de la que tendría en un diseño ideal:
es quien decide cuándo avisar, en vez de que ese flujo esté encapsulado en un
módulo especializado. También perdemos la garantía en tiempo de compilación
de que el aviso "siempre" se dispare — si alguien olvida llamar a
`avisarPrestamo()` desde `app.js`, el préstamo se registra igual pero nadie se
entera. Se acepta ese riesgo porque es preferible a que un fallo de
notificaciones bloquee préstamos reales.
