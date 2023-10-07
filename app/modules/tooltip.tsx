"use client";

import React, { useState, CSSProperties } from 'react';
import Style from "../styles/tooltip.module.css";


export const Tooltip = ({ body, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [mf, setmf] = useState(false);
    const [time, setTime] = useState(0);
    


    const handleMouseEnter = (e: { clientX: any; clientY: any; }) => {
        setmf(true);
        setTime(window.setTimeout(() => {setShowTooltip(true)}, 800));
    };
    const handleMouseLeave = () => {
        setmf(false);
        setShowTooltip(false);
        clearTimeout(time);

    };
  
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
        updateTooltipPosition(e);

    };
  
    const updateTooltipPosition = (e: { clientX: any; clientY: any; }) => {
        const x = e.clientX;
        const y = e.clientY;
        setPosition({ x, y });
    };

    return (
        
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        
        {children}
        {(showTooltip && mf) && (
          <div className={Style.tooltipStyle} id="tooltip" style={{left: position.x + 10 + 'px', top: position.y + 10 + 'px'}} >
            {body}
          </div>
        )
        }
        </div>
    );
  };
