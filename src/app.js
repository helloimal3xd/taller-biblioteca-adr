// app.js — Responsabilidad: orquestar la interfaz (UI) y conectar los demás módulos.

import { listarLibros, agregarLibro, buscarLibro } from './catalogo.js';
import { prestarLibro, devolverLibro, listarPrestamos } from './prestamos.js';
import { avisarPrestamo, avisarDevolucion } from './avisos.js';

const $libros = document.getElementById('lista-libros');
const $prestamos = document.getElementById('lista-prestamos');
const $formPrestamo = document.getElementById('form-prestamo');
const $formLibro = document.getElementById('form-libro');
const $selectLibro = document.getElementById('select-libro');
const $mensaje = document.getElementById('mensaje');

function mostrarMensaje(texto, tipo = 'info') {
  $mensaje.textContent = texto;
  $mensaje.className = `mensaje ${tipo}`;
  setTimeout(() => {
    $mensaje.textContent = '';
    $mensaje.className = 'mensaje';
  }, 4000);
}

function renderLibros() {
  const libros = listarLibros();

  $libros.innerHTML = libros.map(l => `
    <li>
      <span><strong>${l.titulo}</strong> — ${l.autor}</span>
      <span class="badge">${l.disponibles}/${l.copias} disponibles</span>
    </li>
  `).join('');

  $selectLibro.innerHTML = libros.map(l =>
    `<option value="${l.id}">${l.titulo} (${l.disponibles} disp.)</option>`
  ).join('');
}

function renderPrestamos() {
  const prestamos = listarPrestamos();

  $prestamos.innerHTML = prestamos.map(p => `
    <li>
      <span><strong>${p.libro?.titulo ?? 'Libro eliminado'}</strong> — ${p.socio}</span>
      ${p.activo
        ? `<button data-id="${p.id}" class="btn-devolver">Devolver</button>`
        : `<span class="badge">Devuelto</span>`}
    </li>
  `).join('');

  document.querySelectorAll('.btn-devolver').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const prestamo = devolverLibro(id);
      const libro = buscarLibro(prestamo.libroId);
      avisarDevolucion(prestamo, libro);
      renderLibros();
      renderPrestamos();
      mostrarMensaje('Devolución registrada.', 'exito');
    });
  });
}

$formPrestamo.addEventListener('submit', (e) => {
  e.preventDefault();
  const libroId = Number($selectLibro.value);
  const socio = document.getElementById('input-socio').value;
  try {
    const prestamo = prestarLibro(libroId, socio);
    const libro = buscarLibro(libroId);
    avisarPrestamo(prestamo, libro);
    document.getElementById('input-socio').value = '';
    renderLibros();
    renderPrestamos();
    mostrarMensaje('Préstamo registrado.', 'exito');
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
});

$formLibro.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = document.getElementById('input-titulo').value;
  const autor = document.getElementById('input-autor').value;
  const copias = Number(document.getElementById('input-copias').value) || 1;
  agregarLibro(titulo, autor, copias);
  e.target.reset();
  renderLibros();
  mostrarMensaje('Libro agregado al catálogo.', 'exito');
});

renderLibros();
renderPrestamos();
