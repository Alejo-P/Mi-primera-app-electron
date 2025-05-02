// RolesField.jsx
import { FiShield } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";

const RolesField = ({ field, isDark, user, onDeleteRole }) => {
    const roles = user?.roles || [];

    const handleDeleteRole = (role) => {
        if (user?.roles?.includes("Administrador") && user?.roles?.length > 1 && onDeleteRole) {
            // Llama a la función onDeleteRole si está definida y el usuario tiene permisos
            onDeleteRole(role, user.id);
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
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiShield className="text-2xl" />
                </div>

                {/* Contenedor visual */}
                <div
                    className={`border border-gray-300 pl-10 pr-2 py-2 flex flex-wrap gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDark ? 'bg-gray-700 text-white'
                            : 'bg-gray-300 text-gray-900'
                        }
                    transition-all duration-300`}
                >
                    {Array.isArray(roles) && roles.length > 0 ? (
                        roles.map((role, index) => (
                            <div
                                key={index}
                                className={`border border-gray-300 rounded-xl flex items-center px-3 py-1 shadow-sm hover:shadow-md transition-shadow duration-200
                                ${isDark ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'}`}
                            >
                                <span className="text-sm font-medium">
                                    {role}
                                </span>

                                {(user?.roles?.includes("Administrador") && user?.roles?.length > 1 && onDeleteRole) && (
                                    <button
                                        type="button"
                                        className={`ml-1 transition-colors duration-200
                                            ${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-500'} rounded-full`}
                                        onClick={() => handleDeleteRole(role)}
                                    >
                                        <IoMdCloseCircle className="text-lg" />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">No tienes roles asignados</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolesField;