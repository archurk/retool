type User = { id: number }
type Params = { id: number }

export default async function (req: { params: Params; user: User }) {
  const userId = String(req.user.id)
  const { data } = await retoolDb.deleteBy({
    tableName: 'notes',
    filterBy: [
      { key: 'id', operation: '=', value: req.params.id },
      { key: 'user_id', operation: '=', value: userId },
    ],
  })
  return data
}
