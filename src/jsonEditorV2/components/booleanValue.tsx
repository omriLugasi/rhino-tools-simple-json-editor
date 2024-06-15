import React, {useCallback, useRef, useState} from "react";
import classes from "../../jsonEditor/jsonEditor.module.scss";

interface Iprops {
    value: boolean,
    onChange: (bool: boolean) => void
}

export const BooleanValue = (props: Iprops) => {
    const ref = useRef()
    const {value, onChange} = props

    const internalOnValueChange = useCallback(
        () => {
            const currentValue = ref.current.value
            onChange(currentValue === 'true')
        }, [ref.current])

    return (
        <div className={classes.rowValue}>
            <select ref={ref} defaultValue={value} onChange={internalOnValueChange}>
                <option value={true}>True</option>
                <option value={false}>False</option>
            </select>
        </div>
    )
}
