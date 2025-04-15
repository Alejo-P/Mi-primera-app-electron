import React from 'react'

const LandingPage = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-center mt-10">Bienvenido a la Aplicación</h1>
            <p className="text-lg text-center mt-4">Esta es una aplicación de ejemplo para demostrar el uso de React y Tailwind CSS.</p>
            <div className="flex justify-center mt-10">
                <img src="/path/to/your/image.jpg" alt="Imagen de ejemplo" className="w-1/2 rounded-lg shadow-lg" />
            </div>
            <div className="mt-10 text-center">
                <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Iniciar Sesión</a>
            </div>
            <div className="mt-10 text-center">
                <p className="text-sm text-gray-500">© 2023 Tu Nombre. Todos los derechos reservados.</p>
                <p className="text-sm text-gray-500">Desarrollado con ❤️ por Tu Nombre</p>
                <p className="text-sm text-gray-500">Versión 1.0.0</p>
                <p className="text-sm text-gray-500">Fecha de lanzamiento: 01/01/2023</p>
            </div>
        </div>
    )
}

export default LandingPage
