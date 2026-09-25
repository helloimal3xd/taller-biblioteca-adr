// catalogo.js — Responsabilidad: gestionar el catálogo de libros y su disponibilidad.

const libros = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", copias: 3, disponibles: 3 },
  { id: 2, titulo: "El nombre de la rosa", autor: "Umberto Eco", copias: 2, disponibles: 2 },
  { id: 3, titulo: "1984", autor: "George Orwell", copias: 4, disponibles: 4 },
];

let siguienteId = 4;

export function listarLibros() {
  return libros.map(l => ({ ...l }));
}

export function agregarLibro(titulo, autor, copias) {
  const libro = { id: siguienteId++, titulo, autor, copias, disponibles: copias };
  libros.push(libro);
  return { ...libro };
}

export function buscarLibro(id) {
  const libro = libros.find(l => l.id === id);
  return libro ? { ...libro } : null;
}

export function hayDisponible(id) {
  const libro = libros.find(l => l.id === id);
  return !!libro && libro.disponibles > 0;
}

export function reservarCopia(id) {
  const libro = libros.find(l => l.id === id);
  if (!libro || libro.disponibles <= 0) {
    throw new Error("No hay copias disponibles de este libro.");
  }
  libro.disponibles -= 1;
  return { ...libro };
}

export function liberarCopia(id) {
  const libro = libros.find(l => l.id === id);
  if (!libro) {
    throw new Error("Libro no encontrado.");
  }
  if (libro.disponibles < libro.copias) {
    libro.disponibles += 1;
  }
  return { ...libro };
}
