"use client";

import React, {useEffect, useState} from "react";
import apiService from "../services/meanCacheService"; // Path to the service file

export default function Home() {
    const [init, setInit] = useState(false);
    const [value, setValue] = useState("1");
    const [mean, setMean] = useState(0);
    const [showScroll, setShowScroll] = useState(false);
    const [autoCalculateMeanInterval, setAutoCalculateMeanInterval] =
        useState(10);
    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    useEffect(() => {
        apiService
        .initialize() // API call to get uniqueID
        .then((res) => {
            setInit(true);
            console.log(res); // UI now can be made functional
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
        const interval = setInterval(() => {
            apiService
            .calculateMean() // API call to calculateMean endpoint
            .then((result) => {
                setMean(result.mean);
            })
            .catch((err) => {
                console.error(err); // Handle error appropriately
            });
        }, autoCalculateMeanInterval * 1000);
        return () => clearInterval(interval);
    }, [autoCalculateMeanInterval]);

    const addRecord = () => {
        apiService
        .addRecord(value) // API call to addRecord endpoint
        .catch((err) => {
            console.error(err); // Handle error appropriately
        });
    };

    if (!init) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
            {/* Existing UI components */}
            <button
                onClick={addRecord}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
                Add Record
            </button>
            {/* Existing UI components continue */}
        </div>
    );
}
