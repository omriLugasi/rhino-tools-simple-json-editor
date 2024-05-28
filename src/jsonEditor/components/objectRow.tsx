import React, { useCallback, useState } from 'react'
import { PresentKey } from './presentKey.tsx'
import { Selector } from './typeSelector.tsx'
import { ERowOptionalTypes } from '../types.ts'
import classes from '../jsonEditor.module.scss'
import { JsonEditor } from '../jsonEditor.tsx'

interface IObjectRowNode {
  keyValue: string
  value: string
  onChange: (key: string, value: string) => void
  onTypeChange: (newType: string) => void
  __level__: number
  disable: boolean
}

export const ObjectRow = (props: IObjectRowNode) => {
  const {
    keyValue,
    value,
    onChange,
    onTypeChange,
    premitiveType,
    disable,
    __level__,
  } = props
  const [open, setOpen] = useState<boolean>(false)

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
          showDropdownArrow
          onChange={internalOnKeyValueChange}
          keyValue={props.keyValue}
          onDropDownClicked={() => {
            setOpen(!open)
          }}
        />
        {!open && <span>Object</span>}
        <Selector value={ERowOptionalTypes.object} onChange={onTypeChange} />
      </div>
      {open && <JsonEditor __level__={__level__ + 1} value={value} />}
    </>
  )
}
