// https://davidwalsh.name/cancel-fetch
export async function example() {
    const abortController = new AbortController();
    const fetchOptions = {
        signal: abortController.signal
    };
    setTimeout(() => abortController.abort(), 250);
    const request = await fetch("http://localhost:1234/Todos", fetchOptions);
    const data = await request.json();
}



