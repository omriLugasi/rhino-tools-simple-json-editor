import {useState, useEffect, useRef} from "react";
import {Row} from './row'
import {RowItemType} from "../jsonEditor/types.ts";
import { VirtualJsonTree } from './virtualJsonTree.ts'

interface Iprops {
    value: Record<string, unknown>
    onValueChange: (value: Record<string, unknown>) => void,
    disable: (key: string, value: unknown) => boolean
}




export const JsonEditorV2 = (props: Iprops) => {

    // const [json, setJson] = useState(props.value)
    //
    // useEffect(() => {
    //     if (json === props.value) {
    //         return
    //     }
    //     // props.onValueChange(json)
    //     console.log(`json is updated ${JSON.stringify(json)}`)
    // }, [json, props.value])

    const jsonArr = useRef(new VirtualJsonTree(props.value))

    useEffect(() => {
        jsonArr.current.onJsonChange((json) => {
            console.log({json})
        })
    }, [jsonArr.current])

    return jsonArr.current.getAll().map((item: RowItemType, index: number) => {
        return <Row
                    key={item.key}
                    keyValue={item.key}
                    value={item.value}
                    type={item.getType()}
                    index={index + 1}
                    onChange={item.onChange}
                />
    })

    // return Object.keys(json).map((key: string, index: number) => {
    //     return (
    //         <Row
    //             key={key}
    //             keyValue={key}
    //             value={json[key]}
    //             index={index + 1}
    //         />
    //     )
    // })
}
