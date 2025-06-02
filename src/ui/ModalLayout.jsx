import React from 'react'

const ModalLayout = ({
    isDark,
    children,
    handleModal,
    closeOnFocusOut = true
}) => {

    const handleClose = () => {
        if (handleModal) {
            setTimeout(() => {
                handleModal();
            }, 200);
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={closeOnFocusOut ? handleClose : undefined}
            onKeyDown={(e) => {
                if (e.key === 'Escape' && closeOnFocusOut) {
                    handleClose();
                }
            }}
            tabIndex={-1}
        >
            <div
                className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl z-50
                    ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    relative flex flex-col items-center max-h-screen overflow-auto`
                }
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default ModalLayout
