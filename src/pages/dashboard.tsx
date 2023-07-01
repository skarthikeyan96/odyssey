import { useEffect } from "react";
import Router from "next/router";
import { getAuthenticatedUserFromSession } from "@/utils/passage";
import Link from "next/link";
import { getSupabase } from "@/utils/supabase";
import Navbar from "@/components/navbar";

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


  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-5">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Journal Name</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {journals.map((journal: any) => {
              return (
                <tr key={journal.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                    <Link href={`journal/${journal.id}`}>
                      {journal.title}
                    </Link>
                  </th>
                  <td className="px-6 py-4 flex space-x-4 text-white">
                    <Link href={`journal/edit/${journal.id}`}> Update </Link>
                    <button onClick={() => handleDelete(journal.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    console.log(loginProps);
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
      destination: "/",
    },
  };
};
