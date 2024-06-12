import {useState, useEffect, useRef} from "react";
import {Row} from './components/row.tsx'
import {RowItemType} from "../jsonEditor/types.ts";
import { VirtualJsonTree } from './virtualJsonTree.ts'

interface Iprops {
    value: Record<string, unknown>
    onValueChange: (value: Record<string, unknown>) => void,
    disable: (key: string, value: unknown) => boolean
}




export const JsonEditorV2 = (props: Iprops) => {
    const [update, enforceUpdate] = useState()
    const [jsonArr, setJsonArr] = useState(new VirtualJsonTree(props.value))

    useEffect(() => {
        jsonArr.onJsonChange((json) => {
            props.onValueChange(json)
            enforceUpdate(new Date())
        })
    }, [jsonArr])

    return jsonArr.getAll().map((item: RowItemType, index: number) => {
        return <Row
                    key={item.uniqueKey()}
                    keyValue={item.key}
                    value={item.value}
                    type={item.getType()}
                    index={index + 1}
                    onChange={item.onChange}
                    onTypeChange={item.onTypeChange}
                    addNewNode={(params) => jsonArr.addNewNode(params)}
                />
    })
}
