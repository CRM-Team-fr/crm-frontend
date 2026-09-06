import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { messagesApi, customersApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { LoadingState } from '../../components/common/LoadingState'
import { Card, CardBody } from '../../components/common/Card'
import { Send, MessageCircle } from 'lucide-react'

export const MessagesPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeOtherId, setActiveOtherId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const { data: threadsData, isLoading: threadsLoading } = useQuery({
    queryKey: ['messageThreads'],
    queryFn: async () => messagesApi.listThreads(),
    refetchInterval: 15_000,
  })

  // For customers: auto-select assigned salesperson if no threads yet
  const { data: customerData } = useQuery({
    queryKey: ['customerProfile', user?.customerProfileId],
    queryFn: async () => {
      if (!user?.customerProfileId) throw new Error('no profile')
      const r = await customersApi.getCustomerById(user.customerProfileId)
      return r.customer
    },
    enabled: user?.role === 'customer' && !!user?.customerProfileId,
  })

  const threads = threadsData?.threads || []
  const salespersonId = customerData?.assignedSalesperson?.id

  // Auto-select first thread OR (for customer) the assigned salesperson
  useEffect(() => {
    if (!activeOtherId) {
      if (threads.length > 0) setActiveOtherId(threads[0].otherUserId)
      else if (user?.role === 'customer' && salespersonId) setActiveOtherId(salespersonId)
    }
  }, [threads, activeOtherId, salespersonId, user?.role])

  const { data: threadData } = useQuery({
    queryKey: ['messageThread', activeOtherId],
    queryFn: async () => messagesApi.getThread(activeOtherId!),
    enabled: !!activeOtherId,
    refetchInterval: 8_000,
  })

  const send = useMutation({
    mutationFn: (text: string) => messagesApi.send(activeOtherId!, text),
    onSuccess: () => {
      setDraft('')
      queryClient.invalidateQueries({ queryKey: ['messageThread', activeOtherId] })
      queryClient.invalidateQueries({ queryKey: ['messageThreads'] })
    },
    onError: (err: any) => alert(err?.response?.data?.message || 'Failed to send.'),
  })

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [threadData?.messages?.length])

  const contactList = useMemo(() => {
    if (threads.length > 0) return threads
    // If no threads yet AND customer has assigned salesperson, show a "start chat" entry
    if (user?.role === 'customer' && customerData?.assignedSalesperson) {
      return [{
        otherUserId: customerData.assignedSalesperson.id,
        otherName: customerData.assignedSalesperson.Name,
        otherRole: 'salesperson',
        lastMessage: { text: 'Start a new conversation…', createdAt: new Date().toISOString(), mine: false },
        unread: 0,
      }]
    }
    return []
  }, [threads, user?.role, customerData])

  if (threadsLoading) return <LoadingState message="Loading messages…" />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-brand-600" />
        <h1 className="font-display text-2xl font-bold text-gray-900">Messages</h1>
      </div>

      {contactList.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">
              {user?.role === 'customer'
                ? 'No conversations yet. Once admin assigns you a salesperson, you can message them here.'
                : 'No conversations yet.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 h-[600px]">
          {/* Thread list */}
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100 h-full overflow-y-auto">
              {contactList.map((t: any) => (
                <button
                  key={t.otherUserId}
                  onClick={() => setActiveOtherId(t.otherUserId)}
                  className={`w-full text-left p-3 hover:bg-surface-50 transition-colors ${activeOtherId === t.otherUserId ? 'bg-brand-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{t.otherName}</p>
                      <p className="text-xs text-gray-500 capitalize">{t.otherRole}</p>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {t.lastMessage.mine ? 'You: ' : ''}{t.lastMessage.text}
                      </p>
                    </div>
                    {t.unread > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold grid place-items-center flex-none">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Active thread */}
          <Card className="flex flex-col overflow-hidden">
            {!activeOtherId ? (
              <div className="flex-1 grid place-items-center text-gray-500 text-sm">
                Select a conversation.
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{threadData?.other?.Name || '—'}</p>
                  <p className="text-xs text-gray-500 capitalize">{threadData?.other?.role || ''}</p>
                </div>

                <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-surface-50">
                  {threadData?.messages?.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-8">No messages yet. Say hi 👋</p>
                  )}
                  {threadData?.messages?.map((m: any) => (
                    <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.mine ? 'gradient-brand text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm'}`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <p className={`mt-0.5 text-[10px] ${m.mine ? 'text-white/70' : 'text-gray-400'} text-right`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  className="p-3 border-t border-gray-100 flex gap-2 bg-white"
                  onSubmit={(e) => { e.preventDefault(); if (draft.trim()) send.mutate(draft.trim()) }}
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || send.isPending}
                    className="h-11 w-11 rounded-full gradient-brand text-white grid place-items-center shadow-[var(--shadow-glow)] disabled:opacity-50"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
