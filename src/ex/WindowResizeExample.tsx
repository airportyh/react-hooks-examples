import { useState, useEffect } from "react";

function WindowResizeExample() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    
    useEffect(() => {
        const onResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener("resize", onResize);
        
        const cleanup = () => {
            window.removeEventListener("resize", onResize);
        };
        return cleanup;
    }, []);
    
    return (
        <div style={{
            backgroundColor: "pink", 
            position: 'absolute',
            left: size.width / 4,
            top: size.height / 4,
            width: size.width / 2, 
            height: size.height / 2 }}>
            <label>Window size: ({size.width}, {size.height})</label>
        </div>
    );
}

export default WindowResizeExample;