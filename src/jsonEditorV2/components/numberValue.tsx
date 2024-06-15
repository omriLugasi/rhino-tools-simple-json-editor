import React, {useCallback, useRef, useState} from "react";
import classes from "../../jsonEditor/jsonEditor.module.scss";

interface Iprops {
    value: number,
    onChange: (num: number) => void
}

export const NumberValue = (props: Iprops) => {
    const [num, setNum] = useState(props.value)
    const {value, onChange} = props

    const customOnChange = useCallback((e: Event) => {
        const currentValue = e.target.value
        setNum(currentValue)
    }, [])

    const internalOnValueChange = useCallback(
        () => {
            const currentValue = num === '' ? 0 : parseInt(num)
            if (num === '') {
                setNum(0)
            }
            onChange(currentValue)
        }, [num])

    return (
        <div className={classes.rowValue}>
            <input
                min={0}
                type='number'
                value={num}
                onChange={customOnChange}
                onBlur={internalOnValueChange}
            />
        </div>
    )
}
