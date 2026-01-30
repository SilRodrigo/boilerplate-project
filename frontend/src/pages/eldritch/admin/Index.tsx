import { useEffect, useState } from "react"
import { useGameSocket } from "@/hooks/useGameSocket"
import { applyTheme } from "@/theme/applyTheme"
import { eldritchTheme } from "@/theme/eldritch"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdminCollectionField } from "@/components/eldritch/admin/CollectionField"

export default function Admin() {
    const { state, join, updateField, removeItem, addItem } = useGameSocket()
    const [draft, setDraft] = useState<Record<string, number>>({})

    useEffect(() => {
        applyTheme(eldritchTheme)

        join({
            character: {
                id: '',
                name: '',
                image: '',
                quote: '',
                bio: '',
                fields: []
            },
            name: '',
            token: crypto.randomUUID(),
            role: 'admin'
        })
    }, [])

    useEffect(() => {
        console.log(state)
        if (!state) return

        const next: Record<string, number> = {}
        state.players.forEach((player: any) => {
            player.character.fields.forEach((field: any) => {
                next[`${player.token}:${field.key}`] = field.value
            })
        })
        setDraft(next)
    }, [state])

    if (!state) return <div>Carregando admin…</div>

    return (
        <div className="p-6 space-y-6">
            <h1 className="font-title text-xl font-bold">Admin</h1>

            <div className="grid grid-cols-3 gap-3">
                {state.players.map((player: any) => (
                    <Card key={player.token}>
                        <CardHeader>
                            <CardTitle>{player.name} ({player.status})</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campo</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {player.character.fields.map((field: any) => {
                                        const k = `${player.token}:${field.key}`

                                        if (field.type === "collection") {
                                            return (
                                                <TableRow key={field.key}>
                                                    <TableCell>{field.label}</TableCell>

                                                    <TableCell colSpan={2}>
                                                        <AdminCollectionField
                                                            addItem={addItem}
                                                            removeItem={removeItem}
                                                            playerId={player.token}
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
                                                                player.token,
                                                                field.key,
                                                                (draft[k] ?? field.value) - field.value
                                                            )
                                                        }
                                                    >
                                                        Aplicar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
