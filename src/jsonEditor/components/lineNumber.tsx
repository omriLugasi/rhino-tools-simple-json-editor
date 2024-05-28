import { useState } from 'react'
import { createPortal } from 'react-dom'
import {ERowOptionalTypes} from "../types.ts";
import classes from '../jsonEditor.module.scss'

interface IpropsLine {
    index: number,
    type: ERowOptionalTypes,
}




export const Line = (props: IpropsLine) => {
    const [open, setOpen] = useState<boolean>(false)
    const [hover, setHover] = useState<boolean>(false)



    return (
        <div>
            <div style={{ width: 10, positio: 'relative', cursor: 'pointer' }}
                 onMouseEnter={() => {
                     setHover(true)
                 }}
                 onMouseLeave={() => {
                     setHover(false)
                 }}
                 onClick={() => { setOpen(!open)}}>
                {hover ? '+' : props.index}
            </div>
            {
                open && (
                    createPortal(
                        <div className={classes.popupContainer}>
                            <div className={classes.popupContainerItem}>
                                Add New Field
                            </div>
                            <div className={classes.popupContainerItem}>
                                Add Item into Array
                            </div>
                        </div>,
                        document.body
                    )
                )
            }
        </div>

    )
}
