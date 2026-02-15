import React, { useState } from "react";
import Display from "./Display";
import Button from "./Button";

const Calculator = () => {
    const [input, setInput] = useState("0");

    const operators = ["+", "−", "×", "÷"];

    const handleClick = async (value) => {

        // ALL CLEAR
        if (value === "AC") {
            setInput("0");
            return;
        }

        // BACKSPACE
        if (value === "⌫") {
            if (input.length === 1) {
                setInput("0");
            } else {
                setInput(input.slice(0, -1));
            }
            return;
        }

        // EQUALS
        if (value === "=") {
            try {
                let expression = input
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/")
                    .replace(/−/g, "-");

                const response = await fetch("http://127.0.0.1:5000/calculate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ expression })
                });

                const data = await response.json();

                if (data.result !== undefined) {
                    setInput(String(data.result));
                } else {
                    setInput("Error");
                }

            } catch (error) {
                setInput("Server Error");
            }

            return;
        }



        // PLUS / MINUS (toggle last number only)
        if (value === "+/-") {

            let parts = input.split(/([\+\−\×\÷])/);

            // Last element is current number
            let last = parts[parts.length - 1];

            if (!last) return;

            if (last.startsWith("-")) {
                last = last.substring(1);
            } else {
                last = "-" + last;
            }

            parts[parts.length - 1] = last;
            setInput(parts.join(""));
            return;
        }

        // OPERATOR HANDLING
        if (operators.includes(value)) {

            const lastChar = input.slice(-1);

            // If last char is operator
            if (operators.includes(lastChar)) {

                // Allow minus after operator (to create negative number)
                if (value === "−") {
                    setInput(input + value);
                    return;
                }

                // Otherwise replace operator
                setInput(input.slice(0, -1) + value);
                return;
            }

            setInput(input + value);
            return;
        }


        // DECIMAL HANDLING
        if (value === ".") {
            let parts = input.split(/[\+\−\×\÷]/);
            let last = parts[parts.length - 1];

            if (last.includes(".")) return;
        }

        // INITIAL ZERO REPLACEMENT
        if (input === "0" && value !== ".") {
            setInput(value);
        } else {
            setInput(input + value);
        }
    };

    return (
        <div className="calculator">
            <Display value={input} />

            <div className="buttons">
                <Button label="⌫" className="gray" onClick={handleClick} />
                <Button label="AC" className="gray" onClick={handleClick} />
                <Button label="%" className="gray" onClick={handleClick} />
                <Button label="÷" className="orange" onClick={handleClick} />

                <Button label="7" className="dark" onClick={handleClick} />
                <Button label="8" className="dark" onClick={handleClick} />
                <Button label="9" className="dark" onClick={handleClick} />
                <Button label="×" className="orange" onClick={handleClick} />

                <Button label="4" className="dark" onClick={handleClick} />
                <Button label="5" className="dark" onClick={handleClick} />
                <Button label="6" className="dark" onClick={handleClick} />
                <Button label="−" className="orange" onClick={handleClick} />

                <Button label="1" className="dark" onClick={handleClick} />
                <Button label="2" className="dark" onClick={handleClick} />
                <Button label="3" className="dark" onClick={handleClick} />
                <Button label="+" className="orange" onClick={handleClick} />

                <Button label="+/-" className="dark" onClick={handleClick} />
                <Button label="0" className="dark" onClick={handleClick} />
                <Button label="." className="dark" onClick={handleClick} />
                <Button label="=" className="orange" onClick={handleClick} />
            </div>
        </div>
    );
};

export default Calculator;
