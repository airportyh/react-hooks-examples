import { useEffect, useState } from "react";
import { of, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { makeSharedRequest$ } from "./makeSharedRequest$";
import { useObservable } from "./useObservable";

export function CancellableRequestWithRequestObservableExample() {
    const url = "http://localhost:1234/Todos";
    const [data$, setData$] = useState<any>(() => makeSharedRequest$(url));
    const data = useObservable(data$);
    function retry() {
        setData$(makeSharedRequest$(url));
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
        </div>
    );
}

export function CancellableRequestWithRequestObservableExample2() {
    const url = "http://localhost:1234/Todos";
    const [subject$] = useState<Subject<boolean>>(() => new Subject<boolean>());
    const [data$] = useState<any>(() => 
        subject$.pipe(
            switchMap((yes) => {
                if (yes) {
                    return makeSharedRequest$(url);
                } else {
                    return of(null);
                }
            })
        )
    );
    const data = useObservable(data$);
    useEffect(startFetch, []);
    function startFetch() {
        subject$.next(true);
    }
    const retry = startFetch;
    function cancel() {
        subject$.next(false);
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
