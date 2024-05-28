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
