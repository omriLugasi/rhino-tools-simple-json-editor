import {
    AssignNewNodeType,
    ERowOptionalTypes,
    RowItemType,
    ToggleNodeType,
    UpdateNodeEventType,
    UpdateNodeTypeEventType,
    VirtualTreeType
} from "../jsonEditor/types.ts";


export class VirtualJsonTree {
    private virtualTree: Record<string, VirtualTreeType> = {}
    private order: number = 0
    private onChange: () => void = () => {}


    constructor(private readonly tree: Record<string, unknown>) {
        this.buildTree()
    }

    private getTypeByValue(value: unknown): ERowOptionalTypes {
        if (Array.isArray(value)) {
            return ERowOptionalTypes.array
        } else if (typeof value === ERowOptionalTypes.object && value !== null) {
            return ERowOptionalTypes.object
        } else if (value === null) {
            return ERowOptionalTypes.nullValue
        } else {
            return typeof value as ERowOptionalTypes
        }
    }

    /**
     * @description
     * Assign new node to the virtual tree
     */
    private assignNode(params: AssignNewNodeType): void {
        const { key, value, parentKey, __visible__} = params
        const type = this.getTypeByValue(value)

        let val: unknown = value

        if (type === ERowOptionalTypes.object) {
            val = {}
        } else if (type === ERowOptionalTypes.array) {
            val = []
        }

        let currentOrder: number = 0
        const parent = this.virtualTree[parentKey as string]
        if (!!parent) {
            currentOrder = parent.__order__ + 0.1
        } else {
            currentOrder = (this.order += 1000) // I think that number will be a good fit for this case of ordering.
        }

        const data: VirtualTreeType = {
            __vjt_value__: val,
            __type__: type,
            __custom_key__: `${parentKey ? `${parentKey}.` : ''}${key}.__vjt_value__`,
            __display_key__: key,
            __visible__: __visible__ ?? true,
            __parent_key__: parentKey,
            __order__: currentOrder
        }

        this.virtualTree[data.__custom_key__] = data

        if (type === ERowOptionalTypes.object) {
            Object.keys(value).forEach((innerKey: string) => {
               const item = value[innerKey]
               this.assignNode({
                   key: innerKey,
                   parentKey: `${data.__custom_key__}`,
                   value: item,
                   __visible__: false
               })
            })
        } else if (type === ERowOptionalTypes.array) {
            value.forEach((val: unknown, index: number) => {
                this.assignNode({
                    key: `${index}`,
                    parentKey: `${data.__custom_key__}`,
                    value: val,
                    __visible__: false
                })
            })
        }
    }

    /**
     * @description
     * Build the virtual tree from the actual provided json object
     */
    private buildTree(): void {
        Object.keys(this.tree).forEach((key: string) => {
            this.assignNode({
                key,
                value: this.tree[key]
            })
        })
    }

    /**
     * @description
     * Get the default value depends on the new provided type.
     */
    private getDefaultValueByType(newType: ERowOptionalTypes): unknown {
        switch (newType) {
            case ERowOptionalTypes.number:
                return 0
            case ERowOptionalTypes.string:
                return ''
            case ERowOptionalTypes.boolean:
                return false
            case ERowOptionalTypes.nullValue:
                return null
            case ERowOptionalTypes.object:
                return {}
            case ERowOptionalTypes.array:
                return []
        }
    }

    /**
     * @description
     * Update node key and value by the __custom_key__ property.
     * If the display key was updated we need to update also the __custom_key__.
     */
    private updateNode(params: UpdateNodeEventType): void {
        console.log({
            operation: 'change happen at',
            key: params.__custom_key__,
            value: params.value,
            tree:  this.virtualTree,
            newKey: params.key
        })
        const currentItem = this.virtualTree[params.__custom_key__]

        if (currentItem.__display_key__ !== params.key) {
            const currentCustomKey = params.__custom_key__.replace(`.${currentItem.__display_key__}.`, `.${params.key}.`)
            const oldItem = this.virtualTree[params.__custom_key__]
            delete this.virtualTree[params.__custom_key__]
            this.virtualTree[currentCustomKey] = {
                ...oldItem,
                __vjt_value__: params.value,
                __custom_key__: currentCustomKey,
                __display_key__: params.key
            }
        } else {
            this.virtualTree[params.__custom_key__] = {
                ...this.virtualTree[params.__custom_key__],
                __vjt_value__: params.value
            }
        }
        this.onChange()
    }

    /**
     * @description
     * When a user update the type of the row we should update the value to the
     * default value of the new type.
     */
    private updateNodeType(params: UpdateNodeTypeEventType): void {
        console.log({
            operation: 'chang type happen at',
            key: params.__custom_key__,
            value: params.newType,
            tree:  this.virtualTree,
        })
        const currentItem = this.virtualTree[params.__custom_key__]

        if (currentItem.__type__ === ERowOptionalTypes.object || currentItem.__type__ === ERowOptionalTypes.array) {
            Object.keys(this.virtualTree).forEach(key => {
                const current  = this.virtualTree[key]
                if (current.__custom_key__.startsWith(params.__custom_key__)) {
                    delete this.virtualTree[key]
                }
            })
        }
        this.virtualTree[params.__custom_key__] = {
            ...currentItem,
            __type__: params.newType,
            __vjt_value__: this.getDefaultValueByType(params.newType)
        }
        this.onChange()
    }

    private toggleNode(params: ToggleNodeType): void {
        Object.keys(this.virtualTree).forEach(key => {
            const current  = this.virtualTree[key]
            if (current.__parent_key__ === params.__custom_key__) {
                this.virtualTree[current.__custom_key__] = {
                    ...this.virtualTree[current.__custom_key__],
                    __visible__: !current.__visible__
                }
            } else if (params.__custom_key__ === current.__custom_key__) {
                this.virtualTree[current.__custom_key__] = {
                    ...this.virtualTree[current.__custom_key__],
                    __show_children__: !current.__show_children__
                }
            }
        })
        this.onChange()
    }

    /**
     * @description
     * Use as event emitter for all the other implementation that are not js.
     */
    public onJsonChange(cb: (json: Record<string, unknown>) => void) {
        this.onChange = () => {

            const response = Object.keys(this.virtualTree).reduce((acc: Record<string, unknown>, key: string) => {
                const item = this.virtualTree[key]
                acc[item.__custom_key__.replace(/\.__vjt_value__/g, '') as string] = item.__vjt_value__
                return acc
            }, {})

            const mainObj = JSON.parse(JSON.stringify(response))

            cb(Object.entries(mainObj).reduce((r, [k, v]) => {
                k.split('.').reduce((a, e, i, ar) => {
                    return a[e] || (a[e] = ar[i + 1] ? {} : v)
                }, r)

                return r;
            }, {}))
        }
    }

    /**
     * @description
     * Provide to the user the option to add new node to the json tree.
     */
    public addNewNode(params: AssignNewNodeType): void {
        this.assignNode(params)
        this.onChange()
    }

    /**
     * @description
     * Provide the new item key and item parent key by the provided values.
     */
    private getItemPaths(item: VirtualTreeType, options?: { duplicate: boolean }): { key: string, parentKey?: string } {
        const { __type__, __parent_key__, __custom_key__ } = item
        const parent = this.virtualTree[__parent_key__ as string]
        let key: string | number = options?.duplicate ? `${item.__display_key__}-copy` : Math.random().toString(16).substring(2, 8)
        if (__type__ === ERowOptionalTypes.array || parent?.__type__ === ERowOptionalTypes.array) {
            const customKey = __type__ === ERowOptionalTypes.array ? item.__custom_key__ : parent.__custom_key__
            key = 0
            for (const vkey of Object.keys(this.virtualTree)) {
                const current = this.virtualTree[vkey]
                if (current.__parent_key__ === customKey) {
                    key = Math.max(key, parseInt(current.__display_key__ as string))
                }
            }
            key = `${key + 1}`
        }

        let parentKey = __parent_key__
        if (__type__ === ERowOptionalTypes.object || __type__ === ERowOptionalTypes.array) {
            parentKey = __custom_key__
        }
        if (options?.duplicate) {
            parentKey = __parent_key__
        }
        return { key, parentKey }
    }

    /**
     * @description
     * Provide all the main tree properties as array with all the needed parameters.
     */
    public getAll(): RowItemType[] {

        const createItem = (key: string, item: VirtualTreeType) => {
            return {
                key,
                value: item.__vjt_value__,
                getType: () => item.__type__,
                getCustomKey: (): string => item.__custom_key__,
                onChange: (key: string, value: unknown) => {
                    this.updateNode({
                        key,
                        value,
                        __custom_key__: item.__custom_key__
                    })
                },
                onTypeChange: (newType: ERowOptionalTypes): void => {
                    this.updateNodeType({
                        __custom_key__: item.__custom_key__,
                        newType
                    })
                },
                onDropDownClicked: (): void => {
                  if (item.__type__ !== ERowOptionalTypes.object && item.__type__ !== ERowOptionalTypes.array) {
                      return
                  }
                    this.toggleNode({
                        __custom_key__: item.__custom_key__,
                    })
                },
                uniqueKey: (): string => {
                    return item.__custom_key__ + item.__type__
                },
                getKeyValue: (): string  => {
                    return item.__display_key__ as string
                },
                getIndentation: (): number => {
                    return item.__custom_key__.split('.__vjt_value__').length -2
                },
                isOpen: (): boolean => {
                    return !!item.__show_children__
                },
                isKeyValueDisable: (): boolean => {
                    const parent = this.virtualTree[item.__parent_key__ as string]
                    return parent && parent.__type__ === ERowOptionalTypes.array

                },
                addNewNodeForObj: (params: {value: unknown }): void => {
                    const { key, parentKey} = this.getItemPaths(item)
                    this.addNewNode({
                        key,
                        value: params.value,
                        parentKey,
                        __visible__: true
                    })
                },
                addNewNode: (params: {value: unknown }): void => {
                    const { key, parentKey } = this.getItemPaths(item)
                    this.addNewNode({
                        key,
                        value: params.value,
                        parentKey,
                        __visible__: true
                    })
                },
                duplicateNode: (): void => {
                    const current = this.virtualTree[item.__custom_key__]
                    const { key, parentKey } = this.getItemPaths(current, { duplicate: true })
                    // if the item already exists, do nothing.
                    if (this.virtualTree[key]) {
                        return
                    }
                    this.addNewNode({
                        key,
                        value: current.__vjt_value__,
                        parentKey: parentKey,
                        __visible__: current.__visible__
                    })
                }
            }
        }

        return Object.keys(this.virtualTree).reduce((acc: RowItemType[], key: string) => {
            const item = this.virtualTree[key]
            if (item.__visible__) {
                acc.push(createItem(key, item))
            }
            return acc
        }, []).sort((a, b) => {
            return a.getCustomKey().localeCompare(b.getCustomKey())
        })
    }


}
