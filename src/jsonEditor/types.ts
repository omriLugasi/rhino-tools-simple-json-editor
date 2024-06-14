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
}


export type RowItemType = {
  key: string,
  value: unknown,
  getType: () => string,
  onChange: (key: string, value: unknown) => void
  onTypeChange: (newType: ERowOptionalTypes) => void
  uniqueKey: () => string
}


export type VirtualTreeType = {
  value: unknown,
  __type__: string,
  __custom_key__: string
  children?: VirtualTreeType[],
  __show_children__?: boolean
  __parent_custom_key__?: string
}


export type UpdateNodeEventType = {
  value: unknown,
  key: string,
  __custom_key__: string,
  __parent_custom_key__?: string
}

export type UpdateNodeTypeEventType = {
  newType: ERowOptionalTypes,
  __custom_key__: string
}

export type AddNewNodeType = {
  value: unknown,
  key: string,
}
