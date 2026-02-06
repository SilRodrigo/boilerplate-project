import { useEffect, useState } from "react"
import { useGameSocket } from "@/hooks/useGameSocket"
import { applyTheme } from "@/theme/applyTheme"
import { eldritchTheme } from "@/theme/eldritch"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminField } from "@/components/eldritch/admin/Field"
import { joinAdminGame } from "@/api/game"

export default function Admin() {
    const { state, join, kickPlayer, updateField, removeItem, addItem } = useGameSocket()
    const [draft, setDraft] = useState<Record<string, number>>({})

    useEffect(() => {
        applyTheme(eldritchTheme)

        const joinGame = async () => {
            const { data } = await joinAdminGame('eldritch');

            const token = data.token;

            join(token);
        }

        joinGame()
    }, [])

    useEffect(() => {
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

    const excludedFields = [
        'name', 'job', 'quote', 'bio', 'action', 'passive', 'initialSpace',
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="font-title text-xl font-bold">Admin</h1>

            <div className="grid xl:grid-cols-3 grid-cols-1 gap-3">
                {state.players.map((player: any) => {
                    const characterName = player.character.fields.find((field: any) => field.key === 'name')?.value

                    return <Card key={player.token} >
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <div>
                                    {player.name} - <span className="italic text-[var(--muted-text)]">{characterName}</span>
                                </div>
                                <div>
                                    <Button
                                        className="active:scale-95 hover:scale-102 cursor-pointer transition duration-200"
                                        size="sm"
                                        onClick={() => kickPlayer(player.token)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            </CardTitle>
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
                                    {player.character.fields.filter((field: any) => !excludedFields.includes(field.key)).map((field: any, i: number) => {
                                        const k = `${player.token}:${field.key}:${i}`

                                        return (
                                            <AdminField
                                                key={k}
                                                token={player.token}
                                                field={field}
                                                k={k}
                                                draft={draft}
                                                setDraft={setDraft}
                                                updateField={updateField}
                                                removeItem={removeItem}
                                                addItem={addItem}
                                            />
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                })}
            </div>
        </div >
    )
}
