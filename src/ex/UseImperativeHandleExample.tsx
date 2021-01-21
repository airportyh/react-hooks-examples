import { useImperativeHandle, useState, useRef, RefObject, forwardRef } from "react";

function UseImperativeHandleExample() {
    const innerCompRef = useRef();
    function onClick() {
        (innerCompRef.current as any).setName(Math.random());
    }
    
    return (
        <div>
            <MyInnerComponent ref={innerCompRef}/>
            <button onClick={onClick}>Click</button>
        </div>
    );
}

function InnerComponent(props: any, ref: any) {
    const [name, setName] = useState("world");
    const divRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => {
        return {
            setName(newName: string) {
                setName(newName);
            }
        } as any;
    });
    return (
        <div ref={divRef}>
            <h1>Hello, { name }!</h1>
        </div>
    );
}

const MyInnerComponent = forwardRef(InnerComponent);

export default UseImperativeHandleExample;