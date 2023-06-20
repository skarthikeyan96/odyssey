import { useEffect } from 'react';
import Router from 'next/router';
import { getAuthenticatedUserFromSession } from '@/utils/passage'
import { PassageUser } from '@passageidentity/passage-elements/passage-user'

export default function Dashboard({isAuthorized, userID}: any) {
    useEffect(() => {
      if(!isAuthorized){
        Router.push('/');
      }
    })
    
    const signOut = async ()=>{
        new PassageUser().signOut()
        Router.push('/')
    }
    
    return (
      <div>
        <h1>
          Welcome {userID}!{' '}
        </h1>
        <br></br>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

export const getServerSideProps = async (context: any) => {
    const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)

    return {
        props: {
          isAuthorized: loginProps?.isAuthorized?? false,
          userID: loginProps?.userId?? '',
        },
      }
}
