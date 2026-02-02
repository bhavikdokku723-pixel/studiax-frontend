import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Logo = ({ size = 'default' }) => {
    const { theme } = useTheme();
    
    const sizeClasses = {
        small: 'h-8',
        default: 'h-10',
        large: 'h-14'
    };

    if (theme === 'dark') {
        // Purple/Black Logo for Dark Theme
        return (
            <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
                <svg viewBox="0 0 40 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="8" fill="#0A0A0A"/>
                    <path d="M10 12L20 8L30 12V28L20 32L10 28V12Z" fill="#8B5CF6" fillOpacity="0.2"/>
                    <path d="M10 12L20 16L30 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 16V32" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 12V28L20 32L30 28V12L20 8L10 12Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="20" cy="20" r="4" fill="#A855F7"/>
                </svg>
                <span className="font-heading font-bold text-xl tracking-tight">
                    <span className="text-white">Studia</span>
                    <span className="text-violet-500">X</span>
                </span>
            </div>
        );
    }

    // Cyan/Blue Logo for Light Theme
    return (
        <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
            <svg viewBox="0 0 40 40" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
                <path d="M10 12L20 8L30 12V28L20 32L10 28V12Z" fill="#06B6D4" fillOpacity="0.2"/>
                <path d="M10 12L20 16L30 12" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 16V32" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 12V28L20 32L30 28V12L20 8L10 12Z" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="4" fill="#22D3EE"/>
            </svg>
            <span className="font-heading font-bold text-xl tracking-tight">
                <span className="text-slate-900">Studia</span>
                <span className="text-cyan-500">X</span>
            </span>
        </div>
    );
};

export default Logo;
