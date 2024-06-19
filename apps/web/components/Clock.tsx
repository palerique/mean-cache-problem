import { useEffect, useState } from "react";

interface ClockState {
    currentDateTime: Date;
}

const Clock: React.FC = () => {
    const [clockState, setClockState] = useState<ClockState>({
        currentDateTime: new Date(),
    });

    useEffect(() => {
        const timerID = setInterval(() => {
            setClockState({ currentDateTime: new Date() });
        }, 1000);
        return function cleanup() {
            clearInterval(timerID);
        };
    }, []);

    return (
        <div className="fixed top-3 right-3 text-white bg-black p-2 rounded-lg">
            {clockState.currentDateTime.toLocaleTimeString()}
        </div>
    );
};

export default Clock;
