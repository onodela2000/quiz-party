import { BoardContent } from '@/features/board/BoardContent'
import { HostAuthGate } from '@/features/host-auth/HostAuthGate'

export default function Page() {
  return (
    <HostAuthGate>
      <BoardContent />
    </HostAuthGate>
  )
}
