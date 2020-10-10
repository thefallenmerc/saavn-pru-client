import React from 'react';

export default function Loader({ size = "48px", color = "#202020", className = "" }) {
    return (
        <div className={className}><span className="spinner" style={{ width: size, height: size, borderRightColor: color }}></span></div>
    );
}