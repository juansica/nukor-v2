'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IConversation } from '@/types/chat'
import SignOutButton from '@/components/auth/SignOutButton'
import { Plus, Clock, BookOpen, Layers, ChevronDown, X } from 'lucide-react'

interface SidebarProps {
  conversations: IConversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  userName: string
  userEmail: string
  onClose: () => void
}

const navItems = [
  { label: 'Base de conocimientos', Icon: BookOpen, path: '/dashboard/library' },
  { label: 'Historial', Icon: Clock, path: '/dashboard/history' },
  { label: 'Áreas', Icon: Layers, path: '/dashboard/areas' },
]

const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  userName,
  userEmail,
  onClose,
}: SidebarProps) => {
  const initials = userName.slice(0, 2).toUpperCase()
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white text-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-base tracking-tight text-gray-950"
          >
            <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-black bg-indigo-600 text-white">
              N
            </span>
            Nukor
          </Link>
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-slate-50 transition-colors text-gray-500"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Workspace selector */}
        <div className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
          <span className="text-sm font-medium text-gray-950">Mi workspace</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>

      {/* New conversation */}
      <div className="p-4 pl-5 pr-5 flex-shrink-0">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={16} />
          Nueva conversación
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-3 flex-shrink-0">
        {navItems.map(({ label, Icon, path }) => {
          const isActive = pathname.startsWith(path)
          return (
            <Link
              key={label}
              href={path}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left border border-transparent ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-slate-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-5 border-t border-gray-200 flex-shrink-0" />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-sm px-2 py-2 leading-relaxed text-gray-500">
            Tus conversaciones aparecerán aquí
          </p>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors truncate border-l-2 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-600 font-medium'
                    : 'text-gray-600 border-transparent hover:bg-slate-50 hover:text-gray-900 font-medium'
                }`}
              >
                {conv.title || 'Nueva conversación'}
              </button>
            )
          })
        )}
      </div>

      {/* User footer */}
      <div className="flex-shrink-0 p-5 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
            {initials}
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start">
            <p className="text-sm font-semibold truncate text-gray-950 tracking-tight">{userName}</p>
            <p className="text-xs truncate text-gray-500 mb-1">{userEmail}</p>
            <SignOutButton className="text-xs text-gray-500 hover:text-gray-900 transition-colors text-left font-medium underline underline-offset-2 decoration-gray-300 hover:decoration-gray-900" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
