export class CancellableRequest<TValue> {
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

/*
How to use:

this.request = new CancellableRequest("http://localhost:1234/Todos");
await this.request.fetch();

...
Somewhere else:
this.request.cancel();
*/