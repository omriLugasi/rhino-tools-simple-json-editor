import React, {useCallback} from "react";

interface Iprops {
    value: string,
    onchange: (str: string) => void
}

export const StringValue = (props: Iprops) => {
    const {value} = props

    const internalOnValueChange = useCallback(
        (e: Event) => {
            const currentValue = e.target.value
            props.onchange(currentValue)
        }, [])
    return (
        <div>
            <span>"</span>
            <textarea
                cols={6}
                rows={1}
                value={value}
                onChange={internalOnValueChange}
            />
            <span>"</span>
        </div>
    )
}
