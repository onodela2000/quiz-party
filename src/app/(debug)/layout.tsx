export default function DebugLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') return <div>Not Found</div>
  return <>{children}</>
}
