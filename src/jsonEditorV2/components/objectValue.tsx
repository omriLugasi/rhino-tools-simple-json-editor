import React, {useCallback, useRef, useState} from "react";

interface Iprops {
    value: boolean,
    onChange: (bool: boolean) => void
}

export const ObjectValue = (props: Iprops) => {
    return (
        <div>
            {'{...}'}
        </div>
    )
}
