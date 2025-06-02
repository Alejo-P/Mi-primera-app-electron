import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';

// Importamos los componentes
import ModalLayout from '@ui/ModalLayout';
import CustomInput from '@components/CustomInput';

const UploadFileModal = ({ isDark, handleModal }) => {
    const { extensiones, maxSize, convertUnit, handleNotificacion, setNavActionsItems } = useApp();
    const { uploadFile, loadingFiles } = useFiles();
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);

    const handleClose = () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    }

    const handleChargeFile = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(null);

        if (!selectedFile) return;

        const extension = selectedFile.name.split('.').pop().toLowerCase();
        if (!extensiones.includes(extension)) {
            handleNotificacion('error', 'La extensión del archivo no es válida', 5000);
            return;
        }

        if (selectedFile.size > maxSize) {
            handleNotificacion('error', `El archivo es muy grande, máximo ${convertUnit(maxSize, "MB")}`, 5000);
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const data = {
            filename: file.name,
            filetype: file.type,
            filebase64: await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]); // Obtener solo la parte base64
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            }),
            size: file.size,
        }

        // Subir el archivo al servidor
        const success = await uploadFile(data);
        if (success) {
            setFile(null);
            fileInput.current.value = null; // Limpiar el input de archivo
            handleClose(); // Cerrar el modal después de subir el archivo
        }
    };

    useEffect(() => {
        const acciones = [
            {
                key: 'subir',
                element: (
                    <button
                        type="submit"
                        form="uploadFileForm"
                        className={`p-2 rounded-lg transition-all duration-300
                            ${(!file || loadingFiles) ? 'cursor-not-allowed bg-gray-300 text-gray-500' 
                                :  isDark ? 'bg-blue-600 text-white' 
                                : 'bg-blue-400 text-gray-900 hover:bg-gray-400'
                            }
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Subir"
                        data-tooltip-id="uploadLabel"
                        data-tooltip-content={`${(!file || loadingFiles) ? 'Subir archivo' : 'Selecciona un archivo primero'}`}
                        disabled={!file || loadingFiles} // Deshabilitar el botón si no hay archivo seleccionado
                    >
                        {loadingFiles ? <ImSpinner9 className="animate-spin text-2xl" /> : <FaUpload className="text-2xl" />}
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
    }, [isDark, file, loadingFiles]);

    return (
        <ModalLayout isDark={isDark} handleModal={handleModal} closeOnFocusOut={true}>
            <>
                <h2 className="text-2xl font-bold mb-4">Subir Archivo</h2>
                <form id="uploadFileForm" className="mt-4 w-full flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    <p className="text-gray-400 text-sm">Arrastra y suelta tu archivo aquí o haz clic para seleccionar uno.</p>
                    <CustomInput
                        Iname="file"
                        Itype="file"
                        IonChange={handleChargeFile}
                        Iplaceholder="Selecciona un archivo"
                        Idisabled={false}
                        Iaccept={extensiones.map(ext => `.${ext}`).join(', ')}
                        Irequired={true}
                        Iref={fileInput}
                    />
                    <p className="text-gray-400 text-sm">Tamaño máximo: {convertUnit(maxSize)}.</p>
                    <p className="text-gray-400 text-sm">Extensiones permitidas: {extensiones.join(', ')}.</p>
                </form>
            </>
        </ModalLayout>
    )
}

export default UploadFileModal
