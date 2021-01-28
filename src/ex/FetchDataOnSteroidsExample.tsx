import { useState, useEffect, useCallback } from "react";

type Task = {
  id: number,
  todo: string,
  complete: boolean
};

type FetchData<T> = {
    data: T | null,
    setData: (data: T) => void,
    error: any,
    retry: () => void,
    loading: boolean
};

type FetchDataState<T> = {
    data: T | null,
    error: any,
    tryNo: number,
    loading: boolean
}

function useFetchData<T>(getData: () => Promise<T>): FetchData<T> {
    const [state, setState] = useState< FetchDataState<T>>({
        data: null,
        error: null,
        tryNo: 1,
        loading: true
    });
    
    useEffect(() => {
        let cancel = false;
        async function fetchData() {
            try {
                const theData = await getData();
                if (!cancel) {
                    setState({
                        ...state,
                        data: theData,
                        loading: false,
                        error: null
                    });
                }
            } catch (e) {
                setState({
                    ...state,
                    loading: false,
                    error: e
                });
            }
        }
        
        fetchData();
        
        const cleanup = () => {
            cancel = true;
        }
        return cleanup;
    }, [getData, state.tryNo]);
    
    
    function retry() {
        setState({
            ...state,
            data: null,
            tryNo: state.tryNo + 1,
            loading: true
        });
    }
    
    function setData(data: T) {
        setState({
            ...state,
            data
        });
    }
    
    return {
        data: state.data, 
        setData,
        error: state.error,
        retry,
        loading: state.loading
    };
}



export function FetchDataOnSteroidsExample() {
    console.log("FetchDataOnSteroidsExample");
    const getData = useCallback(async () => {
        const request = await fetch("http://localhost:1234/Todos");
        if (Math.random() > 0.5) {
            throw new Error("Request failed");
        }
        return request.json();
    }, []);
    
    const { data, setData, error, retry, loading } = useFetchData(getData);
    
    async function updateComplete(taskId: number, complete: boolean) {
        if (!data) {
            return;
        }
        
        await fetch(`http://localhost:1234/Todos/${taskId}`, {
            method: "PATCH",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ complete })
        });
        
        // update in-memory data
        const newData = data.map((task: Task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    complete
                };
            } else {
                return task;
            }
        });
        setData(newData);
    };
    
    if (error) {
        return (
            <div>
                <h1>There was a problem</h1>
                <p>{error.message}</p>
                <button onClick={retry}>Try Again</button>
                { loading ? 'Trying...' : '' }
            </div>
        );
    }
    
    return (
        <div>
            { !loading ? 
                <>
                    <h2>Todo</h2>
                    <ul>
                        { data.map((task: any) => {
                            return (
                                <li key={task.id}>
                                    <input type="checkbox"
                                        checked={task.complete}
                                        onChange={ (evt) => updateComplete(task.id, evt.target.checked) }
                                    />
                                    {task.todo}
                                </li>
                            );
                        }) }
                    </ul>
                </> :
                <label>Loading...</label>
            }
        </div>
    );
}