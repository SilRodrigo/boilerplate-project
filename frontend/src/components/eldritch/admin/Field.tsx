import { TableCell, TableRow } from "@/components/ui/table"
import type { FieldType } from "@/data/characters"
import { useGameSocket } from "@/hooks/useGameSocket"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdminCollectionField } from "./CollectionField"

interface Props {
    token: string
    field: FieldType,
    k: string,
    draft: Record<string, number>,
    setDraft: (d: (prev: Record<string, number>) => Record<string, number>) => void
    updateField: ReturnType<typeof useGameSocket>["updateField"],
    removeItem: ReturnType<typeof useGameSocket>["removeItem"],
    addItem: ReturnType<typeof useGameSocket>["addItem"]
}

export function AdminField({
    token,
    field,
    k,
    draft,
    setDraft,
    updateField,
    removeItem,
    addItem
}: Props) {

    if (field.type === "collection") {
        return (
            <TableRow>
                <TableCell>{field.label}</TableCell>

                <TableCell colSpan={2}>
                    <AdminCollectionField
                        addItem={addItem}
                        removeItem={removeItem}
                        token={token}
                        field={field}
                    />
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableRow key={field.key}>
            <TableCell>{field.key}</TableCell>

            <TableCell className="w-32">
                <Input
                    type="number"
                    value={draft[k] ?? field.value}
                    onChange={(e) =>
                        setDraft((d) => ({
                            ...d,
                            [k]: Number(e.target.value)
                        }))
                    }
                />
            </TableCell>

            <TableCell className="w-16 ">
                <Button
                    className="active:scale-95 hover:scale-102 cursor-pointer transition duration-200"
                    size="sm"
                    onClick={() =>
                        updateField(
                            token,
                            field.key,
                            (draft[k] ?? field.value) - (Number(field.value) || 0)
                        )
                    }
                >
                    Aplicar
                </Button>
            </TableCell>
        </TableRow>
    )
}
