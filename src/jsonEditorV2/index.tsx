import {useState, useEffect} from "react";
import {Row} from './row'

interface Iprops {
    value: Record<string, unknown>
    onValueChange: (value: Record<string, unknown>) => void,
    disable: (key: string, value: unknown) => boolean
}

export const JsonEditorV2 = (props: Iprops) => {

    const [json, setJson] = useState(props.value)

    useEffect(() => {
        props.onValueChange(json)
    }, [json])

    return Object.keys(json).map((key: string, index: number) => {
        return (
            <Row
                key={key}
                keyValue={key}
                value={json[key]}
                index={index + 1}
            />
        )
    })
}
