import { useEffect, useState } from "react";
import { BehaviorSubject, Observable } from "rxjs";

const counter$ = new BehaviorSubject(1);
setInterval(() => counter$.next(counter$.value + 1), 1000);

export function ObservableExample() {
    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        const subscription = counter$.subscribe(setValue);
        const cleanup = () => {
            subscription.unsubscribe()
        };
        return cleanup;
    }, []);
    
    return (
        <div>
            <label>The count is {value}</label>
        </div>
    );
}