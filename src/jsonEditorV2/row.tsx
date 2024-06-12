import {useCallback} from 'react'
import { Line } from './lineNumber.tsx'
import {PresentKey} from "./presentKey.tsx";
import { StringValue } from './stringValue.tsx'

interface Iprops {
    keyValue: string
    value: unknown
    index: number
    type: string
    disable: (key: string, value: unknown) => boolean
    onChange: (key: string, value: unknown) => void

}


export const Row = (props: Iprops) => {

    const onKeyValueChange = useCallback((text: string) => {
        console.log({ text })
        props.onChange(text, props.value)
    }, [props.value])

    return (
        <div style={{ display: 'flex' }}>
            <Line
                index={props.index}
                type={props.type}
            />
            <PresentKey
                keyValue={props.keyValue}
                disable={props.disable?.(props.keyValue, props.value) ?? false}
                onChange={onKeyValueChange}
                onDropDownClicked={console.log}
                showDropdownArrow={typeof props.value === 'object'}
            />
            {
                props.type === 'string' ? <StringValue value={props.value} /> : null
            }
        </div>
    )
}
