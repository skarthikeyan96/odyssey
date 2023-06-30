import { useEffect } from "react";
import Router from "next/router";
import { getAuthenticatedUserFromSession } from "@/utils/passage";
import Link from "next/link";
import { getSupabase } from "@/utils/supabase";

export default function Dashboard({ isAuthorized, userID, journals }: any) {

  useEffect(() => {
    if (!isAuthorized) {
      Router.push("/");
    }
  });

 
  const handleDelete = async (id: string) => {
    const res = await fetch("/api/deleteJournal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, journalId: id }),
      }).then((res) => res.json());
  };

  console.log(journals);

  return (
    <div>
    

      <div className="container mx-auto p-5">
      <h1>Welcome {userID}! </h1>
      </div>
    
     

      

      {journals.map((journal: any) => {
        return (
          <div key={journal.id}>
            <Link href={`journal/${journal.id}`}> {journal.title} </Link>
            <Link href={`journal/edit/${journal.id}`}> Update </Link>
            <button onClick={() => handleDelete(journal.id)}> Delete </button>
          </div>
        );
      })}
      <br />
     
    
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const loginProps = await getAuthenticatedUserFromSession(
    context.req,
    context.res
  );

  if (loginProps?.isAuthorized) {
    const supabase: any = getSupabase(loginProps.userId);
    console.log(loginProps)
    const { data } = await supabase.from("journal").select();
    return {
      props: {
        isAuthorized: loginProps?.isAuthorized ?? false,
        userID: loginProps?.userId ?? "",
        journals: data ?? [],
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/"
    }
   
    // props: {
    //   isAuthorized: loginProps?.isAuthorized ?? false,
    //   userID: loginProps?.userId ?? "",
    // },
  };
};
