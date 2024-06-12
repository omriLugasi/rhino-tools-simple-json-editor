import {RowItemType, UpdateNodeEventType, VirtualTreeType} from "../jsonEditor/types.ts";


export class VirtualJsonTree {
    private virtualTree: Record<string, VirtualTreeType> = {}
    private onChange: () => void = () => {}


    constructor(private readonly tree: Record<string, unknown>) {
        this.buildTree()
    }

    private assignNode(params: { key: string, value:unknown, type: string }): void {
        const { key, value, type} = params
        this.virtualTree[key] = {
            value,
            __type__: type,
            __custom_key__: Math.random().toString(16).substring(2, 8)
        }
    }

    private buildTree(): void {
        Object.keys(this.tree).forEach((key: string) => {
            if (typeof this.tree[key] !== 'object') {
                this.assignNode({
                    key,
                    value: this.tree[key],
                    type: typeof this.tree[key]
                })
            }
        })
    }

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

    public onJsonChange(cb: (json: Record<string, unknown>) => void) {
        this.onChange = () => {
            const response = Object.keys(this.virtualTree).reduce((acc: Record<string, unknown>, key: string) => {
                acc[key] = this.virtualTree[key].value
                return acc
            }, {})

            cb(response)
        }
    }

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
                }
            })
            return acc
        }, [])
    }


}
