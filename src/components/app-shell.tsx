import { Outlet } from 'react-router-dom'

export default function AppShell() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}
