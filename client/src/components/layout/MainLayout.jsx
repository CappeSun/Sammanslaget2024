import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <main className='min-h-screen px-4 md:px-6'>
      <Outlet />
    </main>
  )
}

export default MainLayout
