import React from 'react'

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const ViewFilesModal = ({ fileInfo }) => {
    const { fileTypes } = useApp()
    return (
        <div id="pdfModal" className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 relative overflow-hidden flex flex-col items-center" id="modalContent">
            <h2 className="text-2xl text-center text-slate-800 font-bold">
                {fileInfo.filename}
            </h2>

            {
                fileTypes.documents.includes(fileInfo.filename.split('.').pop()) ? (
                    <iframe
                        id="pdfViewer"
                        className="w-full h-[500px] mt-4"
                        src={fileInfo.url}
                    ></iframe>
                ) : (
                    <img
                        id="imageViewer"
                        className="w-auto h-4/5 md:h-[400px] mt-4 border-3 p-3 rounded-lg border-gray-300"
                        src={fileInfo.url}
                        alt="Imagen"
                    />
                )
            }
        </div>
    </div>
    )
}

export default ViewFilesModal
