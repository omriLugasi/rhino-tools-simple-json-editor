import {
    AddNewNodeType,
    ERowOptionalTypes,
    RowItemType,
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
    private assignNode(params: { key: string, value: unknown, parentKey?: string,  obj?: Record<string, unknown> }): void {
        const { key, value, obj = this.virtualTree, parentKey} = params
        const type = this.getTypeByValue(value)
        const data: VirtualTreeType = {
            value,
            __type__: type,
            __custom_key__: `${parentKey ?? ''}${key}.value`
        }
        if (type === ERowOptionalTypes.object) {

            Object.keys(value).forEach((key: string) => {
               const item = value[key]
                console.log({ beforeAssign: item, value })
               this.assignNode({
                   key: key,
                   parentKey: `${data.__custom_key__}.`,
                   value: item,
                   obj: data.value
               })
            })
            // needs to work on the solution a little bit more.
            // data.children = Object.keys(value).reduce((acc: Record<string, VirtualTreeType>, key: string) => {
            //     acc[key] = {
            //         value: value[key],
            //         __type__:  this.getTypeByValue(value[key]),
            //         __custom_key__: `${data.__custom_key__}.${key}`,
            //     }
            //     return acc
            // }, {})
            data.__show_children__ = true
        }
        obj[key] = data
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
     */
    private updateNode(params: UpdateNodeEventType): void {
        const example = function(obj, prop, val){
            var props = prop.split('.')
                , final = props.pop(), p
            while(p = props.shift()){
                if (typeof obj[p] === 'undefined')
                    return undefined;
                obj = obj[p]
            }
            return val ? (obj[final] = val) : obj[final]
        }
        console.log({
            operation: 'change happen at',
            key: params.__custom_key__,
            value: params.value
        })
        example(this.virtualTree, params.__custom_key__, params.value)
        this.onChange()
        console.log(this.virtualTree)
    }

    /**
     * @description
     * When a user update the type of the row we should update the value to the
     * default value of the new type.
     */
    private updateNodeType(params: UpdateNodeTypeEventType): void {
        this.virtualTree = Object.keys(this.virtualTree).reduce((acc: Record<string, VirtualTreeType>, key: string) => {
            if (params.__custom_key__ === this.virtualTree[key].__custom_key__) {
                const item = this.virtualTree[key]
                acc[key] = {
                    ...item,
                    __type__: params.newType,
                    value: this.getDefaultValueByType(params.newType)
                }
            } else {
                acc[key] = this.virtualTree[key]
            }
            return acc
        }, {})
        this.onChange()
    }

    /**
     * @description
     * Use as event emitter for all the other implementation that are not js.
     */
    public onJsonChange(cb: (json: Record<string, unknown>) => void) {
        this.onChange = () => {
            const response = Object.keys(this.virtualTree).reduce((acc: Record<string, unknown>, key: string) => {
                acc[key] = this.virtualTree[key].value
                return acc
            }, {})

            cb(response)
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
                value: item.value,
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
                uniqueKey: (): string => {
                    return item.__custom_key__
                }
            }
        }

        return Object.keys(this.virtualTree).reduce((acc: RowItemType[], key: string) => {
            const item = this.virtualTree[key]
            acc.push(createItem(key, this.virtualTree[key]))

            /**
             * @description
             * If the user click to open an object, we will need to show the properties of the object
             * as part of the rows.
             */
            if (item.__type__ === ERowOptionalTypes.object && item.__show_children__) {
                const data: Record<string, VirtualTreeType> = item.value ?? {}
                console.log({ data })
                Object.keys(data)?.forEach((key: string) => {
                    const currentItem = data[key]
                    console.log({ key, currentItem })
                    acc.push(createItem(key, currentItem))
                })
            }
            return acc
        }, [])
    }


}
