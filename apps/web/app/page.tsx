"use client";

import React, { useEffect, useState } from "react";
import apiService from "../services/meanCacheService";
import Deque from "double-ended-queue";
import Switch from "../components/Switch";

import "./page.css";
import CacheRecord from "../components/CacheRecord";
import Clock from "../components/Clock";
import { Footer } from "../components/footer";

interface Record {
    id: number;
    expiringAt: number;
    value: number;
}

interface CacheState {
    fingerprint: string;
    ttl: number;
    mean: number;
    runningSum: number;
    deque: Record[];
}

export default function Home() {
    const [init, setInit] = useState(false);
    const [value, setValue] = useState("");
    const [randomValue, setRandomValue] = useState(true);
    const [autoCalculateMeanInterval, setAutoCalculateMeanInterval] =
        useState(4);
    const [autoAddInterval, setAutoAddInterval] = useState(2);
    const [autoAdd, setAutoAdd] = useState(true);
    const [autoCalculateMean, setAutoCalculateMean] = useState(true);
    const [mean, setMean] = useState(0);
    const [showScroll, setShowScroll] = useState(false);
    //TODO: update the running sum from the received cache state from the API:
    const [runningSum, setRunningSum] = useState(0);
    const [cacheSize, setCacheSize] = useState(0);
    const [deque, setDeque] = useState(new Deque<Record>());

    const updateData = (result: CacheState) => {
        setMean(result.mean);
        setDeque(new Deque(result.deque));
        setRunningSum(result.runningSum);
        setCacheSize(result.deque?.length || 0);
    };

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        //TODO: get the TTL from the page and pass it to the initialize function
        let ttl = 30 * 1000;
        apiService
            .initialize(ttl)
            .then((res) => {
                updateData(res);
                setInit(true);
            })
            .catch((err) => {
                console.error("Error during initialization:", err);
                // handle error during initialization
            });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", checkScrollTop);
        return () => window.removeEventListener("scroll", checkScrollTop);
    }, [showScroll]);

    useEffect(() => {
        if (autoCalculateMean) {
            const interval = setInterval(() => {
                apiService
                    .calculateMean() // API call to calculateMean endpoint
                    .then((result) => {
                        updateData(result);
                    })
                    .catch((err) => {
                        console.error(err); // Handle error appropriately
                    });
            }, autoCalculateMeanInterval * 1000);
            return () => clearInterval(interval);
        }
    }, [autoCalculateMeanInterval, autoCalculateMean]);

    useEffect(() => {
        if (autoAdd) {
            const interval = setInterval(addRecord, autoAddInterval * 1000);
            return () => clearInterval(interval);
        }
    }, [autoAdd, autoAddInterval]);

    const addRecord = () => {
        let valueToAdd;
        if (randomValue) valueToAdd = Math.floor(Math.random() * 100) + 1;
        else valueToAdd = Number(value);
        apiService
            .addRecord(valueToAdd)
            .then((result) => {
                updateData(result);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const calculateMean = () => {
        apiService.calculateMean().then((result) => {
            updateData(result);
        });
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (!init) {
        return <div>Loading...</div>;
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
            <h1 className="text-5xl font-bold m-2.5">
                Mean Cache Problem Solver
            </h1>
            <Clock />
            <div className="solution-container">
                <div className="flex flex-row w-full justify-center flex-grow other-container">
                    <div className="bg-white w-full h-full bg-opacity-5 text-black text-opacity-100 p-8 rounded-lg shadow-md m-2.5">
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
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-sm font-medium">
                                Use Random Value
                            </label>
                            <div className="flex items-center">
                                <Switch
                                    isOn={randomValue}
                                    handleToggle={() =>
                                        setRandomValue(!randomValue)
                                    }
                                    onColor={"#4CAF50"}
                                    offColor={"#FF4500"}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Mean Calculation Interval (seconds)
                            </label>
                            <input
                                type="number"
                                value={autoCalculateMeanInterval}
                                onChange={(e) =>
                                    setAutoCalculateMeanInterval(
                                        parseInt(e.target.value),
                                    )
                                }
                                className="w-full px-4 py-2 rounded-lg border focus:ring focus:border-blue-300"
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Auto Calculate Mean
                                </label>
                                <div className="flex items-center">
                                    <Switch
                                        isOn={autoCalculateMean}
                                        handleToggle={() =>
                                            setAutoCalculateMean(
                                                !autoCalculateMean,
                                            )
                                        }
                                        onColor={"#4CAF50"}
                                        offColor={"#FF4500"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Auto Add Interval (seconds)
                            </label>
                            <input
                                type="number"
                                value={autoAddInterval}
                                onChange={(e) =>
                                    setAutoAddInterval(parseInt(e.target.value))
                                }
                                className="w-full px-4 py-2 rounded-lg border focus:ring focus:border-blue-300"
                            />

                            <div className="mb-4 flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Auto Add Record
                                </label>
                                <div className="flex items-center">
                                    <Switch
                                        isOn={autoAdd}
                                        handleToggle={() =>
                                            setAutoAdd(!autoAdd)
                                        }
                                        onColor={"#4CAF50"}
                                        offColor={"#FF4500"}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={addRecord}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Add Record Manually
                        </button>
                        <button
                            onClick={calculateMean}
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
                        >
                            Calculate Mean
                        </button>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center deque-container m-2.5">
                    {/*<h2 className="text-3xl font-bold mb-6">Cache State</h2>*/}
                    <div className="bg-white text-black p-4 mb-4 rounded-lg shadow-md">
                        <div>Running Sum: {runningSum}</div>
                        <div>Cache Size: {cacheSize}</div>
                        <div>Mean: {mean}</div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Deque</h3>
                            <div className="flex deque">
                                {deque.toArray().map((record, index) => (
                                    <CacheRecord
                                        key={index}
                                        id={record.id}
                                        value={record.value}
                                        expiringAt={record.expiringAt}
                                        isFirst={index === 0}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
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
