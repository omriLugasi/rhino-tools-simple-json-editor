import React, { useState, useCallback } from 'react'
import { PremitiveRow } from './components/premitiveRow.tsx'
import { ArrayRow } from './components/arrayRow.tsx'
import { ERowOptionalTypes } from './types.ts'
import { ObjectRow } from './components/objectRow.tsx'
import { NullRow } from './components/nullRow.tsx'
import {Line} from "./components/lineNumber.tsx";

const addIdentifier = (row: Record<string, unknown>) => {
  const newRow = { ...row }

  Object.defineProperty(newRow, '__custom__key__', {
    value: Math.random().toString(16).substring(2, 8),
    configurable: false,
    writable: false,
    enumerable: false,
  })
  return newRow
}

const restructureInitialValue = (value: Record<string, unknown>) => {
  const data = JSON.parse(JSON.stringify(value))
  let arr
  if (Array.isArray(data)) {
    arr = data.map((value, index) => {
      return addIdentifier({
        key: index,
        value,
        __metadata__: {
          keyValueWriteable: false,
        },
      })
    })
  } else {
    arr = Object.keys(data).map((key) => {
      return addIdentifier({
        key,
        value: data[key],
        __metadata__: {
          keyValueWriteable: true,
        },
      })
    })
  }
  return arr
}

interface Iprops {
  value: Record<string, unknown>
  /**
   * @description
   * Help us define the level of the json editor resolver
   */
  __level__?: number
}

export const JsonEditor = (props: Iprops) => {
  const [json, setJson] = useState<Record<string, unkown>>(
    restructureInitialValue(props.value),
  )

  const onRowChanged = useCallback(
    (__custom__key__: string) =>
      (oldKey: string, key: string, value: string) => {
        setJson((prev) => {
          const index = prev.findIndex(
            (row) => row.__custom__key__ === __custom__key__,
          )
          prev[index].key = key
          prev[index].value = value
          return [...prev]
        })
      },
    [],
  )

  const onRowTypeChanged = useCallback(
    (__custom__key__: string) => (e: Event) => {
      const newType = e.target.value
      setJson((prev) => {
        const index = prev.findIndex(
          (row) => row.__custom__key__ === __custom__key__,
        )
        if (newType === ERowOptionalTypes.number) {
          prev[index].value = 0
        } else if (newType === ERowOptionalTypes.boolean) {
          prev[index].value = false
        } else if (newType === ERowOptionalTypes.string) {
          prev[index].value = ''
        } else if (newType === ERowOptionalTypes.array) {
          prev[index].value = []
        } else if (newType === ERowOptionalTypes.object) {
          prev[index].value = {}
        } else if (newType === ERowOptionalTypes.nullValue) {
          prev[index].value = null
        }
        return [...prev]
      })
    },
    [],
  )

  return (
    <div>
      {json.map(({ key, value, __custom__key__, __metadata__ }, index: number) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          return (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Line
                  key={__custom__key__}
                  index={index}
                  type={typeof value}
              />
              <PremitiveRow
                __level__={props.__level__ ?? 0}
                key={__custom__key__}
                premitiveType={typeof value}
                value={value}
                keyValue={key}
                disable={__metadata__.keyValueWriteable}
                onChange={onRowChanged(__custom__key__)}
                onTypeChange={onRowTypeChanged(__custom__key__)}
              />
            </div>
          )
        } else if (Array.isArray(value)) {
          return (
            <ArrayRow
              __level__={props.__level__ ?? 0}
              key={__custom__key__}
              value={value}
              keyValue={key}
              disable={__metadata__.keyValueWriteable}
              onChange={onRowChanged(__custom__key__)}
              onTypeChange={onRowTypeChanged(__custom__key__)}
            />
          )
        } else if (typeof value === 'object' && value !== null) {
          return (
            <ObjectRow
              __level__={props.__level__ ?? 0}
              key={__custom__key__}
              value={value}
              keyValue={key}
              disable={__metadata__.keyValueWriteable}
              onChange={onRowChanged(__custom__key__)}
              onTypeChange={onRowTypeChanged(__custom__key__)}
            />
          )
        } else if (typeof value === 'object' && value === null) {
          return (
            <NullRow
              __level__={props.__level__ ?? 0}
              key={__custom__key__}
              value={value}
              keyValue={key}
              disable={__metadata__.keyValueWriteable}
              onChange={onRowChanged(__custom__key__)}
              onTypeChange={onRowTypeChanged(__custom__key__)}
            />
          )
        } else {
          return
        }
      })}
    </div>
  )
}
