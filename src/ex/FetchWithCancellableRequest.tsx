import React, {
    PropsWithChildren,
    useContext,
    useEffect,
    DependencyList,
    useState,
    useRef,
} from "react";
import { BehaviorSubject, Observable } from "rxjs";
import { share, shareReplay } from "rxjs/operators";

class CancellableRequest<TValue> {
    private abortController: AbortController = new AbortController();

    constructor(private input: RequestInfo, private init?: RequestInit) {}

    async fetch(): Promise<TValue> {
        const init = this.init || {};
        init.signal = this.abortController.signal;
        const resp = await fetch(this.input, init);
        const data = await resp.json();
        return data;
    }

    cancel() {
        this.abortController.abort();
    }
}



function useApiRequest<TValue>(
    input: RequestInfo, 
    init?: RequestInit,
    dependencies: DependencyList = [],
): [TValue | undefined, () => Promise<TValue>, () => void] {
    // Get API
    // Get state
    const [state, setState] = useState<number>(0);
    // Get value
    const [value, setValue] = useState<TValue | undefined>(undefined);
    const req = useRef<null | CancellableRequest<any>>(null);
    // Create resolve value
    const resolveValue = (): any => {
        // Get resolve state
        const stateResolve = state;
        // Get resolve value
        cancel();
        req.current = new CancellableRequest(input, init);

        req.current.fetch().then((valueResolve) => {
            req.current = null;
            if (stateResolve === state) {
                // Set value
                setValue(valueResolve);
            }
        }).catch((err) => {
            // ignore error
        });
        // Return value
        return req.current;
    };
    // Send request
    useEffect(() => {
        // Increase state
        setState((stateCurrent) => stateCurrent + 1);
        // Resolve value
        resolveValue();
        // Return clean up
        return () => {
            // Invalidate state
            setState(-1);
            cancel();
        };
    }, dependencies);
    
    function cancel() {
        if (req.current) {
            req.current.cancel();
            req.current = null;
        }
    }
    // Return value and resolve value
    return [value, resolveValue, cancel];
}

let pendingRequest: null | CancellableRequest<any> = null;
let lastDependencies: DependencyList = [];
let data$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

function useApiRequest2<TValue>(
    input: RequestInfo, 
    init?: RequestInit,
    dependencies: DependencyList = [],
): [TValue | undefined, () => Promise<TValue>, () => void] {
    
    const [value, setValue] = useState<TValue | undefined>(undefined);
    
    const depsChanged = dependencies.some((dep, i) => dep !== lastDependencies[i]);
    lastDependencies = dependencies;
    
    // Create resolve value
    const resolveValue = (): any => {
        cancel();
        pendingRequest = new CancellableRequest(input, init);

        pendingRequest.fetch().then((valueResolve) => {
            pendingRequest = null;
            setValue(valueResolve);
        }).catch((err) => {
            // ignore error
        });
        // Return value
        return pendingRequest;
    };
    // Send request
    useEffect(() => {
        if (depsChanged) {
            // Resolve value
            resolveValue();
        }
        // Return clean up
        return () => {
            cancel();
        };
    }, dependencies);
    
    function cancel() {
        if (pendingRequest) {
            pendingRequest.cancel();
            pendingRequest = null;
        }
    }
    // Return value and resolve value
    return [value, resolveValue, cancel];
}

function makeSharedRequest$(input: RequestInfo, init?: RequestInit): Observable<any> {
    return Observable.create((observer: any) => {
        const request = new CancellableRequest(input, init);
        request.fetch().then((data) => {
            observer.next(data);
            observer.complete();
        }).catch((err) => {
            if (err.message.match(/The user aborted a request/)) {
                // ignore
            } else {
                throw err;
            }
        });
        
        return () => {
            console.log("cancelling request");
            request.cancel();
        };
    }).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
}
// 
// function makeObservable(): Observable<any> {
//     return Observable.create(async (observer: any) => {
//         observer.next(1);
// 
//         return () => {
//             console.log("clean up at unsubscribe");
//         };
//     });
// }

function MyComponent() {
    const [isMember, setIsMember] = useState<boolean>(true);
    const [data, retry, cancel] = useApiRequest2<any>("http://localhost:1234/Todos", {}, [isMember]);

    return (
        <div style={{border: '1px solid black'}}>
            <h2>Todo</h2>
            { data ?
                (
                    <>
                        
                        <ul>
                            { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                        </ul>
                        <button onClick={retry}>Refresh</button>
                        <button onClick={() => setIsMember(!isMember)}>Toggle is member</button>
                    </>
                ) : null }
        </div>
    );
}

function useObservable(observable: Observable<any>): any {
    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        const subscription = observable.subscribe(setValue);
        const cleanup = () => {
            console.log("unsubscribing in useObservable");
            subscription.unsubscribe()
        };
        return cleanup;
    }, [observable]);
    return value;
}

function MyComponent2() {
    const [data$] = useState<any>(() => 
        makeSharedRequest$("http://localhost:1234/Todos")
    );
    
    const data = useObservable(data$);
    const data2 = useObservable(data$);
    
    return (
        <div style={{border: '1px solid black'}}>
            <h2>Todo</h2>
            { data ?
                (
                    <>
                        
                        <ul>
                            { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                        </ul>
                    </>
                ) : null }
        </div>
    );
}
export function FetchWithCancellableRequestExample() {
    return (
        <>
            <MyComponent2/>
        </>
    );
}