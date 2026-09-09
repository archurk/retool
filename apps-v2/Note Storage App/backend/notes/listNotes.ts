type User = { id: number }

export default async function (req: { params: Record<string, never>; user: User }) {
  const userId = String(req.user.id)
  const { data } = await retoolDb.query(
    `SELECT id, title, body, created_at, updated_at
     FROM notes
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [userId],
  )
  return data
}
