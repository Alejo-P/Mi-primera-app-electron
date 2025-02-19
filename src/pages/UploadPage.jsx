import React, { useState, useRef } from 'react'
import { FaQrcode, FaUpload } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'
import { useFiles } from '../contexts/FilesProvider'

const UploadPage = () => {
    const { extensiones, maxSize, convertUnit } = useApp()
    const { uploadFile, handleNotificacion, notificacion } = useFiles()
    const fileInput = useRef(null)
    const [file, setFile] = useState(null)

    const handleChargeFile = async (e) => {
        let file = e.target.files[0]
        setFile(null);

        // Si no se selecciona ningún archivo
        if (!file) return

        // Comprobamos que el archivo sea válido
        const extension = file.name.split('.').pop();
        if (!extensiones.includes(extension)) {
            handleNotificacion('error', 'La extension del archivo no es válida', 5000)
            // Limpiar el input
            fileInput.current.value = ''
            return
        }

        // Comprobamos que el archivo no sea muy grande
        if (file.size > maxSize) {
            handleNotificacion('error', 'El archivo es muy grande, máximo 16 MB', 5000)
            // Limpiar el input
            fileInput.current.value = ''
            return
        }

        // Actualizamos el estado de File
        setFile(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        await uploadFile(formData)
        // Limpiar el input
        fileInput.current.value = ''
        setFile(null)
    }

    return (
        <div>
            <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white w-full">
                <h2 className="text-2xl text-center text-slate-800 font-bold">
                    Selecciona un archivo para subir
                </h2>

                <form className="flex flex-col md:flex-row items-center justify-center p-4" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <input
                        type="file"
                        name="file"
                        id="fileInput"
                        className="border text-gray-900 border-gray-300 p-2 rounded-lg w-full mr-3 md:w-1/2 mt-4 md:mt-0 transition-all duration-300"
                        title="Selecciona un archivo"
                        onChange={handleChargeFile}
                        ref={fileInput}
                        required
                    />
                    <button
                        type="submit"
                        className={`block text-center text-blue-500 font-bold p-2 rounded-lg w-full md:w-1/4 mt-4 md:mt-0 transition-all duration-300 ${file ? 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white' : 'bg-gray-300 text-gray-500'}`}
                        data-tooltip-id="uploadLabel"
                        data-tooltip-content="Cargar un archivo al servidor"
                        style={{ cursor: `${file ? 'pointer' : 'not-allowed'}` }}
                        disabled={!file}
                    >
                        <span>
                            <FaUpload className="inline-block"/>
                            Subir archivo
                        </span>
                    </button>
                </form>
                <ReactTooltip id="uploadLabel" place="top" effect="solid" />

                <p className="text-center text-gray-500 mt-4">
                    <small>Máximo tamaño permitido: <span>{convertUnit(maxSize)} MB</span></small> <br/>
                    <small> Las extensiones de archivos permitidas son <span>{extensiones.join(', ')}</span></small>
                </p>
            </div>
        </div>
    )
}

export default UploadPage
