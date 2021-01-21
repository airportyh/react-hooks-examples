import { useEffect, useState } from "react";

export function FetchDataExample() {
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        async function fetchData() {
            const request = await fetch("http://localhost:1234/Todos");
            const theData = await request.json();
            setData(theData);
        }
        
        fetchData();
    }, []); // <- this is like ngOnChanges
    
    return (
        <div>
            { data ? 
                <>
                    <h2>Todo</h2>
                    <ul>
                        { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                    </ul>
                </> :
                <label>Loading...</label>
            }
        </div>
    );
}

export function FetchDataWithCleanUpExample() {
    const [data, setData] = useState<any>(null);
    
    useEffect(() => {
        let cancel = false;
        async function fetchData() {
            const request = await fetch("http://localhost:1234/Todos");
            const theData = await request.json();
            if (!cancel) {
                setData(theData);
            }
        }
        
        fetchData();
        
        const cleanup = () => {
            cancel = true;
        }
        return cleanup;
    }, []); // <- this is like ngOnChanges
    
    return (
        <div>
            { data ? 
                <>
                    <h2>Todo</h2>
                    <ul>
                        { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                    </ul>
                </> :
                <label>Loading...</label>
            }
        </div>
    );
}

export function FetchDataWithRequestCancelationExample() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const controller = new AbortController();
        async function fetchData() {
            try {
                const request = await fetch("http://localhost:1234/Todos", {
                    signal: controller.signal
                });
                const theData = await request.json();
                setData(theData);
            } catch (e) {
                console.warn(e.message);
            }
        }

        fetchData();

        const cleanup = () => {
            controller.abort();
        }
        return cleanup;
    }, []);

    return (
        <div>
            { data ? 
                <>
                    <h2>Todo</h2>
                    <ul>
                        { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                    </ul>
                </> :
                <label>Loading...</label>
            }
        </div>
    );
}