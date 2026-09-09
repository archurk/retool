type User = { id: number }
type Params = { title: string; body: string }

export default async function (req: { params: Params; user: User }) {
  const userId = String(req.user.id)
  const { data } = await retoolDb.insert({
    tableName: 'notes',
    changeset: {
      user_id: userId,
      title: req.params.title,
      body: req.params.body,
    },
  })
  return data
}
