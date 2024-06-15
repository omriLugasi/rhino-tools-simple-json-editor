import React, {useCallback, useRef} from "react";
import classes from './../../jsonEditor/jsonEditor.module.scss'

interface Iprops {
    value: string,
    onChange: (str: string) => void
}

export const StringValue = (props: Iprops) => {
    const ref = useRef()
    const {value, onChange} = props

    const internalOnValueChange = useCallback(
        () => {
            const currentValue = ref.current.value
            onChange(currentValue)
        }, [ref.current])
    return (
        <div className={classes.rowValue}>
            <span>"</span>
            <textarea
                ref={ref}
                cols={6}
                rows={1}
                defaultValue={value}
                onBlur={internalOnValueChange}
            />
            <span>"</span>
        </div>
    )
}
