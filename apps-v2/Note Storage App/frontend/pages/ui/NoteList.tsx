import { FileText, Trash2 } from 'lucide-react'
import type { Note } from '../data/types'
import { cn } from '../../lib/shadcn/utils'
import { Button } from '../../lib/shadcn/button'

function preview(note: Note): string {
  const text = note.body.trim() || 'No additional text'
  return text.length > 60 ? `${text.slice(0, 60)}…` : text
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

type Props = {
  notes: Note[]
  selectedId: number | null
  onSelect: (id: number) => void
  onDelete: (id: number) => void
  loading: boolean
}

export function NoteList({ notes, selectedId, onSelect, onDelete, loading }: Props) {
  if (loading && notes.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">Loading notes…</div>
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <FileText className="h-8 w-8" />
        <p className="text-sm">No notes yet. Create your first one.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {notes.map((note) => (
        <li key={note.id}>
          <button
            type="button"
            onClick={() => onSelect(note.id)}
            className={cn(
              'group flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent',
              selectedId === note.id && 'bg-accent',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-foreground">
                {note.title.trim() || 'Untitled note'}
              </span>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete note"
              >
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(note.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </span>
              </Button>
            </div>
            <span className="truncate text-sm text-muted-foreground">{preview(note)}</span>
            <span className="text-xs text-muted-foreground">{formatDate(note.updated_at)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
