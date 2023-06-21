import { useEffect, useState } from 'react';
import Router from 'next/router';
import { getAuthenticatedUserFromSession } from '@/utils/passage'
import { PassageUser } from '@passageidentity/passage-elements/passage-user'
import Link from 'next/link';
import { getSupabase } from '@/utils/supabase';

export default function Dashboard({isAuthorized, userID,journals }: any) {
    useEffect(() => {
      if(!isAuthorized){
        Router.push('/');
      }
    })

    const signOut = async ()=>{
        new PassageUser().signOut()
        Router.push('/')
    }
    
   console.log(journals)

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data1 = await new PassageUser().userInfo();
        console.log(data1)
        const data = new FormData(e.target);
        const title = data.get("title");
        const description = data.get('description')
        const res = await fetch("/api/addJournal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, userID, username: data1?.user_metadata?.username }),
        }).then((res) => res.json());
       
      };

      
    return (
      <div>
        <h1>
          Welcome {userID}!{' '}
        </h1>
        <br></br>
        <Link href="/profile"> Profile </Link>
        <button onClick={signOut}>Sign Out</button>


        <form onSubmit={handleSubmit}>
          <label>
            Todo: <input type="text" name="title" />
            <input type="text" name="description" />
          </label>
          <button>Submit</button>
        </form>
      </div>
    )
  }

export const getServerSideProps = async (context: any) => {
    const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)


    if(loginProps?.isAuthorized){
        const supabase: any = getSupabase(loginProps.userId)
        const {data} = await supabase.from('journal').select()
        return {
            props: {
              isAuthorized: loginProps?.isAuthorized?? false,
              userID: loginProps?.userId?? '',
              journals: data?? []
            },
          }
    }   
    return {
        props: {
          isAuthorized: loginProps?.isAuthorized?? false,
          userID: loginProps?.userId?? '',
        },
      }
}
