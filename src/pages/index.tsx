import Image from 'next/image'
import { Inter } from 'next/font/google'
import PassageLogin from '@/components/login'
import { getAuthenticatedUserFromSession } from '@/utils/passage'
import { useRouter } from 'next/router'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home({isAuthorized}: any) {

  const router = useRouter();

  React.useEffect(()=> {
    if(isAuthorized){
      router.push('/dashboard')
    }
  })
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
       <PassageLogin />
    </main>
  )
}


export const getServerSideProps = async (ctx: any) => {
  const user = await getAuthenticatedUserFromSession(ctx.req, ctx.res)
  return {
    props: {
      // returns false if the user.isAuthorized is null or undefined else return user.isAuthorized value
      isAuthorized: user?.isAuthorized ?? false,
      userId: user?.userId ?? ''
    }
  }
}