import { useEffect, useState } from "react";
import Router from "next/router";
import { getAuthenticatedUserFromSession } from "@/utils/passage";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import Link from "next/link";
import { getSupabase } from "@/utils/supabase";

export default function Dashboard({ isAuthorized, userID, journals }: any) {
  useEffect(() => {
    if (!isAuthorized) {
      Router.push("/");
    }
  });

  const signOut = async () => {
    new PassageUser().signOut();
    Router.push("/");
  };

  const handleDelete = async (id: string) => {
    // const supabase: any = getSupabase(userID);

    // await supabase(userID).from("journal").delete().eq("id", id);

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
      <h1>Welcome {userID}! </h1>
      <br></br>

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
      <Link href="/profile"> Profile </Link>
      <br />
      <Link href="/journal/new"> Add a new journal </Link>
      <br />
      <button onClick={signOut}>Sign Out</button>
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
    props: {
      isAuthorized: loginProps?.isAuthorized ?? false,
      userID: loginProps?.userId ?? "",
    },
  };
};
