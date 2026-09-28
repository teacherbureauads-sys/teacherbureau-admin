import React from 'react'
import DashboardLayout from '~/components/layout/dashboard_layout'
import QueryList from '~/components/section/query'

const page = async ({ searchParams }) => {
      const { page } = await searchParams;

  return (
    <div>
      <DashboardLayout>
        <QueryList page={page} />
      </DashboardLayout>
    </div>
  )
}

export default page
