import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ProgressBarCard = ({ duration, trigger }) => {
    const [progress, setProgress] = useState(1);

    useEffect(() => {
        setProgress(1);
        const timeout = setTimeout(() => {
            setProgress(0);
        }, 50);
        return () => clearTimeout(timeout);
    }, [trigger]);

    return (
        <motion.div
            key={trigger}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: progress }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="origin-left bg-gradient-to-r from-white/60 to-white/30 rounded-r-full shadow-md animate-pulse"
        >
            
        </motion.div>
    );
};

export default ProgressBarCard;
