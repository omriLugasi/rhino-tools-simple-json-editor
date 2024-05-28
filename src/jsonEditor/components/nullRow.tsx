import React, { useCallback } from 'react'
import { PresentKey } from './presentKey.tsx'
import { Selector } from './typeSelector.tsx'
import { ERowOptionalTypes } from '../types.ts'
import classes from '../jsonEditor.module.scss'

interface IArrayRowNode {
  keyValue: string
  value: string
  onChange: (key: string, value: string) => void
  onTypeChange: (newType: string) => void
  __level__: number
  disable: boolean
}

export const NullRow = (props: IArrayRowNode) => {
  const {
    keyValue,
    value,
    onChange,
    onTypeChange,
    premitiveType,
    disable,
    __level__,
  } = props

  const internalOnKeyValueChange = useCallback(
    (e: Event) => {
      onChange(keyValue, e.target.innerText, value)
    },
    [value, keyValue, premitiveType],
  )

  return (
    <>
      <div className={classes.row} style={{ paddingLeft: __level__ * 24 }}>
        <PresentKey
          disable={disable}
          onChange={internalOnKeyValueChange}
          keyValue={props.keyValue}
        />
        Null
        <Selector value={ERowOptionalTypes.nullValue} onChange={onTypeChange} />
      </div>
    </>
  )
}
