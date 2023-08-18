import { useState, useEffect } from "react";
import axios from "axios";

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function Stopwatch({ itemId }: { itemId: string }) {
    const [time, setTime] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);
    const [timeWorked, setTimeWorked] = useState<number>(0); // New state for time worked
    const [initialize, setInitialize] = useState<boolean>(false);

    useEffect(() => {
        let interval: number | undefined;

        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000); // Update every second
        } else if (interval !== undefined) {
            clearInterval(interval);
        }

        return () => {
            if (interval !== undefined) {
                clearInterval(interval);
            }
        };
    }, [running]);

    const toggleRunning = () => {
        setRunning((prevState) => !prevState);
        setInitialize(true);
    };

    const resetTime = async () => {
        // Add time to timeWorked
        const updatedTimeWorked = timeWorked + Math.floor(time / 60);
        setTimeWorked(updatedTimeWorked);

        try {
            // Update the time_worked in the database
            await axios.put(`http://localhost:5000/api/items/${itemId}`, { time_worked: time });
        } catch (error) {
            console.error("Error updating time_worked:", error);
        }

        setTime(0);
        setRunning(false);
        setInitialize(false);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div className={initialize ? "slide-in" : "slide-out"} style={{ fontSize: "1.5em", color: running ? "#099268" : "inherit" }}>
                {formatTime(time)}
            </div>
            <button className={`${initialize ? "slide-in" : "slide-out"} ${running ? "redButton" : "greenButton"}`} onClick={toggleRunning} style={{ height: "50%", marginLeft: "0.5em", outline: "none", border: "none", width: "5em", textAlign: "center" }}>
                {running ? "Stop" : "Start"}
            </button>
            <button
                className={`${initialize ? "blueButton" : "greenButton"}`}
                onClick={initialize ? resetTime : toggleRunning}
                style={{
                    height: "50%",
                    marginLeft: "0.5em",
                    marginRight: "0.5em",
                    outline: "none",
                    border: "none",
                    width: "5em",
                }}
            >
                {initialize ? "Save" : "Start"}
            </button>
        </div>
    );
}

export default Stopwatch;
