import { useEffect, useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import type { Note } from '../data/types'
import { Button } from '../../lib/shadcn/button'
import { Input } from '../../lib/shadcn/input'
import { Textarea } from '../../lib/shadcn/textarea'

type Props = {
  note: Note
  onSave: (id: number, title: string, body: string) => Promise<void>
  onDelete: (id: number) => void
  saving: boolean
}

export function NoteEditor({ note, onSave, onDelete, saving }: Props) {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  useEffect(() => {
    setTitle(note.title)
    setBody(note.body)
  }, [note.id, note.title, note.body])

  const dirty = title !== note.title || body !== note.body

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="border-0 text-lg font-semibold shadow-none focus-visible:ring-0"
        />
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            onClick={() => onSave(note.id, title, body)}
            disabled={!dirty || saving}
          >
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(note.id)}
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Start writing…"
        className="flex-1 resize-none rounded-none border-0 p-4 text-base shadow-none focus-visible:ring-0"
      />
    </div>
  )
}
