import React, {useState, useCallback} from 'react'
import {createPortal} from 'react-dom'
import {AddNewNodeType, ERowOptionalTypes} from "../../jsonEditor/types.ts";
import classes from '../../jsonEditor/jsonEditor.module.scss'

interface IpropsLine {
    index: number,
    type: ERowOptionalTypes,
    addNewNode: (params: AddNewNodeType) => void
    addNewNodeForObj: (params: AddNewNodeType) => void
    showDropdownArrow?: boolean
    onDropDownClicked?: () => void
    duplicateNode: () => void
    isOpen: () => boolean
}




export const Line = (props: IpropsLine) => {
    const [open, setOpen] = useState<boolean>(false)
    const [hover, setHover] = useState<boolean>(false)


    const onNewNodeRequested = useCallback(() => {
        props.addNewNode({
            value: ''
        })
        setOpen(false)
    }, [])

    const onDuplicateNodeRequested = useCallback(() => {
        props.duplicateNode()
        setOpen(false)
    }, [])

    const onAddNewNodeForObjRequested = useCallback(() => {
        props.addNewNodeForObj({
            value: ''
        })
        setOpen(false)
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: 10, position: 'relative', cursor: 'pointer', marginRight: 20 }}
                 onMouseEnter={() => {
                     setHover(true)
                 }}
                 onMouseLeave={() => {
                     setHover(false)
                 }}
                 onClick={() => { setOpen(!open)}}>
                {hover ? '+' : props.index}
            </div>
            {props.showDropdownArrow ? (
                <button onClick={props.onDropDownClicked}>{props.isOpen() ? 'V' : ' > '}</button>
            ) : (
                <span />
            )}
            {
                open && (
                    createPortal(
                        <div className={classes.popupContainer}>
                            <div className={classes.popupContainerItem} onClick={onNewNodeRequested}>
                                Add New Field
                            </div>
                            <div className={classes.popupContainerItem}>
                                Delete Field
                            </div>
                            <div className={classes.popupContainerItem} onClick={onDuplicateNodeRequested}>
                                Duplicate Field
                            </div>
                            {
                                props.type === ERowOptionalTypes.array ?
                                    (
                                        <div className={classes.popupContainerItem} onClick={onAddNewNodeForObjRequested}>
                                            Add Item into Array
                                        </div>
                                    ) : null
                            }
                            {
                                props.type === ERowOptionalTypes.object ?
                                    (
                                        <div className={classes.popupContainerItem} onClick={onAddNewNodeForObjRequested}>
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
