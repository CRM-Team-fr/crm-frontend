import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activitiesApi } from '../../api'

interface CustomerTimelineProps {
  customerProfileId: string
}

const ACTIVITY_TYPES: Array<'note' | 'call' | 'meeting' | 'email'> = [
  'note',
  'call',
  'meeting',
  'email',
]

export const CustomerTimeline = ({ customerProfileId }: CustomerTimelineProps) => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['activities', customerProfileId],
    queryFn: () => activitiesApi.getCustomerActivities(customerProfileId),
    enabled: !!customerProfileId,
  })

  const activities: any[] = data?.activities || []

  const [activityType, setActivityType] = useState<typeof ACTIVITY_TYPES[number]>('note')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const create = useMutation({
    mutationFn: () =>
      activitiesApi.createActivity({
        customerProfileId,
        activityType,
        title,
        description,
      }),
    onSuccess: () => {
      setTitle('')
      setDescription('')
      setError('')
      queryClient.invalidateQueries({ queryKey: ['activities', customerProfileId] })
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to add activity')
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => activitiesApi.deleteActivity(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities', customerProfileId] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    create.mutate()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold">Activity Timeline</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm capitalize"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
          <input
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          rows={2}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={create.isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {create.isPending ? 'Adding…' : 'Add Activity'}
        </button>
      </form>

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
        {!isLoading && activities.length === 0 && (
          <p className="text-sm text-gray-500">No activities yet.</p>
        )}
        {activities.map((a) => (
          <div key={a._id || a.id} className="border border-gray-200 rounded-lg p-3 flex justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded capitalize">
                  {a.activityType}
                </span>
                <span className="text-sm font-medium">{a.title}</span>
              </div>
              {a.description && <p className="text-sm text-gray-600 mt-1">{a.description}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {a.createdBy?.Name || 'System'} · {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => remove.mutate(a._id || a.id)}
              className="text-xs text-red-600 hover:underline self-start"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
