import React from 'react'
import { ERowOptionalTypes } from '../types.ts'

interface IpropsRowSelector {
  value: ERowOptionalTypes
  onChange: (value: ERowOptionalTypes) => void
}

export const Selector = (props: IpropsRowSelector) => {
  const { value, onChange } = props
  return (
    <select value={value} onChange={onChange}>
      <option value={ERowOptionalTypes.string}>string</option>
      <option value={ERowOptionalTypes.number}>number</option>
      <option value={ERowOptionalTypes.boolean}>boolean</option>
      <option value={ERowOptionalTypes.object}>object</option>
      <option value={ERowOptionalTypes.array}>array</option>
      <option value={ERowOptionalTypes.nullValue}>null</option>
    </select>
  )
}
