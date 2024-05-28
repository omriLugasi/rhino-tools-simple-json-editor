import classes from '../jsonEditor.module.scss'
import React from 'react'

interface IpresentKeyProps {
  onChange: (value: string) => void
  keyValue: string
  disable: boolean
  showDropdownArrow?: boolean
  onDropDownClicked?: () => void
}

export const PresentKey = (props: IpresentKeyProps) => {
  return (
    <div className={classes.keyItem}>
      {props.showDropdownArrow ? (
        <span onClick={props.onDropDownClicked}>{'>'}</span>
      ) : (
        <span />
      )}
      <span
        style={{ fontWeight: 'bold' }}
        contentEditable={props.disable}
        onInput={props.onChange}
      >
        {props.keyValue}
      </span>
      :
    </div>
  )
}
