import React, { useEffect, useState } from 'react';
import { Tooltip as ReactToolTip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

// Importamos los componentes
import NavActions from '../components/NavActions';

const CreateQRModal = ({ handleModal }) => {
    const { visibleNav, setVisibleNav, tema } = useApp();
    const { createQR } = useQR();
    const isDark = tema === 'oscuro';

    const [QRForm, setQRForm] = useState({
        QRname: '',
        QRtext: '',
        QRicon: null  // Ahora el icono se almacena como archivo
    });

    const handleChanges = (e) => {
        const { id, value, files } = e.target;
        setQRForm((prev) => ({
            ...prev,
            [id]: files ? files[0] : value  // Guardamos el archivo correctamente
        }));
    };

    const ReloadNav = () => {
        setVisibleNav(false);
        setTimeout(() => {
            setVisibleNav(true);
        }, 200);
    };

    const handleClose = async () => {
        ReloadNav();
        setTimeout(() => {
            handleModal();
        }, 200);
    };

    const handleCreateQR = async () => {
        if (!QRForm.QRtext.trim()) {
            alert("El campo de texto es obligatorio para generar un QR.");
            return;
        }

        const confirm = window.confirm(`¿Crear QR para "${QRForm.QRtext}"?`);
        if (confirm) {
            await createQR(QRForm);
            handleModal();
        }
    };

    useEffect(() => {
        ReloadNav();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className="text-2xl text-center font-bold">Crear un QR</h2>

                <div className="mt-4 w-full">
                    <label htmlFor="name" className="font-bold">
                        Nombre del QR
                        <span className="text-gray-400 text-md">
                            <small> (opcional)</small>
                        </span>
                    </label>
                    <input
                        type="text"
                        id="Qname"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ingresa un nombre para el QR"
                        value={QRForm.QRname}
                        onChange={handleChanges}
                    />
                    <p className="text-gray-400 text-sm">
                        <small>Si no se especifica, se usará el nombre del archivo.</small>
                    </p>
                </div>  

                <div className="mt-4 w-full">
                    <label htmlFor="text" className="font-bold">
                        Texto <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="QRtext"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Ingresa el texto personalizado para el QR"
                        value={QRForm.QRtext}
                        onChange={handleChanges}
                        required
                    />
                    <p className="text-gray-400 text-sm">
                        <small>Este será el contenido del QR (URL, mensaje, etc.).</small>
                    </p>
                </div>

                <div className="mt-4 w-full">
                    <label htmlFor="icon" className="font-bold">
                        Seleccione un icono para el QR
                        <span className="text-gray-400 text-md">
                            <small> (opcional)</small>
                        </span>
                    </label>
                    <input
                        type="file"
                        id="QRicon"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        accept="image/*"
                        onChange={handleChanges}  // Ahora sí se maneja correctamente
                    />
                    <p className="text-gray-400 text-sm">
                        <small>
                            Se recomienda un icono cuadrado (100x100 px) en formato PNG.
                        </small>
                    </p>
                </div>
            </div>
            {
                visibleNav && (
                    <NavActions>
                        <button
                            onClick={handleCreateQR}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-green-600 text-white' : 'bg-green-400 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            data-tooltip-id='createQRLabel'
                            data-tooltip-content='Crear QR'
                        >
                            <FaCheck className='text-2xl' />
                        </button>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            data-tooltip-id='closeLabel'
                            data-tooltip-content='Cerrar'
                        >
                            <IoClose className='text-2xl' />
                        </button>
                        <ReactToolTip id="createQRLabel" place="top" effect="solid" className='text-white bg-white text-sm'/>
                        <ReactToolTip id="closeLabel" place="top" effect="solid" className='text-white bg-white text-sm'/>
                    </NavActions>
                )
            }
        </div>
    );
};

export default CreateQRModal;
