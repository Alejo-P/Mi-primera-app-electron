import React from 'react'

const NavButtonSqueleton = ({ isDark }) => {
    const bgBase = isDark ? 'bg-gray-700' : 'bg-gray-300';
    const tooltipBg = isDark ? 'bg-gray-600' : 'bg-gray-200';

    return (
        <div
            className={`group h-full w-full flex flex-col items-center justify-between rounded-lg transition-transform duration-300 
                ${bgBase} text-gray-900 cursor-default shadow-lg`}
        >
            <div className="w-full h-auto flex justify-center items-center p-2 flex-1">
                <div className={`w-8 h-8 rounded-full ${tooltipBg} shimmer`}></div>
            </div>
            <div className={`w-full h-auto transition-transform duration-300 flex
                justify-center items-center text-xs font-semibold p-1 border-t rounded-b-lg
                ${tooltipBg} border-gray-800`}
            >
                <div className={`w-16 h-4 rounded ${tooltipBg} shimmer`}></div>
            </div>
        </div>
    );
};

export default NavButtonSqueleton;
