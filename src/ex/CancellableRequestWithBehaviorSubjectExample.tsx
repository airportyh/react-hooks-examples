import { useState } from "react";
import { BehaviorSubject } from "rxjs";
import { useObservable } from "./useObservable";
import { useRequest } from "./useRequest";

export function CancellableRequestWithBehaviorSubjectExample() {
    const [data$] = useState<any>(() => new BehaviorSubject<any>(null));
    const retry = useRequest("http://localhost:1234/Todos", (data) => data$.next(data));
    const data = useObservable(data$);
    
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