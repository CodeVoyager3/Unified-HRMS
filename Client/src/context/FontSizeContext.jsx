import React, { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    // Default to 100% font size
    const [fontSize, setFontSize] = useState(() => {
        const savedSize = localStorage.getItem('fontSize');
        return savedSize ? parseInt(savedSize, 10) : 100;
    });

    useEffect(() => {
        // Apply font size to the root html element
        document.documentElement.style.fontSize = `${fontSize}%`;
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const increaseFontSize = () => {
        setFontSize((prev) => Math.min(prev + 10, 130)); // Max 130%
    };

    const decreaseFontSize = () => {
        setFontSize((prev) => Math.max(prev - 10, 80)); // Min 80%
    };

    const resetFontSize = () => {
        setFontSize(100);
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => {
    const context = useContext(FontSizeContext);
    if (!context) {
        throw new Error('useFontSize must be used within a FontSizeProvider');
    }
    return context;
};
