import './App.css';
import { useMemo, useState } from "react";
import _ from "lodash";
import UseStateExample from "./ex/UseStateExample";
import UseImperativeHandleExample from "./ex/UseImperativeHandleExample";
import WindowResizeExample from "./ex/WindowResizeExample";
import { FetchDataExample, FetchDataWithCleanUpExample, FetchDataWithRequestCancelationExample } from "./ex/FetchDataExample";
import { SimpleAutoFocusElementExample, FocusElementExample } from "./ex/UseRefFocusElementExample";
import { ObservableExample } from "./ex/ObservableExample";
import { UseContextExample } from "./ex/UseContextExample";

const options = [
    { name: "useState", Component: UseStateExample },
    { name: "useEffect (Window Size)", Component: WindowResizeExample },
    { name: "useImperativeHandle", Component: UseImperativeHandleExample },
    { name: "Fetch Data Example", Component: FetchDataExample },
    { name: "Fetch Data Example (with cleanup)", Component: FetchDataWithCleanUpExample },
    { name: "Fetch Data Example (with request cancelation)", Component: FetchDataWithRequestCancelationExample },
    { name: "Simple Auto Focus Example", Component: SimpleAutoFocusElementExample },
    { name: "Focus Element Example", Component: FocusElementExample },
    { name: "Observable Example", Component: ObservableExample },
    { name: "useContext Example", Component: UseContextExample }
];

function App() {
    const [selection, setSelection] = useState<any>(options[0]);
    const optionsByName = useMemo(() => _.keyBy(options, "name"), [options]);
    
    function onSelectionChange(evt: any) {
        const selectedName = evt.target.value;
        const selected = optionsByName[selectedName];
        setSelection(selected);
    }
    return (
        <div className="app">
            <div>
                <select onChange={onSelectionChange}>
                    { options.map((opt) => (
                        <option key={opt.name} value={opt.name}>{opt.name}</option>
                    )) }
                </select>
                <div style={{ paddingTop: 20 }}>
                    { selection ? <selection.Component/> : null }
                </div>
            </div>
        </div>
    );
}

export default App;
