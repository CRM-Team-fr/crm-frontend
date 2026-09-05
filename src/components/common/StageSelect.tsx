import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '../../api'
import { CUSTOMER_STAGES } from '../../constants'

interface StageSelectProps {
  customerProfileId: string
  currentStage: string
  onChanged?: (newStage: string) => void
  disabled?: boolean
}

export const StageSelect = ({ customerProfileId, currentStage, onChanged, disabled }: StageSelectProps) => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string>('')

  const { data: stagesData } = useQuery({
    queryKey: ['customer-stages'],
    queryFn: () => customersApi.getAvailableStages(),
    staleTime: Infinity,
  })

  const availableStages: string[] =
    stagesData?.stages || stagesData?.data || (CUSTOMER_STAGES as unknown as string[])

  const mutation = useMutation({
    mutationFn: (newStage: string) => customersApi.updateCustomerStage(customerProfileId, newStage),
    onSuccess: (_res, newStage) => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerProfileId] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      onChanged?.(newStage)
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || err?.message || 'Failed to update stage')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setError('')
    const newStage = e.target.value
    if (newStage && newStage !== currentStage) mutation.mutate(newStage)
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500">Stage</label>
      <select
        value={currentStage}
        onChange={handleChange}
        disabled={disabled || mutation.isPending}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        {availableStages.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
