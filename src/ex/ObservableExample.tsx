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

export function ObservableExample2() {
    const value = useObservable(counter$);
    
    return (
        <div>
            <label>The count is {value}</label>
        </div>
    );
}

export function ObservableExample3() {
    const value = useObservableWithInitValue(counter$);
    
    return (
        <div>
            <label>The count is {value}</label>
        </div>
    );
}

export function useObservable<T>(observable: Observable<T>): T | undefined {
    const [value, setValue] = useState<T | undefined>(undefined);

    useEffect(() => {
        const subscription = observable.subscribe(setValue);
        const cleanup = () => {
            subscription.unsubscribe()
        };
        return cleanup;
    }, [observable]);

    return value;
}

export function useObservableWithInitValue<T>(observable: Observable<T>): T | undefined {
    function getInitialValue() {
        let initialValue: T | undefined;
        const sub = observable.subscribe((data) => {
            initialValue = data;
        });
        sub.unsubscribe();
        return initialValue;
    }
    
    const [value, setValue] = useState<T | undefined>(getInitialValue);

    useEffect(() => {
        const subscription = observable.subscribe(setValue);
        const cleanup = () => {
            subscription.unsubscribe()
        };
        return cleanup;
    }, [observable]);

    return value;
}