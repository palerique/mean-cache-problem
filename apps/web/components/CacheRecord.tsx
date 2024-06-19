import React, { useEffect, useState } from "react";

interface CacheRecordProps {
    value: number;
    expiringAt: number;
    isFirst: boolean;
    id?: number;
}

const CacheRecord: React.FC<CacheRecordProps> = ({
    value,
    expiringAt,
    isFirst,
    id,
}) => {
    const [timeTillExpiry, setTimeTillExpiry] = useState(0);

    useEffect(() => {
        const timerId = setInterval(() => {
            const currentTime = Date.now();
            const timeTillExpiry = Math.max(expiringAt - currentTime, 0);
            setTimeTillExpiry(timeTillExpiry / 1000);
        }, 1000);

        return () => clearInterval(timerId);
    }, [expiringAt]);

    return (
        <div
            className={`bg-blue-500 text-white p-4 m-2 rounded-lg shadow-md transition-transform duration-1000 ${isFirst ? "scale-110" : "scale-100"}`}
        >
            <div>id: {id}</div>
            <div>Value: {value}</div>
            <div>Expiration: {new Date(expiringAt).toLocaleString()}</div>
            <div>Time till expiry: {Math.round(timeTillExpiry)} seconds</div>
        </div>
    );
};

export default CacheRecord;
