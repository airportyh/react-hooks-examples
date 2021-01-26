import { useState, useEffect } from "react";

type Task = {
  id: number,
  todo: string,
  complete: boolean
};

export function FetchDataOnSteroidsExample() {
    const getData = async () => {
        const request = await fetch("http://localhost:1234/Todos");
        // if (Math.random() > 0.5) {
        //     throw new Error("Request failed");
        // }
        return request.json();
    };
    
    const [data, setData] = useState<Task[] | null>(null);
    
    useEffect(() => {
        let cancel = false;
        async function fetchData() {
            const theData = await getData();
            if (!cancel) {
                setData(theData);
            }
        }
        
        fetchData();
        
        const cleanup = () => {
            cancel = true;
        }
        return cleanup;
    }, []);
    
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
    }
    
    return (
        <div>   
            { data ? 
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