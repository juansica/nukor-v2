'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/dashboard/Sidebar'
import {
  Search,
  Plus,
  MoreHorizontal,
  BookOpen,
  Pencil,
  Trash2,
  X,
  Menu,
} from 'lucide-react'

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001'

interface Entry {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  profiles?: { email: string; full_name: string | null } | null
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── New Entry Modal ─────────────────────────────────────────────────────────
function NewEntryModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Por favor, completa el título y el contenido.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { error: supaErr } = await supabase.from('entries').insert({
        title: title.trim(),
        content: content.trim(),
        workspace_id: DEFAULT_WORKSPACE_ID,
        created_by: user?.id,
        is_published: true,
      })
      if (supaErr) throw supaErr
      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message ?? 'Error al guardar la entrada.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-950">Nueva entrada</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
            <input
              type="text"
              placeholder="Ej. Política de vacaciones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-950 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contenido</label>
            <textarea
              placeholder="Escribe el conocimiento que quieres guardar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-950 placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteDialog({
  entryTitle,
  onConfirm,
  onCancel,
}: {
  entryTitle: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-950 mb-1">¿Eliminar entrada?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Se eliminará <span className="font-medium text-gray-900">"{entryTitle}"</span>{' '}
          permanentemente. Esta acción no se puede deshacer.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Entry Row ────────────────────────────────────────────────────────────────
function EntryRow({
  entry,
  onDelete,
}: {
  entry: Entry
  onDelete: (entry: Entry) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const preview = entry.content.slice(0, 120) + (entry.content.length > 120 ? '…' : '')
  const authorName =
    entry.profiles?.full_name ?? entry.profiles?.email ?? entry.created_by.slice(0, 8)

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="group flex items-start gap-4 px-5 py-4 hover:bg-[#F8F9FB] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
      {/* Icon */}
      <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
        <BookOpen size={15} className="text-indigo-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-950 truncate mb-0.5">{entry.title}</p>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{preview}</p>
        <p className="text-xs text-gray-400 mt-1.5">
          {authorName} · {formatDate(entry.created_at)}
        </p>
      </div>

      {/* Three-dot menu */}
      <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((p) => !p)
          }}
          className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-36 text-sm">
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Pencil size={14} className="text-gray-400" />
              Editar
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                setMenuOpen(false)
                onDelete(entry)
              }}
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Library Page ─────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const supabase = createClient()

  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Entry | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // User state for sidebar
  const [userName, setUserName] = useState('Usuario')
  const [userEmail, setUserEmail] = useState('')

  // ─── Fetch entries ──────────────────────────────────────────────────────────
  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('id, title, content, created_by, created_at')
      .eq('workspace_id', DEFAULT_WORKSPACE_ID)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEntries(data)
    }
    setLoading(false)
  }, [])

  // ─── Load user + entries on mount ──────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserName(
          (user.user_metadata?.full_name as string) ||
            user.email?.split('@')[0] ||
            'Usuario'
        )
        setUserEmail(user.email ?? '')
      }
      await fetchEntries()
    }
    init()
  }, [fetchEntries])

  // ─── Real-time subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('entries-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
          filter: `workspace_id=eq.${DEFAULT_WORKSPACE_ID}`,
        },
        () => {
          fetchEntries()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchEntries])

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('entries').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchEntries()
  }

  // ─── Filtered entries ───────────────────────────────────────────────────────
  const filtered = entries.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8F9FB]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden bg-black/10 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-30 flex-shrink-0
          w-64 h-full flex flex-col bg-white border-r border-gray-200
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar
          conversations={[]}
          activeConversationId={null}
          onSelectConversation={() => {}}
          onNewConversation={() => {}}
          userName={userName}
          userEmail={userEmail}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top bar */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <Menu size={18} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar entradas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-950 placeholder-gray-400 bg-white focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva entrada</span>
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">Base de conocimiento</h1>
              <p className="text-sm text-[#6B7280]">
                Todo el conocimiento de tu empresa en un solo lugar
              </p>
            </div>

            {/* Entries */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-gray-100 animate-pulse"
                    style={{ opacity: 1 - i * 0.2 }}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <BookOpen size={28} className="text-indigo-400" />
                </div>
                <p className="text-base font-semibold text-gray-950 mb-1">
                  {search ? 'Sin resultados' : 'No hay entradas aún'}
                </p>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  {search
                    ? `No se encontró ninguna entrada que coincida con "${search}"`
                    : 'Empieza guardando conocimiento desde el chat.'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                {filtered.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showNewModal && (
        <NewEntryModal
          onClose={() => setShowNewModal(false)}
          onSaved={fetchEntries}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          entryTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
