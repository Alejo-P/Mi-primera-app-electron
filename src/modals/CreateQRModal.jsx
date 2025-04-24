import React, { useEffect, useState } from 'react';
import { Tooltip as ReactToolTip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

// Importamos los componentes
import CustomInput from '../components/CustomInput';

const CreateQRModal = ({ handleModal }) => {
    const { tema, setNavActionsItems } = useApp();
    const { createQR } = useQR();
    const isDark = tema === THEMES.DARK;

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

    const handleClose = async () => {
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
        const acciones = [
            {
                key: 'crear',
                element: (
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
                )
            },
            {
                key: 'cerrar',
                element: (
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
                )
            }
        ];
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className="text-2xl text-center font-bold">Crear un QR</h2>
                <div className="mt-4 w-full flex flex-col gap-4">
                    {[
                        { placeholder: "Nombre del archivo QR", name: "QRname", disabled: false, type: "text", optional:true },
                        { placeholder: "Texto del QR", name: "QRtext", disabled: false, type: "text", optional:false },
                        { placeholder: "Seleccione un icono para el QR", name: "QRicon", disabled: false, type: "file", optional:true }
                    ].map((field, index) => (
                        <div key={index} className="w-full">
                            <CustomInput
                                key={index}
                                Itype={field.type}
                                Iname={field.name}
                                Ivalue={field.name === "QRicon" ? undefined : QRForm[field.name]}
                                IonChange={handleChanges}
                                Iplaceholder={field.placeholder}
                                Idisabled={field.disabled}
                                Irequired={!field.optional}
                                Iaccept={field.type === "file" ? "image/*" : null}
                            />
                            <p className="text-gray-400 text-sm">
                                <small>
                                    {field.optional ? "Este campo es opcional." : "Este campo es obligatorio."}
                                    {field.type === "file" && " Se recomienda un icono cuadrado (100x100 px) en formato PNG."}  
                                </small>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateQRModal;
