import classes from '../jsonEditor/jsonEditor.module.scss'
import React, { useRef, useCallback } from 'react'

interface IpresentKeyProps {
  onChange: (value: string) => void
  keyValue: string
  disable: boolean
  showDropdownArrow?: boolean
  onDropDownClicked?: () => void
}

export const PresentKey = (props: IpresentKeyProps) => {
    const keyRef = useRef()

    const onBlur = useCallback(() => {
        props.onChange(keyRef.current.innerText)
    }, [keyRef.current])

  return (
    <div className={classes.keyItem}>
      {props.showDropdownArrow ? (
        <span onClick={props.onDropDownClicked}>{'>'}</span>
      ) : (
        <span />
      )}
      <span
        style={{ fontWeight: 'bold' }}
        contentEditable={!props.disable}
        onBlur={onBlur}
        ref={keyRef}
      >
        {props.keyValue}
      </span>
      :
    </div>
  )
}
