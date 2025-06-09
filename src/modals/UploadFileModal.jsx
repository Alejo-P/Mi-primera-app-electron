import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IoClose } from "react-icons/io5";
import { FaUpload } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';

// Importamos los componentes
import ModalLayout from '@ui/ModalLayout';
import CustomInput from '@components/CustomInput';
import FileBarCard from '@components/FileBarCard';

const UploadFileModal = ({ isDark, handleModal }) => {
    const { extensiones, maxSize, convertUnit, handleNotificacion, setNavActionsItems } = useApp();
    const { uploadFile, loadingFiles } = useFiles();
    const fileInput = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [uploadProgress, setUploadProgress] = useState({
        current: 0,
        total: 0,
        done: false
    });
    // Lista de archivos seleccionados
    const [filesList, setFilesList] = useState([]);
    const acceptedExtensions = useMemo(() => extensiones.map(ext => `.${ext}`).join(', '), [extensiones]);

    const handleClose = () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    }

    const sumFileSizes = (files) => {
        return files.reduce((total, file) => total + file.size, 0);
    }

    const resetFileInput = () => {
        if (fileInput.current) {
            fileInput.current.value = null;
        }
    };

    const handleDeleteFile = (index) => {
        setFilesList(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles.splice(index, 1);
            return newFiles;
        });
        resetFileInput(); // Limpiar el input de archivo
        handleNotificacion('info', 'Archivo eliminado de la lista', 3000);
    }

    const handleChargeFile = async (e) => {
        const selectedFiles = Array.from(e.target.files); // Convertir a array real
        const newFiles = [];

        selectedFiles.forEach(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!extensiones.includes(extension)) {
                handleNotificacion('error', `Extensión inválida: ${file.name}`, 5000);
                return;
            }

            if (file.size > maxSize) {
                handleNotificacion('error', `Archivo muy grande: ${file.name}, máximo ${convertUnit(maxSize, "MB")}`, 5000);
                return;
            }

            newFiles.push({
                ...file,
                uploaded: false,
                error: false,
                pending: false,
                uploading: false,
            });
        });
        // Continuar con la carga de multiples archivos...

        if (newFiles.length > 0) {
            setFilesList(prevFiles => [...prevFiles, ...newFiles]);
        }

        resetFileInput();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (filesList.length === 0) return;

        const invalidFile = filesList.find(file =>
            !extensiones.includes(file.name.split('.').pop().toLowerCase()) || file.size > maxSize
        );
        if (invalidFile) {
            handleNotificacion('error', `Archivo inválido: ${invalidFile.name}`, 4000);
            return;
        }

        try {
            const filesData = await Promise.all(filesList.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result.split(',')[1];
                        resolve({
                            filename: file.name,
                            filetype: file.type,
                            filebase64: base64,
                            size: file.size
                        });
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });
            }));

            setUploadProgress({ current: 0, total: filesData.length, done: false });

            for (let i = 0; i < filesData.length; i++) {
                const data = filesData[i];
                // Actualizar el estado del archiv en la lista (uploading)
                setFilesList(prevFiles => {
                    const newFiles = [...prevFiles];
                    newFiles[i] = { ...newFiles[i], uploading: true, pending: false, uploaded: false, error: false };
                    return newFiles;
                });
                // Subir el archivo
                const success = await uploadFile(data);
                if (!success) {
                    // Actualizar el estado del archivo en la lista (error)
                    setFilesList(prevFiles => {
                        const newFiles = [...prevFiles];
                        newFiles[i] = { ...newFiles[i], uploading: false, pending: false, uploaded: false, error: true };
                        return newFiles;
                    });

                    throw new Error(`Error al subir ${data.filename}`)
                };
                setUploadProgress(prev => ({ ...prev, current: i + 1 }));
                // Actualizar el estado del archivo en la lista (uploaded)
                setFilesList(prevFiles => {
                    const newFiles = [...prevFiles];
                    newFiles[i] = { ...newFiles[i], uploading: false, pending: false, uploaded: true, error: false };
                    return newFiles;
                });
            }

            setUploadProgress(prev => ({ ...prev, done: true }));

            // Si todo fue exitoso:
            setFilesList([]); // Limpiar la lista de archivos
            resetFileInput(); // Limpiar el input de archivo
            handleClose();
        } catch (error) {
            console.error("Error al subir archivos:", error);
            handleNotificacion('error', `Error al subir archivos: ${error.message}`, 5000);
            // Limpiar la lista de archivos en caso de error
            setFilesList([]);
            resetFileInput(); // Limpiar el input de archivo
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
                            ${((filesList.length === 0) || loadingFiles) ? 'cursor-not-allowed bg-gray-300 text-gray-500' 
                                :  isDark ? 'bg-blue-600 text-white' 
                                : 'bg-blue-400 text-gray-900 hover:bg-gray-400'
                            }
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Subir"
                        data-tooltip-id="uploadLabel"
                        data-tooltip-content={`${((filesList.length === 0) || loadingFiles) ? 'Selecciona un archivo primero' : 'Subir archivo'}`}
                        disabled={(filesList.length === 0) || loadingFiles} // Deshabilitar el botón si no hay archivo seleccionado
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
    }, [isDark, filesList, loadingFiles]);

    useEffect(() => {
        // Actualizar el total de tamaño de los archivos seleccionados
        const total = sumFileSizes(filesList);
        setTotalSize(total);
    }, [filesList]);

    return (
        <ModalLayout isDark={isDark} handleModal={handleModal} closeOnFocusOut={true}>
            <>
                <h2 className="text-2xl font-bold mb-4">Subir Archivo</h2>
                <form id="uploadFileForm" className="mt-4 w-full flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
                    <p className="text-gray-400 text-sm">Arrastra y suelta tu archivo aquí o haz clic para seleccionar uno.</p>
                    <div className="w-full">
                        <CustomInput
                            Iname="file"
                            Itype="file"
                            IonChange={handleChargeFile}
                            Iplaceholder="Selecciona un archivo"
                            Idisabled={false}
                            Iaccept={acceptedExtensions}
                            Irequired={true}
                            Iref={fileInput}
                            Imultiple={true}
                        />
                        <p className="text-gray-400 text-sm"><small>Tamaño máximo: {convertUnit(maxSize)}.</small></p>
                        <p className="text-gray-400 text-sm"><small>Extensiones permitidas: {extensiones.join(', ')}.</small></p>
                    </div>
                </form>
                {uploadProgress.total > 0 && !uploadProgress.done && (
                    <p className="text-sm text-yellow-500 font-semibold">
                        Subiendo {uploadProgress.current} de {uploadProgress.total} archivo(s)...
                    </p>
                )}

                {uploadProgress.done && (
                    <p className="text-sm text-green-500 font-semibold">
                        Se subieron correctamente {uploadProgress.total} archivo(s).
                    </p>
                )}
                <div className="mt-4 w-full">
                    <h3 className="text-lg text-center font-semibold mb-2">Archivos seleccionados:</h3>
                    {
                        filesList.length === 0 ? (
                            <p className="text-gray-500 text-center">No hay archivos seleccionados.</p>
                        ) : (
                            <>
                                <div className="mb-2 max-h-40 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar">
                                    {filesList.map((file, index) => (
                                        <FileBarCard
                                            key={index}
                                            file={file}
                                            handleDeleteFile={() => handleDeleteFile(index)}
                                            isDark={isDark}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-row items-center justify-between gap-2">
                                    <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Tamaño total: {convertUnit(totalSize)}
                                    </p>
                                    <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total de archivos: {filesList.length}
                                    </p>
                                </div>
                            </>
                        )
                    }
                </div>
            </>
        </ModalLayout>
    )
}

export default UploadFileModal
