import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full flex-1 px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8 bg-[#D0C0AB]/100 ">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 THATTAE Food. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout
