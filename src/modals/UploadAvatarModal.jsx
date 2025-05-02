import React, { useEffect, useState, useRef } from 'react'
import { IoClose } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useAuth } from '../contexts/AuthProvider';

// Importamos los componentes
import CustomInput from '../components/CustomInput';

const UploadAvatarModal = ({ handleModal }) => {
    const { tema, setNavActionsItems, handleNotificacion } = useApp();
    const { user, uploadAvatar, loading } = useAuth();
    const [avatar, setAvatar] = useState(null); // Estado para almacenar el archivo de imagen
    const [preview, setPreview] = useState(null); // Estado para almacenar la vista previa de la imagen
    const fileInput = useRef(null); // Referencia al input de archivo
    const isDark = tema === THEMES.DARK;

    const handleClose = async () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setAvatar(null); // Restablece el estado del archivo al seleccionar uno nuevo
        setPreview(null); // Restablece la vista previa al seleccionar uno nuevo
        setAvatar(selectedFile);
        if (selectedFile) {
            // Validar si la imagen es cuadrada
            const img = new Image();
            img.src = URL.createObjectURL(selectedFile);
            img.onload = () => {
                if (img.width !== img.height) {
                    handleNotificacion('error', 'La imagen debe ser cuadrada', 5000);
                    setAvatar(null); // Restablece el estado del archivo si no es cuadrada
                    setPreview(null); // Restablece la vista previa si no es cuadrada
                    fileInput.current.value = null; // Limpia el input de archivo
                    return;
                }
                // Si la imagen es cuadrada, se establece la vista previa
                else {
                    setPreview(URL.createObjectURL(selectedFile)); // Crea una URL de objeto para la vista previa
                    setTimeout(() => {
                        URL.revokeObjectURL(img.src); // Libera la URL del objeto después de usarla
                    }, 1000);
                }
            };
            img.onerror = () => {
                handleNotificacion('error', 'Error al cargar la imagen', 5000); // Maneja el error de carga de la imagen
                setAvatar(null); // Restablece el estado del archivo si hay un error
            }
        } else {
            setPreview(null); // Si no hay archivo, restablece la vista previa
            setAvatar(null); // Si no hay archivo, restablece el estado del archivo
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        if (!avatar) return; // Si no hay archivo, no hacemos nada

        const confirm = window.confirm(`¿Subir avatar "${avatar.name}"?`);
        if (!confirm) return; // Si el usuario cancela, no hacemos nada

        const formData = new FormData();
        formData.append('file', avatar); // Agrega el archivo al FormData
        formData.append('user_id', user.id); // Agrega el ID del usuario al FormData

        await uploadAvatar(formData); // Llama a la función para subir el avatar
        setAvatar(null); // Restablece el estado del archivo
        setPreview(null); // Restablece la vista previa
        setTimeout(() => {
            handleModal(); // Cierra el modal después de subir el avatar
        }, 200);
    };

    useEffect(() => {
        const acciones = [
            {
                key: 'subir',
                element: (
                    <button
                        type="submit"
                        form="uploadAvatarForm"
                        className={`p-2 rounded-lg transition-all duration-300
                            ${(!avatar || loading) ? 'cursor-not-allowed bg-gray-300 text-gray-500' 
                                :  isDark ? 'bg-blue-600 text-white' 
                                : 'bg-blue-400 text-gray-900 hover:bg-gray-400'
                            }
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Subir"
                        data-tooltip-id="uploadLabel"
                        data-tooltip-content={`${avatar ? 'Subir avatar' : 'Selecciona un archivo primero'}`}
                        disabled={!avatar || loading} // Deshabilitar el botón si no hay archivo seleccionado
                    >
                        {loading ? <ImSpinner9 className="animate-spin text-2xl" /> : <FaUpload className="text-2xl" />}
                    </button>
                )
            },
            {
                key: 'cerrar',
                element: (
                    <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Cerrar"
                        data-tooltip-id="closeLabel"
                        data-tooltip-content="Cerrar ventana de información del archivo"
                        onClick={handleClose}
                    >
                        <IoClose className="text-2xl" />
                    </button>
                )
            }
        ];
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        }
    }, [avatar, isDark, loading]); // Se ejecuta cuando cambia el estado del avatar o el tema

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className="text-xl md:text-2xl text-center font-bold w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                    Cambiar avatar
                </h2>
                <form className="mt-4 w-full flex flex-col gap-4" onSubmit={handleSubmit} id="uploadAvatarForm">
                    <CustomInput
                        Itype="file"
                        Iname="avatar"
                        Iplaceholder="Selecciona una imagen"
                        IclassName="mt-4 w-full"
                        Irequired
                        IonChange={handleFileChange}
                        Iaccept="image/*"
                        Idisabled={loading} // Deshabilitar el input si está cargando
                        Iref={fileInput} // Asignar la referencia al input de archivo
                    />
                </form>
                <p className="mt-2 w-full text-sm text-center text-gray-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                    Selecciona una imagen para tu avatar (la imagen debe ser cuadrada)
                </p>
                <div className="mt-4 w-full flex justify-center items-center">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Vista previa del avatar"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                        />
                    ) : (
                        <p className="text-gray-500 font-semibold">Selecciona una imagen para obtener una vista previa del avatar</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UploadAvatarModal
