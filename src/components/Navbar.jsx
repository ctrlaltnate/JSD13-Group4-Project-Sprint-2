import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'หน้าหลัก', to: '/' },
  { label: 'เมนูอาหาร', to: '/menus' },
  { label: 'แพ็กเกจ', to: '/packages' },
  { label: 'โปรไฟล์', to: '/profile' },
]

const getLinkClassName = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-emerald-100 text-emerald-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="เมนูหลัก"
      >
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-emerald-700"
          onClick={() => setIsMenuOpen(false)}
        >
          BIA Food
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={getLinkClassName}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {isMenuOpen ? '×' : '☰'}
          </span>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={getLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
