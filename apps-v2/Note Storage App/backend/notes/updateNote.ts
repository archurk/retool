type User = { id: number }
type Params = { id: number; title: string; body: string }

export default async function (req: { params: Params; user: User }) {
  const userId = String(req.user.id)
  const { data } = await retoolDb.updateBy({
    tableName: 'notes',
    filterBy: [
      { key: 'id', operation: '=', value: req.params.id },
      { key: 'user_id', operation: '=', value: userId },
    ],
    changeset: {
      title: req.params.title,
      body: req.params.body,
      updated_at: new Date().toISOString(),
    },
  })
  return data
}
