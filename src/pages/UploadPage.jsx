import React, { useState, useRef } from 'react'
import { FaQrcode, FaUpload } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link } from 'react-router-dom';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider'

// Importamos los compomentes
import HeaderNav from '../components/HeaderNav';
import Notification from '../components/Notification';

const UploadPage = () => {
    const { extensiones, handleNotificacion, notificacion } = useApp()
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
        if (file.size > 16777216) {
            handleNotificacion('error', 'El archivo es muy grande, máximo 16 MB', 5000)
            // Limpiar el input
            fileInput.current.value = ''
            return
        }

        // Actualizamos el estado de File
        setFile(file);
    }

    return (
        <div>
            <HeaderNav text={"Subir un archivo"}/>
            <div className="flex flex-col items-center align-center h-full m-4 p-4 border border-gray-300 rounded-lg bg-gray-300">
                {notificacion && <Notification {...notificacion} />}

                <div className="relative overflow-x-auto shadow-lg sm:rounded-lg m-3 p-3 bg-white w-full">
                    <h2 className="text-2xl text-center text-slate-800 font-bold">
                        Selecciona un archivo para subir
                    </h2>

                    <form className="flex flex-col md:flex-row items-center justify-center p-4" encType="multipart/form-data">
                        <input
                            type="file"
                            name="file"
                            id="fileInput"
                            className="border border-gray-300 p-2 rounded-lg w-full mr-3 md:w-1/2 mt-4 md:mt-0 transition-all duration-300"
                            title="Selecciona un archivo"
                            onChange={handleChargeFile}
                            ref={fileInput}
                            required
                        />
                        <button
                            id="uploadBtn"
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
                        <small>Máximo 16 MB</small> <br/>
                        <small> Las extensiones de archivos permitidas son <span>{extensiones.join(', ')}</span></small>
                    </p>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 flex flex-col items-center align-center">
                <Link
                    to="/qr"
                    title="Mostrar QRs"
                    className="bg-slate-500 text-white w-12 h-12 flex items-center text-center justify-center rounded-lg shadow-[0_0_15px_4px_rgba(130,129,129,0.7)] hover:shadow-[0_0_25px_6px_rgba(130,129,129,1)] hover:scale-110 transition-transform duration-300 animate-glow mb-4"
                    data-tooltip-id='QRLabel'
                    data-tooltip-content="Ver QRs generados"
                >
                    <FaQrcode className="text-2xl"/>           
                </Link>
            
                <Link
                    to="/files"
                    className="bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-lg shadow-[0_0_15px_4px_rgba(59,130,246,0.7)] hover:shadow-[0_0_25px_6px_rgba(59,130,246,1)] hover:scale-110 transition-transform duration-300 animate-glow"
                    title="Mostrar archivos cargados"
                    data-tooltip-id="FilesLabel"
                    data-tooltip-content="Ver archivos cargados"
                >
                    <FaRegFileAlt className="text-2xl"/>
                </Link>
                <ReactTooltip id="QRLabel" place="top" effect="solid" />
                <ReactTooltip id="FilesLabel" place="top" effect="solid" />
            </div>
        </div>
    )
}

export default UploadPage
