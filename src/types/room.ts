import { Tables } from './database'

export type Room = Tables<'rooms'> & {
  host_token?: string
  expires_at?: string
}
export type Participant = Tables<'participants'>
