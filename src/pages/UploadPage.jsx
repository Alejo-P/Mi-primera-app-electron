import React, { useState, useRef } from 'react';
import { FaUpload } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useFiles } from '../contexts/FilesProvider';

// Importamos los componentes
import CustomInput from '../components/CustomInput';

const UploadPage = () => {
    const { extensiones, maxSize, convertUnit, handleNotificacion, tema } = useApp();
    const { uploadFile } = useFiles();
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);
    const isDark = tema === 'oscuro';

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
            handleNotificacion('error', 'El archivo es muy grande, máximo 16 MB', 5000);
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        await uploadFile(formData);
        setFile(null);
        fileInput.current.value = null; // Limpiar el input de archivo
    };

    return (
        <div className={`overflow-x-auto shadow-lg p-3 sm:rounded-lg w-full transition-all duration-300 
            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
                        ${file ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'}`}
                    data-tooltip-id="uploadLabel"
                    data-tooltip-content="Cargar un archivo al servidor"
                    disabled={!file}
                >
                    <FaUpload className="inline-block mr-2"/>
                    Cargar archivo
                </button>
            </form>
            <ReactTooltip id="uploadLabel" place="top" effect="solid" />

            <p className="text-center text-gray-400 mt-4 font-semibold">
                <small>Máximo tamaño permitido: <span>{convertUnit(maxSize)}</span></small> <br/>
                <small>Las extensiones de archivos permitidas son <span>{extensiones.join(', ')}</span></small>
            </p>
        </div>
    );
};

export default UploadPage;
