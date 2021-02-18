import {
    useState
} from "react";
import { useRequest } from "./useRequest";

export function CancellableRequestExample02() {
    const url = "http://localhost:1234/Todos";
    const [data, setData] = useState<any>(null);
    const retry = useRequest(url, setData);
    
    return (
        <div>
            <h2>Todo</h2>
            <div>
                { data ?
                    (
                        <>
                            <ul>
                                { data.map((task: any) => <li key={task.id}>{task.todo}</li>) }
                            </ul>
                            
                        </>
                    ) : "Loading..." }
            </div>
            <button onClick={retry}>Try again</button>
        </div>
    );
}
