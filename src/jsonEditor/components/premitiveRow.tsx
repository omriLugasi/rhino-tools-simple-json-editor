import React, { useCallback } from 'react'
import { PresentKey } from './presentKey.tsx'
import { Selector } from './typeSelector.tsx'
import { ERowOptionalTypes } from '../types.ts'
import classes from '../jsonEditor.module.scss'

interface IPremitiveRowNode {
  keyValue: string
  value: string
  onChange: (key: string, value: string) => void
  onTypeChange: (newType: string) => void
  premitiveType: Omit<
    ERowOptionalTypes,
    ERowOptionalTypes.object,
    ERowOptionalTypes.array,
    ERowOptionalTypes.nullValue
  >
  disable: boolean
  __level__: number
}

export const PremitiveRow = (props: IPremitiveRowNode) => {
  const {
    keyValue,
    value,
    onChange,
    onTypeChange,
    premitiveType,
    __level__,
    disable,
  } = props

  const internalOnKeyValueChange = useCallback(
    (e: Event) => {
      onChange(keyValue, e.target.innerText, value)
    },
    [value, keyValue, premitiveType],
  )

  const internalOnValueChange = useCallback(
    (e: Event) => {
      const currentValue = e.target.value
      onChange(
        keyValue,
        keyValue,
        premitiveType === ERowOptionalTypes.number
          ? currentValue === ''
            ? 0
            : parseInt(currentValue)
          : currentValue,
      )
    },
    [keyValue, premitiveType],
  )

  const internalBooleanOnChange = useCallback((e) => {
    internalOnValueChange({
      target: {
        value: e.target.value === 'true',
      },
    })
  }, [])

  return (
    <div className={classes.row} style={{ paddingLeft: __level__ * 24 }}>
      <PresentKey
        disable={disable}
        onChange={internalOnKeyValueChange}
        keyValue={props.keyValue}
      />
      {premitiveType === ERowOptionalTypes.boolean ? (
        <div>
          <select value={value} onChange={internalBooleanOnChange}>
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>
      ) : null}
      {premitiveType === ERowOptionalTypes.number ? (
        <div>
          <textarea
            cols={6}
            rows={1}
            value={value}
            onChange={internalOnValueChange}
          />
        </div>
      ) : null}
      {premitiveType === ERowOptionalTypes.string ? (
        <div>
          <span>"</span>
          <textarea
            cols={6}
            rows={1}
            value={value}
            onChange={internalOnValueChange}
          />
          <span>"</span>
        </div>
      ) : null}
      <Selector value={premitiveType} onChange={onTypeChange} />
    </div>
  )
}
