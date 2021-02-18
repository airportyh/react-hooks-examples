import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { CancellableRequest } from "./CancellableRequest";

export function makeSharedRequest$(input: RequestInfo, init?: RequestInit): Observable<any> {
    return new Observable((observer: any) => {
        const request = new CancellableRequest(input, init);
        request.fetch().then((data: any) => {
            observer.next(data);
            observer.complete();
        }).catch((err: any) => {
            if (err.message.match(/The user aborted a request/)) {
                // ignore
            } else {
                throw err;
            }
        });
        
        return () => {
            request.cancel();
        };
    }).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
}