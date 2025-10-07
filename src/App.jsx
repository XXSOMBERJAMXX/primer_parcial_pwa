import { useState, useEffect } from 'react';
import { Package, Zap, Cookie } from 'lucide-react';

const productosData = [
  { id: 1, nombre: "Contenido Principal", descripcion: 'Accede a la info desde tu campus', categoria: "Inicio" },
  { id: 13, nombre: "Noticia", descripcion: 'Hoy cirree en puerta 5', categoria: "Inicio" },
  { id: 14, nombre: "Noticia", descripcion: 'Aplica a la beca de jovenes', categoria: "Inicio" },

  { id: 2, nombre: "Matematicas", descripcion: 'Calificación: 10', categoria: "Materias" },
  { id: 3, nombre: "Educación fisica", descripcion: 'Calificación: 8', categoria: "Materias" },
  { id: 4, nombre: "Aplicaciones Progresivas", descripcion: 'Calificación: 10 (Excelente)', categoria: "Materias" },
  { id: 5, nombre: "Química", descripcion: 'Calificación: reprobado', categoria: "Materias" },

  { id: 6, nombre: "Matematicas", descripcion: 'Horario: 8:00 - 10:00', categoria: "Horarios" },
  { id: 7, nombre: "Educación fisica", descripcion: 'Horario: 10:00 - 12:00', categoria: "Horarios" },
  { id: 8, nombre: "Aplicaciones Progresivas", descripcion: 'Horario: 12:00 - 14:00', categoria: "Horarios" },
  { id: 9, nombre: "Química", descripcion: 'Horario: 14:00 - 16:00', categoria: "Horarios" },

  { id: 10, nombre: "Nombre", descripcion: 'Diego Morales Rodríguez', categoria: "Perfil" },
  { id: 11, nombre: "Calificación general", descripcion: '9.5 (mejor promedio)', categoria: "Perfil" },
  { id: 12, nombre: "Grupo", descripcion: 'IDGS10', categoria: "Perfil" },
  
];


function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Simular carga de productos dinámicos (como si viniera de una API)
  useEffect(() => {
    // Simular latencia de red
    setTimeout(() => {
      setProductos(productosData);
      setCargando(false);
    }, 500);
  }, []);

  const productosFiltrados = productos.filter(p => p.categoria === categoriaActiva);

  const categorias = [
    { nombre: 'Inicio', icono: <Package className="w-5 h-5" /> },
    { nombre: 'Materias', icono: <Zap className="w-5 h-5" /> },
    { nombre: 'Horarios', icono: <Cookie className="w-5 h-5" /> },
    { nombre: 'Perfil', icono: <Cookie className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Splash screen */}
      {cargando && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white grid items-center justify-center z-999">
          <div className="text-6xl font-bold animate-pulse">TiendaCampus</div>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>Cargando aplicación...</p>
        </div>
      )}
      {/* Menú de categorías - parte del shell pero con interactividad */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 m-8 overflow-x-auto" >
            {categorias.map(cat => (
              <button
                key={cat.nombre}
                onClick={() => setCategoriaActiva(cat.nombre)}
                className={`flex items-center gap-2 px-4  py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  categoriaActiva === cat.nombre
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ margin: '10px 0', padding: '8px 16px' }}
              >
                {cat.icono}
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido dinámico - esto cambia según los datos */}
      <main className="max-w-4xl mx-auto px-4 py-8" style={{marginTop: '20px'}}>
        {cargando ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productosFiltrados.map(producto => (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-semibold text-indigo-600 mb-2">
                  {producto.nombre}
                </h3>
                <p className="text-md font-bold text-gray-800">
                  {producto.descripcion}
                </p>
                
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default App;