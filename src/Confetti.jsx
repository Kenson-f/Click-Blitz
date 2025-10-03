import React, { useMemo } from 'react';

// A single, reusable confetti piece. Its properties are randomized once.
const ConfettiPiece = () => {
    const style = useMemo(() => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffeb3b', '#ffc107', '#ff9800'];
        return {
            position: 'absolute',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: `${-10 + Math.random() * 20}%`, // Start slightly off-screen
            left: `${Math.random() * 100}%`,
            opacity: 1,
            transform: `rotate(${Math.random() * 360}deg)`,
            // Randomized animation duration and delay for a natural look
            // The 'fall' animation is defined in App.css.
            animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
        };
    }, []);

    return <div style={style} />;
};

// The container for the confetti celebration effect
export default function Confetti() {
    // Creates 150 confetti pieces, memoized for performance
    const particles = useMemo(() => Array.from({ length: 150 }).map((_, i) => <ConfettiPiece key={i} />), []);
    return <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">{particles}</div>;
};

