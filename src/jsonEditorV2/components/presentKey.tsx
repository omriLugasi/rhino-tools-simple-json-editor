import classes from '../../jsonEditor/jsonEditor.module.scss'
import React, { useRef, useCallback } from 'react'

interface IpresentKeyProps {
  onChange: (value: string) => void
  keyValue: string
  disable: boolean
  identation: number
}

export const PresentKey = (props: IpresentKeyProps) => {
    const keyRef = useRef()

    const onBlur = useCallback(() => {
        props.onChange(keyRef.current.innerText)
    }, [keyRef.current, props.onChange])

  return (
    <div className={classes.keyItem} style={{ marginLeft: props.identation * 24 }}>
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
