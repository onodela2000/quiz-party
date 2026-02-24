import { HostEditContent } from '@/features/host-edit/HostEditContent'
import { HostAuthGate } from '@/features/host-auth/HostAuthGate'

export default function Page() {
  return (
    <HostAuthGate>
      <HostEditContent />
    </HostAuthGate>
  )
}
