import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    loading = false,
    disabled = false,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
        outline: "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800 focus:ring-slate-500"
    };

    const classes = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {children}
        </motion.button>
    );
};

export default Button;
