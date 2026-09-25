// prestamos.js — Responsabilidad: gestionar el ciclo de vida de los préstamos.
// IMPORTANTE: este módulo NO importa avisos.js a propósito (ver ADR-001 del taller).

import { hayDisponible, reservarCopia, liberarCopia, buscarLibro } from './catalogo.js';
import { avisarPrestamo } from './avisos.js';

const prestamos = [];
let siguienteId = 1;

export function prestarLibro(libroId, socio) {
  if (!socio || socio.trim() === "") {
    throw new Error("El nombre del socio es obligatorio.");
  }
  if (!hayDisponible(libroId)) {
    throw new Error("El libro no tiene copias disponibles.");
  }

  reservarCopia(libroId);

  const prestamo = {
    id: siguienteId++,
    libroId,
    socio,
    fechaPrestamo: new Date().toISOString(),
    fechaDevolucion: null,
    activo: true,
  };
  prestamos.push(prestamo);
  return { ...prestamo };
}

export function devolverLibro(prestamoId) {
  const prestamo = prestamos.find(p => p.id === prestamoId);
  if (!prestamo) {
    throw new Error("Préstamo no encontrado.");
  }
  if (!prestamo.activo) {
    throw new Error("Este préstamo ya fue devuelto.");
  }

  liberarCopia(prestamo.libroId);
  prestamo.activo = false;
  prestamo.fechaDevolucion = new Date().toISOString();
  return { ...prestamo };
}

export function listarPrestamos() {
  return prestamos.map(p => ({
    ...p,
    libro: buscarLibro(p.libroId),
  }));
}

export function listarPrestamosActivos() {
  return listarPrestamos().filter(p => p.activo);
}
