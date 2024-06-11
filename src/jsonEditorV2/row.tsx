import { Line } from './lineNumber.tsx'
import {PresentKey} from "./presentKey.tsx";

interface Iprops {
    keyValue: string
    value: unknown
    index: number
    disable: (key: string, value: unknown) => boolean
}


export const Row = (props: Iprops) => {

    return (
        <div style={{ display: 'flex' }}>
            <Line
                index={props.index}
                type={typeof props.value}
            />
            <PresentKey
                keyValue={props.keyValue}
                disable={props.disable?.(props.keyValue, props.value) ?? false}
                onChange={console.log}
                onDropDownClicked={console.log}
                showDropdownArrow={typeof props.value === 'object'}
            />
        </div>
    )
}
