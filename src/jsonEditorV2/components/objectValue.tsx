import React, {useCallback, useRef, useState} from "react";

interface Iprops {
    value: boolean,
    onChange: (bool: boolean) => void
}

export const ObjectValue = (props: Iprops) => {
    // const ref = useRef()
    // const {value, onChange} = props
    //
    // const internalOnValueChange = useCallback(
    //     () => {
    //         const currentValue = ref.current.value
    //         onChange(currentValue === 'true')
    //     }, [ref.current])

    return (
        <div>
            {'{...}'}
        </div>
    )
}
