import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export function ObservableFullExample() {
    const [count$] = useState<BehaviorSubject<number>>(() => new BehaviorSubject(1));
    const [value, setValue] = useState<number>(count$.value);
    useEffect(() => {
        const subscription = count$.subscribe(setValue);
        const cleanup = () => {
            subscription.unsubscribe()
        };
        return cleanup;
    }, [count$]);

    return (
        <div>
            { value === null ? <label>Loading...</label> :
                <>
                    <label>The count is {value}.</label>
                    <br/>
                    <br/>
                    <button onClick={() => count$.next(value - 1)}>-</button>
                    <button onClick={() => count$.next(value + 1)}>+</button>
                </>
            }
        </div>
    );
}
