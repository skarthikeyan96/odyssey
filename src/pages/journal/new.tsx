import { getAuthenticatedUserFromSession } from "@/utils/passage";
import { getSupabase } from "@/utils/supabase";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";

const New = ({ isAuthorized, userID, journals }: any) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data1 = await new PassageUser().userInfo();
    console.log(data1);
    const data = new FormData(e.target);
    const title = data.get("title");
    const description = data.get("description");
    const res = await fetch("/api/addJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        userID,
        username: data1?.user_metadata?.username,
      }),
    }).then((res) => res.json());
  };
  return (
    <>
      <p> Add a new journal </p>

      <form onSubmit={handleSubmit} className="flex">
        <label>title</label>

        <input type="text" name="title" className="border p-2" />

        <br />
        <label>description</label>

        <textarea className="border" name="description" rows={4} cols={50} />

        <button>Submit</button>
      </form>
    </>
  );
};

export default New;

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
