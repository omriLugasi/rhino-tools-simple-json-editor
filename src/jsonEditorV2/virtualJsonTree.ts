import {
    AddNewNodeType,
    ERowOptionalTypes,
    RowItemType, ToggleNodeType,
    UpdateNodeEventType,
    UpdateNodeTypeEventType,
    VirtualTreeType
} from "../jsonEditor/types.ts";


export class VirtualJsonTree {
    private virtualTree: Record<string, VirtualTreeType> = {}
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
    private assignNode(params: { key: string, value: unknown, parentKey?: string, __visible__?: boolean }): void {
        const { key, value, parentKey, __visible__} = params
        const type = this.getTypeByValue(value)
        const data: VirtualTreeType = {
            __vjt_value__: value,
            __type__: type,
            __custom_key__: `${parentKey ? `${parentKey}.` : ''}${key}.__vjt_value__`,
            __display_key__: key,
            __visible__: __visible__ ?? true,
            __parent_key__: parentKey
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
        this.virtualTree[params.__custom_key__] = {
            ...this.virtualTree[params.__custom_key__],
            __type__: params.newType,
            __vjt_value__: this.getDefaultValueByType(params.newType)
        }
        this.onChange()
    }

    private toggleNode(params: ToggleNodeType): void {
        Object.keys(this.virtualTree).forEach(key => {
            const current  = this.virtualTree[key]
            if (current.__parent_key__ === params.__custom_key__) {
                console.log(`Toggle for ${current.__custom_key__}`)
                this.virtualTree[current.__custom_key__] = {
                    ...this.virtualTree[current.__custom_key__],
                    __visible__: !current.__visible__
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
            // const response = Object.keys(this.virtualTree).reduce((acc: Record<string, unknown>, key: string) => {
            //     acc[key] = this.virtualTree[key].value
            //     return acc
            // }, {})

            cb(this.virtualTree)
        }
    }

    /**
     * @description
     * Provide to the user the option to add new node to the json tree.
     */
    public addNewNode(params: AddNewNodeType): void {
        const { key, value} = params
        this.assignNode({
            key,
            value,
        })
        this.onChange()
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
                  if (item.__type__ !== ERowOptionalTypes.object) {
                      return
                  }
                    this.toggleNode({
                        __custom_key__: item.__custom_key__,
                    })
                },
                uniqueKey: (): string => {
                    return item.__custom_key__
                },
                getKeyValue: (): string  => {
                    return item.__display_key__ as string
                }
            }
        }

        return Object.keys(this.virtualTree).reduce((acc: RowItemType[], key: string) => {
            const item = this.virtualTree[key]
            if (item.__visible__) {
                acc.push(createItem(key, item))
            }
            return acc
        }, [])
    }


}
