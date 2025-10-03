import React, { useState, useEffect, useMemo } from 'react';

// --- NESTED CONFETTI COMPONENT ---
const ConfettiPiece = () => {
    const style = useMemo(() => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#ffeb3b', '#ffc107', '#ff9800'];
        return {
            position: 'absolute',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            top: `${-10 + Math.random() * 20}%`,
            left: `${Math.random() * 100}%`,
            opacity: 1,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${2 + Math.random() * 3}s ${Math.random() * 2}s linear forwards`,
        };
    }, []);

    return <div style={style} />;
};

const Confetti = () => {
    const particles = useMemo(() => Array.from({ length: 150 }).map((_, i) => <ConfettiPiece key={i} />), []);
    return <div className="confetti-container">{particles}</div>;
};


// --- MAIN APPLICATION COMPONENT ---
export default function App() {
    // --- STATE MANAGEMENT ---
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [timeTaken, setTimeTaken] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [bestTime, setBestTime] = useState(null);

    const isTargetReached = target !== null && count >= target;
    
    // --- EFFECTS ---
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);
    
    useEffect(() => {
        if (timeTaken) {
            if (bestTime === null || parseFloat(timeTaken) < bestTime) {
                setBestTime(parseFloat(timeTaken));
            }
        }
    }, [timeTaken, bestTime]);

    // --- HANDLER FUNCTIONS ---
    const handleSetTarget = (e) => {
        e.preventDefault();
        const numTarget = parseInt(inputValue, 10);
        if (!isNaN(numTarget) && numTarget > 0) {
            setTarget(numTarget);
            handleReset(true);
        } else {
            setTarget(null);
            setInputValue('');
        }
    };

    const handleReset = (isSoftReset = false) => {
        setCount(0);
        setTimeTaken(null);
        setStartTime(null);
        setShowConfetti(false);
        if (!isSoftReset) {
            setTarget(null);
            setInputValue('');
            setBestTime(null);
        }
    };

    const handleIncrement = () => {
        if (isTargetReached) return;
        const newCount = count + 1;
        if (target && newCount === 1) {
            setStartTime(Date.now());
        }
        setCount(newCount);
        if (target && newCount === target) {
            const endTime = Date.now();
            if (startTime) {
                const duration = (endTime - startTime) / 1000;
                setTimeTaken(duration.toFixed(2));
                setShowConfetti(true);
            }
        }
    };

    const progressPercentage = target ? (count / target) * 100 : 0;

    return (
        <>
            {/* All styles are now self-contained in this style block */}
            <style>{`
                :root {
                    --emerald-400: #34d399;
                    --emerald-500: #10b981;
                    --emerald-600: #059669;
                    --cyan-400: #22d3ee;
                    --cyan-500: #06b6d4;
                    --green-600: #16a34a;
                    --slate-100: #f1f5f9;
                    --slate-300: #cbd5e1;
                    --slate-400: #94a3b8;
                    --slate-500: #64748b;
                    --slate-600: #475569;
                    --slate-700: #334155;
                    --slate-800: #1e293b;
                    --slate-900: #0f172a;
                    --gray-900: #111827;
                }

                body {s
                  color: --slate-900;
                  background-color: var(--slate-900);
                }

                .app-container {
                    margin-left: 200px;
                    background-color: var(--gray-900);
                    color: white;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .app-container ::selection {
                    background-color: rgba(16, 185, 129, 0.3);
                }
                .card {
                    width: 100%;
                    max-width: 28rem;
                    margin: auto;
                    background-color: rgba(30, 41, 59, 0.5);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    box-shadow: 0 25px 50px -12px rgba(5, 150, 105, 0.1);
                    overflow: hidden;
                    position: relative;
                    transition: all 0.3s;
                }
                .card-content { padding: 2rem; text-align: center; }
                .header { margin-bottom: 2rem; }
                .title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                    background-image: linear-gradient(to right, var(--emerald-400), var(--cyan-400));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                .subtitle { color: var(--slate-400); margin-top: 0.25rem; }
                .counter-display { position: relative; margin-bottom: 2rem; }
                .count-text {
                    font-size: 6rem;
                    font-weight: 900;
                    background-image: linear-gradient(to bottom right, var(--slate-100), var(--slate-400));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    font-variant-numeric: tabular-nums;
                }
                .target-text { color: var(--slate-500); font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
                .button-container { margin-bottom: 2rem; display: flex; justify-content: center; }
                .click-button {
                    width: 12rem; height: 12rem;
                    border-radius: 9999px;
                    background-image: linear-gradient(to bottom right, var(--emerald-500), var(--green-600));
                    color: white; font-weight: 700; font-size: 1.875rem;
                    transition: all 0.2s;
                    transform: scale(1);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3), 0 4px 6px -2px rgba(16, 185, 129, 0.2);
                }
                .click-button:hover {
                    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.4);
                }
                .click-button:active { transform: scale(0.9); }
                .click-button:focus { outline: none; box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.5); }
                .click-button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .info-box {
                    background-color: rgba(15, 23, 42, 0.5);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .result-display { text-align: center; transition: opacity 0.5s; }
                .result-title { font-size: 1.125rem; font-weight: 600; color: var(--slate-300); }
                .result-time {
                    font-size: 3rem; font-weight: 700; margin-top: 0.25rem;
                    background-image: linear-gradient(to right, var(--emerald-400), var(--cyan-400));
                    -webkit-background-clip: text; background-clip: text; color: transparent;
                }
                .best-time { color: var(--slate-400); margin-top: 0.5rem; }
                .target-form { width: 100%; }
                .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--slate-400); margin-bottom: 0.5rem; text-align: left; }
                .form-group { display: flex; gap: 0.5rem; }
                .target-input {
                    width: 100%;
                    background-color: rgba(51, 65, 85, 0.5);
                    border: 1px solid var(--slate-600);
                    border-radius: 0.5rem;
                    padding: 0.5rem 1rem;
                    color: white;
                    transition: all 0.2s;
                }
                .target-input:focus { outline: none; box-shadow: 0 0 0 2px var(--emerald-500); }
                .set-button {
                    background-color: var(--emerald-600);
                    color: white;
                    font-weight: 600;
                    padding: 0.5rem 1.5rem;
                    border: none;
                    border-radius: 0.5rem;
                    transition: background-color 0.2s;
                    cursor: pointer;
                }
                .set-button:hover { background-color: var(--emerald-500); }
                .reset-button {
                    margin-top: 1.5rem;
                    color: var(--slate-500);
                    transition: color 0.2s;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border: none;
                    background: none;
                    cursor: pointer;
                }
                .reset-button:hover { color: white; }
                .progress-bar-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 0.5rem; background-color: var(--slate-700); }
                .progress-bar {
                    height: 100%;
                    background-image: linear-gradient(to right, var(--emerald-500), var(--cyan-500));
                    border-top-right-radius: 9999px;
                    border-bottom-right-radius: 9999px;
                    transition: width 0.2s ease-out;
                }
                .confetti-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 50; }
                
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                @keyframes pulse-shadow {
                    0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
                    70% { box-shadow: 0 0 0 25px rgba(22, 163, 74, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
                }
                .pulse-animate { animation: pulse-shadow 2.5s infinite; }
                
                /* Desktop layout adjustments */
                @media (min-width: 768px) {
                    .card {
                        max-width: 56rem; /* Wider card */
                    }
                    .card-content {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 3rem;
                        padding: 3rem;
                        text-align: left;
                        align-items: center;
                    }
                    .desktop-right-col {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .header { text-align: left; margin-bottom: 1.5rem; }
                    .button-container { margin-bottom: 0; }
                    .counter-display { margin-bottom: 2rem; text-align: center; }
                    .count-text { font-size: 8rem; }
                    .info-box { margin-bottom: 1rem; }
                    .reset-button { align-self: flex-start; margin-top: 0; }
                }

            `}</style>

            {showConfetti && <Confetti />}

            <div className="app-container">
                <div className="card">
                    <div className="card-content">
                        <div className="desktop-left-col">
                             <div className="counter-display">
                                <p className="count-text">{count}</p>
                                {target && <p className="target-text">/ {target}</p>}
                            </div>

                            <div className="button-container">
                                <button onClick={handleIncrement} disabled={isTargetReached} className={`click-button ${!isTargetReached ? 'pulse-animate' : ''}`}>
                                    Click!
                                </button>
                            </div>
                        </div>
                       
                        <div className="desktop-right-col">
                            <header className="header">
                                <h1 className="title">Click Blitz</h1>
                                <p className="subtitle">How fast can you click?</p>
                            </header>
                            
                            <div className="info-box">
                               {timeTaken ? (
                                   <div className="result-display">
                                       <h2 className="result-title">Target Reached!</h2>
                                       <p className="result-time">{timeTaken}s</p>
                                       {bestTime && <p className="best-time">Best Time: {bestTime.toFixed(2)}s</p>}
                                   </div>
                               ) : (
                                   <form onSubmit={handleSetTarget} className="target-form">
                                        <label htmlFor="target" className="form-label">Set a Click Target</label>
                                        <div className="form-group">
                                            <input type="number" id="target" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="e.g., 50" className="target-input" />
                                            <button type="submit" className="set-button">Set</button>
                                        </div>
                                   </form>
                               )}
                            </div>

                            <button onClick={() => handleReset(false)} className="reset-button">Reset All</button>
                        </div>
                    </div>
                    
                    {target && (
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

