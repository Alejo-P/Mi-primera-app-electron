// RolesField.jsx
import { LuShield, LuMousePointerClick } from "react-icons/lu";
import { IoMdCloseCircle, IoMdAddCircle, IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";

const RolesField = ({
    field,
    isDark,
    userId,
    values = [],
    onClick,
    onAddEachRole,
    onDeleteEachRole,
    isAdmin = false
}) => {
    const roles = [...values];

    // Función para manejar el clic en el botón de eliminar rol
    // Se asegura de que el usuario tenga permisos para eliminar el rol
    const handleDeleteRole = (role) => {
        if (isAdmin && roles.length > 1 && onDeleteEachRole) {
            // Llama a la función onDeleteRole si está definida y el usuario tiene permisos
            userId && onDeleteEachRole(role, userId);
        }
    }

    // Función para manejar el clic en el botón de añadir rol
    // Se asegura de que el usuario tenga permisos para añadir el rol
    const handleAddRole = (role) => {
        if (isAdmin && roles.length && onAddEachRole) {
            // Llama a la función onAddRole si está definida y el usuario tiene permisos
            userId && onAddEachRole(role, userId);
        }
    }

    // Función para manejar el clic en el botón de añadir rol
    const handleClick = () => {
        if (isAdmin && roles.length >= 1 && onClick) {
            // Llama a la función onClick si está definida y el usuario tiene permisos (acciona el modal)
            onClick();
        }
    }

    return (
        <div className="flex flex-col">
            {/* Etiqueta del campo */}
            {
                field?.placeholder && (
                    <label htmlFor={field.name} className="font-bold title flex justify-between items-center">
                        {field.placeholder}:
                    </label>
                )
            }
            {/* Contenedor del campo de roles */}
            <div className="relative">
                {/* Ícono a la izquierda */}
                <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 group-hover:left-3 transition-all duration-300 bg-transparent text-center ${isDark ? 'text-white border-gray-700' : 'text-gray-900 border-gray-300'}`}>
                    {field?.type === "security" ? <LuShield className="text-2xl" /> : <LuMousePointerClick className="text-2xl" />}
                </div>

                {/* Contenedor visual */}
                <div
                    className={`border pl-10 pr-2 py-2 flex flex-wrap gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDark ? 'bg-gray-700 text-white border-gray-300' : 'bg-gray-300 text-gray-900 border-gray-500'}
                    transition-all duration-300`}
                >
                    {(Array.isArray(roles) && roles.length > 0) ? (
                        roles.map((role, index) => (
                            <div
                                key={index}
                                className={`border rounded-xl flex items-center px-3 py-1 shadow-sm hover:shadow-md transition-shadow duration-200
                                ${isDark ? 'bg-gray-600 text-white border-gray-300' : 'bg-gray-100 text-gray-900 border-gray-500'}`}
                            >
                                <span className="text-sm font-medium uppercase">
                                    {role}
                                </span>

                                {(isAdmin && roles.length > 1 && onDeleteEachRole) && (
                                    <motion.div
                                        className={`ml-2 transform cursor-pointer transition-all duration-300 bg-transparent rounded-full
                                            ${isDark ? 'text-white hover:text-red-400' : 'text-gray-900 hover:text-red-500'}`}
                                        onClick={() => handleDeleteRole(role)}
                                        title="Eliminar rol"
                                        initial={{ scale: 1, opacity: 1 }}
                                        whileTap={{ scale: 0.8, opacity: 0.7 }}  // 🔥 Rebote al presionar
                                        transition={{ duration: 0.2, ease: "easeInOut" }}  // Suaviza el efecto
                                    >
                                        <IoMdCloseCircle className="text-xl" />
                                    </motion.div>
                                )}
                                {(isAdmin && roles.length && onAddEachRole) && (
                                    <motion.div
                                        className={`ml-2 rounded-full transform cursor-pointer transition-all duration-300 bg-transparent
                                            ${isDark ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-500'}`}
                                        onClick={() => handleAddRole(role)} // Acciona el modal
                                        title="Agregar rol"
                                        initial={{ scale: 1, opacity: 1 }}
                                        whileTap={{ scale: 0.8, opacity: 0.7 }}  // 🔥 Rebote al presionar
                                        transition={{ duration: 0.2, ease: "easeInOut" }}  // Suaviza el efecto
                                    >
                                        <IoMdAddCircle className="text-xl" />
                                    </motion.div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">No tienes roles asignados</div>
                    )}
                </div>

                {/* Botón para añadir rol */}
                {(isAdmin && roles.length >= 1 && onClick) && (
                    <motion.div
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-300 bg-transparent ${isDark ? 'text-white border-gray-700' : 'text-gray-900 border-gray-300'}`}
                        onClick={() => handleClick()} // Acciona el modal
                        title="Añadir rol"
                        initial={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.8, opacity: 0.7 }}  // 🔥 Rebote al presionar
                        transition={{ duration: 0.2, ease: "easeInOut" }}  // Suaviza el efecto
                    >
                        <IoMdAdd className="text-2xl" />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RolesField;