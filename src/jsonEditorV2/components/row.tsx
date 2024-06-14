import {useCallback} from 'react'
import { Line } from './lineNumber.tsx'
import {PresentKey} from "./presentKey.tsx";
import { StringValue } from './stringValue.tsx'
import {NumberValue} from "./numberValue.tsx";
import {BooleanValue} from "./booleanValue.tsx";
import {NullValue} from "./nullValue.tsx";
import {TypeSelector} from "./typeSelector.tsx";
import {AddNewNodeType, ERowOptionalTypes} from "../../jsonEditor/types.ts";
import {ObjectValue} from "./objectValue.tsx";

interface Iprops {
    keyValue: string
    value: unknown
    index: number
    type: string
    disable: (key: string, value: unknown) => boolean
    onChange: (key: string, value: unknown) => void
    onTypeChange: (newType: ERowOptionalTypes) => void
    addNewNode: (params: AddNewNodeType) => void
}


export const Row = (props: Iprops) => {

    const onKeyValueChange = useCallback((text: string) => {
        props.onChange(text, props.value)
    }, [props.value])

    const onValueChange = useCallback((text: string) => {
        props.onChange(props.keyValue, text)
    }, [props.keyValue])

    return (
        <div style={{ display: 'flex' }}>
            <Line
                index={props.index}
                type={props.type}
                addNewNode={props.addNewNode}
            />
            <PresentKey
                keyValue={props.keyValue}
                disable={props.disable?.(props.keyValue, props.value) ?? false}
                onChange={onKeyValueChange}
                onDropDownClicked={console.log}
                showDropdownArrow={typeof props.value === 'object' && props.value !== null}
            />
            {
                props.type === ERowOptionalTypes.string ? <StringValue value={props.value} onChange={onValueChange} /> : null
            }
            {
                props.type === ERowOptionalTypes.number ? <NumberValue value={props.value} onChange={onValueChange} /> : null
            }
            {
                props.type === ERowOptionalTypes.boolean ? <BooleanValue value={props.value} onChange={onValueChange} /> : null
            }
            {
                props.type === ERowOptionalTypes.nullValue ? <NullValue /> : null
            }
            {
                props.type === ERowOptionalTypes.object ? <ObjectValue value={props.value} onChange={console.log} /> : null
            }
            <TypeSelector value={props.type} onChange={props.onTypeChange}/>
        </div>
    )
}
