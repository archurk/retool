import { useCallback, useEffect, useState } from 'react'
import { NotebookPen, Plus } from 'lucide-react'
import type { Note } from './data/types'
import { NoteList } from './ui/NoteList'
import { NoteEditor } from './ui/NoteEditor'
import { Button } from '../lib/shadcn/button'
import { Spinner } from '../lib/shadcn/spinner'
import { Toaster, toast } from '../lib/shadcn/sonner'
import {
  useListNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from '../hooks/backend/notes'

export default function Notes() {
  const { data, loading, error, trigger: listNotes } = useListNotes()
  const { trigger: createNote } = useCreateNote()
  const { trigger: updateNote, loading: saving } = useUpdateNote()
  const { trigger: deleteNote } = useDeleteNote()

  const notes = (data as Note[] | undefined) ?? []
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    const rows = (await listNotes({}, { skipCache: true })) as Note[]
    return rows
  }, [listNotes])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Keep a valid selection as the list changes.
  useEffect(() => {
    if (notes.length === 0) {
      if (selectedId !== null) setSelectedId(null)
      return
    }
    if (selectedId === null || !notes.some((n) => n.id === selectedId)) {
      setSelectedId(notes[0]!.id)
    }
  }, [notes, selectedId])

  const handleCreate = useCallback(async () => {
    try {
      await createNote({ title: '', body: '' })
      const rows = await refresh()
      if (rows.length > 0) setSelectedId(rows[0]!.id)
    } catch {
      toast.error('Could not create note')
    }
  }, [createNote, refresh])

  const handleSave = useCallback(
    async (id: number, title: string, body: string) => {
      try {
        await updateNote({ id, title, body })
        await refresh()
        toast.success('Note saved')
      } catch {
        toast.error('Could not save note')
      }
    },
    [updateNote, refresh],
  )

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteNote({ id })
        await refresh()
        toast.success('Note deleted')
      } catch {
        toast.error('Could not delete note')
      }
    },
    [deleteNote, refresh],
  )

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Toaster />
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <NotebookPen className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">My Notes</h1>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-80 shrink-0 flex-col border-r border-border">
          <div className="flex items-center justify-between gap-2 border-b border-border p-3">
            <span className="text-sm font-medium text-muted-foreground">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
            <Button size="sm" onClick={handleCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              New
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {error ? (
              <div className="p-4 text-sm text-destructive">{error}</div>
            ) : (
              <NoteList
                notes={notes}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDelete={handleDelete}
                loading={loading}
              />
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onSave={handleSave}
              onDelete={handleDelete}
              saving={saving}
            />
          ) : loading ? (
            <div className="flex h-full items-center justify-center">
              <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <NotebookPen className="h-10 w-10" />
              <p className="text-sm">Select a note or create a new one to get started.</p>
              <Button onClick={handleCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                New note
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
