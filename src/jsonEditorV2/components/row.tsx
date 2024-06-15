import {useCallback} from 'react'
import { Line } from './lineNumber.tsx'
import {PresentKey} from "./presentKey.tsx";
import { StringValue } from './stringValue.tsx'
import {NumberValue} from "./numberValue.tsx";
import {BooleanValue} from "./booleanValue.tsx";
import {NullValue} from "./nullValue.tsx";
import {TypeSelector} from "./typeSelector.tsx";
import {AddNewNodeType, ERowOptionalTypes, ToggleNodeType} from "../../jsonEditor/types.ts";
import {ObjectValue} from "./objectValue.tsx";
import {ArrayValue} from "./arrayValue.tsx";
import classes from './../../jsonEditor/jsonEditor.module.scss'

interface Iprops {
    keyValue: string
    value: unknown
    index: number
    type: string
    disable: (key: string, value: unknown) => boolean
    onChange: (key: string, value: unknown) => void
    onTypeChange: (newType: ERowOptionalTypes) => void
    addNewNode: (params: AddNewNodeType) => void
    onDropDownClicked: (params: ToggleNodeType) => void
    getIndentation: () => void
}


export const Row = (props: Iprops) => {

    const onKeyValueChange = useCallback((text: string) => {
        props.onChange(text, props.value)
    }, [props.value])

    const onValueChange = useCallback((text: string) => {
        props.onChange(props.keyValue, text)
    }, [props.keyValue])

    return (
        <div className={classes.row}>
            <Line
                index={props.index}
                type={props.type}
                addNewNode={props.addNewNode}
                onDropDownClicked={props.onDropDownClicked}
                showDropdownArrow={typeof props.value === 'object' && props.value !== null}
                isOpen={props.isOpen}
            />
            <PresentKey
                keyValue={props.keyValue}
                disable={props.disable?.(props.keyValue, props.value) ?? false}
                onChange={onKeyValueChange}
                identation={props.getIndentation()}
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
                props.type === ERowOptionalTypes.object ? <ObjectValue isOpen={props.isOpen} value={props.value} onChange={console.log} /> : null
            }
            {
                props.type === ERowOptionalTypes.array ? <ArrayValue isOpen={props.isOpen} value={props.value} onChange={console.log} /> : null
            }
            <TypeSelector value={props.type} onChange={props.onTypeChange}/>
        </div>
    )
}
