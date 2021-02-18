import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useObservable(observable: Observable<any> | null): any {
    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        if (observable) {
            const subscription = observable.subscribe(setValue);
            const cleanup = () => {
                setValue(null);
                subscription.unsubscribe()
            };
            return cleanup;
        }
    }, [observable]);
    return value;
}