import { useState } from "react";

function UseStateExample() {
    const [name, setName] = useState("world");
    function onChange(evt: React.ChangeEvent) {
        const input = evt.target as HTMLInputElement;
        setName(input.value);
    }
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <input
                type="text"
                value={name}
                onChange={onChange}
            />
        </div>
    );
}

export default UseStateExample;