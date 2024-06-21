export type RowType = {
  type: string
  keyValue: string
  value: unknown
}

export enum ERowOptionalTypes {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  nullValue = 'null',
  object = 'object',
  array = 'array',
  datetime = 'datetime',
}


export type RowItemType = {
  key: string,
  value: unknown,
  order: number,
  getType: () => string,
  onChange: (key: string, value: unknown) => void
  onTypeChange: (newType: ERowOptionalTypes) => void
  uniqueKey: () => string
  getCustomKey: () => string
  addNewNode: (value: unknown) => void
  addNewNodeForObj: (value: unknown) => void
  getIndentation: () => number
  isKeyValueDisable: () => boolean
  getKeyValue: () => string
  isOpen: () => boolean
  onDropDownClicked: () => void
  duplicateNode: () => void
}


export type VirtualTreeType = {
  __vjt_value__: unknown,
  __type__: string,
  __custom_key__: string
  __show_children__?: boolean
  __display_key__?: string
  __visible__: boolean
  __parent_key__?: string
  __order__: number
}


export type UpdateNodeEventType = {
  value: unknown,
  key: string,
  __custom_key__: VirtualTreeType['__custom_key__'],
}

export type UpdateNodeTypeEventType = {
  newType: ERowOptionalTypes,
  __custom_key__: VirtualTreeType['__custom_key__'],
}


export type ToggleNodeType = {
  __custom_key__: VirtualTreeType['__custom_key__'],
  /**
   * @description
   * Useful when we want to run toggle node, with specific state, for example open.
   */
  forceState?: boolean
}


export type AssignNewNodeType = {
  key: string,
  value: unknown,
  parentKey?: string,
  __visible__?: VirtualTreeType['__visible__']
}
