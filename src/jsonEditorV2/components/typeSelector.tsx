import React, { useCallback } from 'react'
import { ERowOptionalTypes } from '../../jsonEditor/types.ts'

interface IpropsRowSelector {
  value: ERowOptionalTypes
  onChange: (value: ERowOptionalTypes) => void
}

export const TypeSelector = (props: IpropsRowSelector) => {
  const { value, onChange } = props

  const onTypeChange = useCallback((e: Event) => {
      const currentValue = e.target.value
      props.onChange(currentValue)
  }, [])

  return (
    <select value={value} onChange={onTypeChange}>
      <option value={ERowOptionalTypes.string}>string</option>
      <option value={ERowOptionalTypes.number}>number</option>
      <option value={ERowOptionalTypes.boolean}>boolean</option>
      <option value={ERowOptionalTypes.object}>object</option>
      <option value={ERowOptionalTypes.array}>array</option>
      <option value={ERowOptionalTypes.nullValue}>null</option>
    </select>
  )
}
