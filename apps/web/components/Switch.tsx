import React from "react";
import "./Switch.css";

let idCounter = 0;

interface SwitchProps {
    isOn: boolean;
    handleToggle: () => void;
    onColor: string;
    offColor: string;
}

const Switch = ({ isOn, handleToggle, onColor, offColor }: SwitchProps) => {
    const switchId = `react-switch-new-${++idCounter}`;

    return (
        <div className="switch-container">
            <input
                checked={isOn}
                onChange={handleToggle}
                className="react-switch-checkbox"
                id={switchId}
                type="checkbox"
            />
            <label
                style={{
                    background: (isOn && onColor) || (!isOn && offColor) || "",
                }}
                className="react-switch-label"
                htmlFor={switchId}
            >
                <span className={`react-switch-button`} />
            </label>
            <span className={`switch-text switch-text-${isOn ? "on" : "off"}`}>
                {isOn ? "ON" : "OFF"}
            </span>
        </div>
    );
};

export default Switch;
