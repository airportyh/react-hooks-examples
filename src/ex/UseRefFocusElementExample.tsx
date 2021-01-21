import { useEffect, useRef } from "react";

export function SimpleAutoFocusElementExample() {
    return (
        <div>
            <input type="text" ref={(elm) => elm?.focus()}/>
        </div>
    );
}

export function LongHandAutoFocusElementExample() {
    const inputRef = useRef<any>(null);
    
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    return (
        <div>
            <input type="text" ref={inputRef}/>
        </div>
    );
}

export function FocusElementExample() {
    const inputRef1 = useRef<any>(null);
    const inputRef2 = useRef<any>(null);
    const inputRef3 = useRef<any>(null);
    
    return (
        <div>
            <input type="text" ref={inputRef1}/>
            <button
                onClick={() => inputRef2.current?.focus()}
            >
                Next
            </button><br/>
            <input type="text" ref={inputRef2}/>
            <button
                onClick={() => inputRef3.current?.focus()}
            >
                Next
            </button><br/>
            <input type="text" ref={inputRef3}/>
            <button>Finish</button><br/>
        </div>
    );
}
