import React from 'react'

const CreateQRModal = () => {
    return (
        <div id="modal" className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-11/12 md:max-w-lg mx-auto rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center">
                    <p id="messageModal" className="text-center font-bold mt-4"></p>
                </div>
                <h2 className="text-2xl text-center text-slate-800 font-bold">Crear un QR</h2>
                <div className="mt-4">
                    <label for="QRname" className="text-slate-800 font-bold">Nombre del QR (opcional)</label>
                    <input type="text" id="QRname" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ingresa un nombre para el QR"/>
                    <p className="text-gray-500 text-sm">
                        <small>Este nombre será visible en la lista de QRs generados. Si no se especifica, el nombre sera el nombre del archivo.</small>
                    </p>
                </div>  
                <div className="mt-4">
                    <label for="QRtext" className="text-slate-800 font-bold">Texto</label>
                    <input type="text" id="QRtext" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ingresa el texto personalizado para generar un QR" required/>
                </div>
                <div className="mt-4">
                    <label for="QRicon" className="text-slate-800 font-bold">Seleccione un icono para el QR (opcional)</label>
                    <input type="file" id="QRicon" className="w-full p-2 border border-gray-300 rounded-lg" accept="image/*" required/>
                    <p className="text-gray-500 text-sm">
                        <small>
                            La imagen debe ser <b>cuadrada</b> (idealmente <b>100x100 px</b>) y estar en <b>formato PNG</b>.  
                            Evite imágenes demasiado grandes, ya que pueden bloquear el código QR.<br/>
                            Se recomienda un fondo <b>transparente o contrastante</b> con el QR.
                        </small> <small>El icono debe ser cuadrado y de preferencia en formato PNG</small>
                    </p>
                </div>
                <div className="mt-4">
                    <button id="createQR" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" onclick="createQR()">Crear QR</button>
                </div>
            </div>
        </div>
    )
}

export default CreateQRModal
