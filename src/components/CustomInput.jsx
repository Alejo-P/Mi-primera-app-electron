import React, { useState } from 'react'
import { motion } from "framer-motion";
import { MdOutlinePassword } from "react-icons/md";
import { FiUser, FiMail, FiShield, FiFile } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { IoText } from "react-icons/io5";

// Importamos las constantes
import { THEMES } from '@constants/temas';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';

const CustomInput = ({
    Iname,
    Itype = "text",
    Ivalue,
    IonChange,
    Iplaceholder,
    Idisabled = false,
    Irequired = false,
    Iaccept = null,
    Iref = null,
    ImaxLength = null,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { tema } = useApp();
    const isDark = tema === THEMES.DARK; // Verificamos si el tema es oscuro

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="flex flex-col">
            <label htmlFor={Iname} className="font-bold title flex justify-between items-center">
                {Iplaceholder}:
                {Irequired && <span className="text-red-500 text-sm uppercase">(Requerido)</span>}
            </label>
            <div className="flex flex-col relative">
                <input
                    type={
                        Itype === "password" ? (showPassword ? "text" : "password") :
                        Itype === "email" ? "email" :
                        Itype === "username" ? "text" :
                        Itype === "security" ? "text" :
                        Itype === "file" ? "file" :
                        Itype
                    }
                    id={Iname}
                    name={Iname}
                    {...(Itype !== "file" ? { value: Ivalue } : {})}
                    onChange={IonChange}
                    ref={Iref}
                    maxLength={ImaxLength}
                    className={`border border-gray-300 p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}`}
                    placeholder={Iplaceholder}
                    title={Iplaceholder}
                    disabled={Idisabled}
                    required={Irequired}
                    accept={Iaccept}
                />
                <div className="absolute top-2 left-2 text-gray-400 group-hover:left-3 transition-all duration-300 text-center">
                    {
                        Itype === "text" ? <IoText className="text-2xl" /> :
                        Itype === "email" ? <FiMail className="text-2xl" /> :
                        Itype === "password" ? <MdOutlinePassword className="text-2xl" /> :
                        Itype === "username" ? <FiUser className="text-2xl" /> :
                        Itype === "security" ? <FiShield className="text-2xl" /> :
                        Itype === "file" ? <FiFile className="text-2xl" /> :
                        <IoText className="text-2xl" />
                    }
                </div>
                {Itype === "password" && (
                    <motion.div
                        className={`absolute right-2 top-2 cursor-pointer ${Ivalue ? 'block' : 'hidden'}`}
                        onClick={handlePasswordVisibility}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        initial={{ scale: 1, opacity: 1 }}
                        whileTap={{ scale: 0.8, opacity: 0.7 }}  // 🔥 Rebote al presionar
                        transition={{ duration: 0.2, ease: "easeInOut" }}  // Suaviza el efecto
                    >
                        {showPassword ? <IoIosEyeOff className="text-2xl" /> : <IoIosEye className="text-2xl" />}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default CustomInput
