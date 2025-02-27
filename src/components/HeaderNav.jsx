import React from 'react'

const HeaderNav = ({text, isDark}) => {
        
    return (
        <div className={`flex items-center justify-between gap-3 p-3 rounded-lg`}>
            <h1 className={`text-4xl text-center flex-1 font-bold uppercase ${isDark ? 'text-white' : 'text-gray-900'} transition-all duration-300`}>
                {text}
            </h1>
        </div>
    )
}

export default HeaderNav
