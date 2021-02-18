import { useEffect, useReducer } from "react";
import { CancellableRequest } from "./CancellableRequest";

export function useRequest<T>(url: string, setter: (data: T | null) => void) {
    const [tryNo, incTryNo] = useReducer(x => x + 1, 0);
    useEffect(() => {
        const request = new CancellableRequest<T>(url);
        request.fetch()
            .then(setter)
            .catch((err: any) => {
                if (err.message?.match(/The user aborted a request/)) {
                    // ignore
                } else {
                    throw err;
                }
            });
        
        return () => {
            request.cancel();
        }
    }, [tryNo]);
    function retry() {
        setter(null);
        incTryNo();
    }
    return retry;
}