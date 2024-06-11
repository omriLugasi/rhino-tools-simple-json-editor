import {useState} from 'react'
import {createPortal} from 'react-dom'
import {ERowOptionalTypes} from "../jsonEditor/types.ts";
import classes from '../jsonEditor/jsonEditor.module.scss'

interface IpropsLine {
    index: number,
    type: ERowOptionalTypes,
    addNewField: () => void
}




export const Line = (props: IpropsLine) => {
    const [open, setOpen] = useState<boolean>(false)
    const [hover, setHover] = useState<boolean>(false)



    return (
        <div>
            <div style={{ width: 10, positio: 'relative', cursor: 'pointer', marginRight: 20 }}
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
                            <div className={classes.popupContainerItem} onClick={props.addNewField}>
                                Add New Field
                            </div>
                            {
                                props.type === ERowOptionalTypes.array ?
                                    (
                                        <div className={classes.popupContainerItem}>
                                            Add Item into Array
                                        </div>
                                    ) : null
                            }
                            {
                                props.type === ERowOptionalTypes.object ?
                                    (
                                        <div className={classes.popupContainerItem}>
                                            Add new object property
                                        </div>
                                    ) : null
                            }
                        </div>,
                        document.body
                    )
                )
            }
        </div>

    )
}
