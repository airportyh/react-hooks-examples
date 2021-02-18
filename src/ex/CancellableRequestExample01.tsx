import {
    useEffect,
    useReducer,
    useState
} from "react";
import { CancellableRequest } from "./CancellableRequest";

export function CancellableRequestExample01A() {
    const url = "http://localhost:1234/Todos";
    const [data, setData] = useState<any>(null);
    const [request, setRequest] = useState(() => new CancellableRequest(url));
    useEffect(() => {
        request.fetch()
            .then(setData)
            .catch((e: any) => {
                if (e.message.match(/The user aborted a request/)) {
                    // ignore
                } else {
                    throw e;
                }
            });;
    
        return () => {
            setData(null);
            request.cancel();
        };
    }, [request]);
    function retry() {
        setRequest(new CancellableRequest(url));
    }
    function cancel() {
        request.cancel();
    }
    
    return (
        <div>
            <h2>Todo</h2>
            <div>
                { data ?
                    (
                        <>
                            <ul>
                                { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                            </ul>
                            
                        </>
                    ) : "Loading..." }
            </div>
            <button onClick={retry}>Try again</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    );
}

function useCancellableRequest(url: string) {
    const [data, setData] = useState<any>(null);
    const [request, setRequest] = useState(() => new CancellableRequest(url));
    useEffect(() => {
        request.fetch()
            .then(setData)
            .catch((e: any) => {
                if (e.message.match(/The user aborted a request/)) {
                    // ignore
                } else {
                    throw e;
                }
            });;
        
        return () => {
            setData(null);
            request.cancel();
        };
    }, [request]);
    function retry() {
        setRequest(new CancellableRequest(url));
    }
    function cancel() {
        request.cancel();
    }
    return [data, setData, retry, cancel];
}

export function CancellableRequestExample01B() {
    const [data, setData, retry, cancel] = useCancellableRequest("http://localhost:1234/Todos");
    
    return (
        <div>
            <h2>Todo</h2>
            <div>
                { data ?
                    (
                        <>
                            <ul>
                                { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                            </ul>
                            
                        </>
                    ) : "Loading..." }
            </div>
            <button onClick={retry}>Try again</button>
        </div>
    );
}
