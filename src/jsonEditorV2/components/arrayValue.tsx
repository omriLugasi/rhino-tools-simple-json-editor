import React, {useCallback, useRef, useState} from "react";
import classes from "../../jsonEditor/jsonEditor.module.scss";

interface Iprops {
    value: boolean,
    onChange: (bool: boolean) => void
    isOpen: () => boolean
}

export const ArrayValue = (props: Iprops) => {
    return (
        <div className={classes.rowValue}>
            {props.isOpen() ? '' : '[...]'}
        </div>
    )
}
