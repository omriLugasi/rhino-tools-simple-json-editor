import {
    AddNewNodeType,
    ERowOptionalTypes,
    RowItemType,
    UpdateNodeEventType,
    UpdateNodeTypeEventType,
    VirtualTreeType
} from "../jsonEditor/types.ts";
import { v4 as uuid } from 'uuid';


export class VirtualJsonTree {
    private virtualTree: Record<string, VirtualTreeType> = {}
    private onChange: () => void = () => {}


    constructor(private readonly tree: Record<string, unknown>) {
        this.buildTree()
    }

    /**
     * @description
     * Assign new node to the virtual tree
     */
    private assignNode(params: { key: string, value:unknown, type: string }): void {
        const { key, value, type} = params
        this.virtualTree[key] = {
            value,
            __type__: type,
            __custom_key__: uuid()
        }
    }

    /**
     * @description
     * Build the virtual tree from the actual provided json object
     */
    private buildTree(): void {
        Object.keys(this.tree).forEach((key: string) => {
            if (typeof this.tree[key] !== 'object') {
                this.assignNode({
                    key,
                    value: this.tree[key],
                    type: typeof this.tree[key]
                })
            } else if (typeof this.tree[key] === 'object' && this.tree[key] === null) {
                this.assignNode({
                    key,
                    value: this.tree[key],
                    type: ERowOptionalTypes.nullValue
                })
            }
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
        this.virtualTree = Object.keys(this.virtualTree).reduce((acc: Record<string, VirtualTreeType>, key: string) => {
            if (params.__custom_key__ === this.virtualTree[key].__custom_key__) {
                const item = this.virtualTree[key]
                acc[params.key] = {
                    ...item,
                    value: params.value,
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
            type: typeof value
        })
        this.onChange()
    }

    /**
     * @description
     * Provide all the main tree properties as array with all the needed parameters.
     */
    public getAll(): RowItemType[] {
        return Object.keys(this.virtualTree).reduce((acc: RowItemType[], key: string) => {
            const item = this.virtualTree[key]
            acc.push({
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
            })
            return acc
        }, [])
    }


}
