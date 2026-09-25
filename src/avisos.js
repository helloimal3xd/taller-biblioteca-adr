// avisos.js — Responsabilidad: notificar eventos de préstamo y devolución (simulado).
// A propósito, ningún otro módulo lo importa todavía salvo app.js: ver ADR-001 del taller.

export function avisarPrestamo(prestamo, libro) {
  const mensaje = `Aviso: se registró el préstamo de "${libro?.titulo ?? 'libro'}" a ${prestamo.socio}.`;
  console.log(mensaje);
  return { enviado: true, mensaje };
}

export function avisarDevolucion(prestamo, libro) {
  const mensaje = `Aviso: se registró la devolución de "${libro?.titulo ?? 'libro'}" (socio: ${prestamo.socio}).`;
  console.log(mensaje);
  return { enviado: true, mensaje };
}
