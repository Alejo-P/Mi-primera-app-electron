import React, { useState, useEffect, useRef } from 'react';
import { FaUpload } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos las constantes
import { THEMES } from '@constants/temas';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';

// Importamos los componentes
import CustomInput from '@components/CustomInput';

const UploadPage = () => {
    const { extensiones, maxSize, convertUnit, handleNotificacion, tema, setNavActionsItems } = useApp();
    const { uploadFile, loadingFiles } = useFiles();
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);
    const isDark = tema === THEMES.DARK;

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
        await uploadFile(data);
        setFile(null);
        fileInput.current.value = null; // Limpiar el input de archivo
    };

    useEffect(() => {
        setNavActionsItems([]);
    }, []);

    return (
        <>
            <h2 className="text-2xl text-center font-bold">Selecciona un archivo para subir</h2>

            <form className="flex flex-col md:flex-row items-center justify-center w-full p-4" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="w-full">
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
                </div>
                <button
                    type="submit"
                    className={`block text-center font-bold p-2 m-2 rounded-lg w-full transition-all duration-300
                        ${(!file || loadingFiles) ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                            : isDark ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-95'
                            : 'bg-blue-400 text-gray-900 hover:bg-gray-500 hover:scale-95'
                        }
                        shadow-lg hover:shadow-xl
                    `}
                    data-tooltip-id="uploadLabel"
                    data-tooltip-content={file ? 'Cargar un archivo al servidor' : 'Selecciona un archivo primero'}
                    disabled={!file || loadingFiles} // Deshabilitar el botón si no hay archivo seleccionado o si está cargando
                    title={file ? 'Cargar un archivo al servidor' : 'Selecciona un archivo primero'}
                >
                    {
                        loadingFiles ? (
                            <>
                                <ImSpinner9 className="inline-block mr-2 animate-spin" />
                                <span>Subiendo archivo</span>
                            </>
                        ) : (
                            <>
                                <FaUpload className="inline-block mr-2" />
                                Cargar archivo
                            </>
                        )
                    }
                </button>
            </form>
            <ReactTooltip id="uploadLabel" place="top" effect="solid" />

            <p className="text-center text-gray-400 mt-4 font-semibold">
                <small>Máximo tamaño permitido: <span>{convertUnit(maxSize)}</span></small> <br/>
                <small>Las extensiones de archivos permitidas son <span>{extensiones.join(', ')}</span></small>
            </p>
        </>
    );
};

export default UploadPage;
