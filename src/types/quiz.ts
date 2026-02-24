import { Tables } from './database'

export type Quiz = Tables<'quizzes'> & { choices: string[] }
export type Answer = Tables<'answers'>
