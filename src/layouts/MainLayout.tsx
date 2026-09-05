import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
