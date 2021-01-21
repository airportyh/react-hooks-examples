import React from "react";
import { useContext } from "react";

const CountContext = React.createContext(0);

export function UseContextExample() {
    return (
        <CountContext.Provider value={5}>
            <h2>What is the count?</h2>
            <InnerComponent/>
        </CountContext.Provider>
    );
}

function InnerComponent() {
    const count = useContext(CountContext);
    return (
        <div>
            <label>The count is definitely bigger than {count - 100}</label>
            <br/>
            <InnerInnerComponent/>
        </div>
    );
}

function InnerInnerComponent() {
    const count = useContext(CountContext);
    return <label>I think the count is a number between {count - 1} and {count + 1}.</label>;
}
