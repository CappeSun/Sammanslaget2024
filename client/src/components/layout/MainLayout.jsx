import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <main className='min-h-svh'>
      <Outlet />
    </main>
  )
}

export default MainLayout
