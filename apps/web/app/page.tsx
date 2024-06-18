"use client";
import {useEffect, useState} from "react";
import Deque from "double-ended-queue";

interface Record {
    expirationTimestamp: number;
    value: number;
}

export default function Home() {
    const [value, setValue] = useState("");
    const [randomValue, setRandomValue] = useState(false);
    const [expirationDuration, setExpirationDuration] = useState(300); // Default 5 minutes
    const [deque, setDeque] = useState(new Deque<Record>());
    const [runningSum, setRunningSum] = useState(0);
    const [mean, setMean] = useState(0);
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop);
        return () => window.removeEventListener("scroll", checkScrollTop);
    }, [showScroll]);

    useEffect(() => {
        expireRecords();
    }, [deque]);

    const addRecord = () => {
        const valueToAdd = randomValue
            ? Math.floor(Math.random() * 100) + 1
            : parseInt(value);
        const expirationTimestamp = Date.now() + expirationDuration * 1000; // Current time + expiration duration in ms
        setDeque((prevDeque) => {
            const newDeque = new Deque(prevDeque.toArray());
            newDeque.push({expirationTimestamp, value: valueToAdd});
            return newDeque;
        });
        setRunningSum((prevSum) => prevSum + valueToAdd);
    };

    const expireRecords = () => {
        const currentTime = Date.now();
        setDeque((prevDeque) => {
            const newDeque = new Deque(prevDeque.toArray());
            let sumAdjustment = 0;
            while (
                newDeque.length > 0 &&
                currentTime > newDeque.peekFront().expirationTimestamp
                ) {
                const expiredRecord = newDeque.shift();
                sumAdjustment += expiredRecord.value;
            }
            setRunningSum((prevSum) => prevSum - sumAdjustment);
            return newDeque;
        });
    };

    const calculateMean = () => {
        expireRecords();
        if (deque.length === 0) {
            setMean(0);
        } else {
            setMean(runningSum / deque.length);
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
            <h1 className="text-5xl font-bold mb-10">
                Mean Cache Problem Solver
            </h1>
            <div className="flex flex-row w-full justify-center">
                <div className="bg-white text-black p-8 rounded-lg shadow-md mr-10">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Value
                        </label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            disabled={randomValue}
                            className="w-full px-4 py-2 rounded-lg border focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            checked={randomValue}
                            onChange={() => setRandomValue(!randomValue)}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium">
                            Use Random Value
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Expiration Duration (seconds)
                        </label>
                        <input
                            type="number"
                            value={expirationDuration}
                            onChange={(e) =>
                                setExpirationDuration(parseInt(e.target.value))
                            }
                            className="w-full px-4 py-2 rounded-lg border focus:ring focus:border-blue-300"
                        />
                    </div>
                    <button
                        onClick={addRecord}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Add Record
                    </button>
                    <button
                        onClick={calculateMean}
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
                    >
                        Calculate Mean
                    </button>
                </div>
            </div>
            <div className="mt-10 w-full flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6">Cache State</h2>
                <div className="bg-white text-black p-4 mb-4 rounded-lg shadow-md">
                    <div>Running Sum: {runningSum}</div>
                    <div>Mean: {mean}</div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Deque</h3>
                        <div className="flex">
                            {deque.toArray().map((record, index) => (
                                <div
                                    key={index}
                                    className={`bg-blue-500 text-white p-4 m-2 rounded-lg shadow-md transition-transform duration-1000 ${index === 0 ? "scale-110" : "scale-100"}`}
                                >
                                    <div>Value: {record.value}</div>
                                    <div>
                                        Expiration:{" "}
                                        {formatTimestamp(
                                            record.expirationTimestamp,
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <footer
                className="fixed inset-x-0 bottom-0 w-full text-center border-t border-grey p-4 bg-amber-500 text-blue-950">
                <div className="flex justify-center space-x-4 mt-4">
                    <a
                        href="http://localhost:3002/api#/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        API Documentation
                    </a>
                    <a
                        href="https://github.com/palerique/meancacheproblem"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        Git Repository
                    </a>
                    <a
                        href="http://localhost:8380/kiali/console/graph/namespaces/?traffic=grpc%2CgrpcRequest%2Chttp%2ChttpRequest%2Ctcp%2CtcpSent&graphType=versionedApp&namespaces=default%2Cistio-system&duration=1800&refresh=10000&layout=kiali-dagre&namespaceLayout=kiali-dagre&edges=trafficDistribution%2CtrafficRate%2Cthroughput%2CthroughputRequest%2CresponseTime%2Crt95&animation=true"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        Kiali
                    </a>
                    <a
                        href="https://www.linkedin.com/in/palerique/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        Find me on LinkedIn
                    </a>
                </div>
            </footer>
            {showScroll && (
                <button
                    className="fixed right-2 bottom-20 bg-blue-500 text-white p-2 rounded-full"
                    onClick={scrollTop}
                >
                    ^ Top
                </button>
            )}
        </div>
    );
}
