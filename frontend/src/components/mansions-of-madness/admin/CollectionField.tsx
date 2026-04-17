import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { CATALOG } from "@/data/catalog"
import { getAllItems } from "@/utils/getItems"
import { useState } from "react"

type Props = {
    token: string
    field: any
    addItem: (token: string, itemId: string) => void
    removeItem: (token: string, itemId: string) => void
}

export function AdminCollectionField({
    token,
    field,
    addItem,
    removeItem
}: Props) {
    const allItems = getAllItems(CATALOG.ELDRITCH)
    const feitiços = allItems
        .filter(i => i.trait === 'Feitiço')
        .sort((a, b) => a.name.localeCompare(b.name))

    const condições = allItems
        .filter(i => i.trait === 'Condição')
        .sort((a, b) => a.name.localeCompare(b.name))

    const itens = allItems
        .filter(i => i.trait !== 'Feitiço' && i.trait !== 'Condição')
        .sort((a, b) => a.name.localeCompare(b.name))

    const [selectKey, setSelectKey] = useState(0)

    const selectValueChange = (value: string) => {
        onAdd(value)
        setSelectKey((k) => k + 1)
    }

    const onAdd = (itemId: string) => {
        addItem(token, itemId)
    };
    const onRemove = (itemId: string) => {
        removeItem(token, itemId)
    };

    return (
        <div className="space-y-3" >
            < div className="flex gap-3 flex-wrap" >
                {
                    field.value.map((item: any, index: number) => (
                        <div
                            key={item.id + index}
                            className="relative border rounded-md p-2"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-contain"
                            />

                            <Button
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer"
                                onClick={() => onRemove(item.id)}
                            >
                                ×
                            </Button>
                        </div>
                    ))
                }
            </div>

            < Select key={selectKey} onValueChange={selectValueChange}>
                <SelectTrigger className="w-64">
                    <SelectValue placeholder="Adicionar item…" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel className="font-semibold bg-neutral-100">Feitiços</SelectLabel>
                        {feitiços.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>

                    <SelectGroup>
                        <SelectLabel className="font-semibold bg-neutral-100">Condições</SelectLabel>
                        {condições.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>

                    <SelectGroup>
                        <SelectLabel className="font-semibold bg-neutral-100">Itens</SelectLabel>
                        {itens.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select >
        </div >
    )
}
