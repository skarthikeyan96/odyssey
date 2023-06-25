import { getAuthenticatedUserFromSession } from "@/utils/passage"
import { getSupabase } from "@/utils/supabase"
import { PassageUser } from "@passageidentity/passage-elements/passage-user"
import { useRouter } from "next/router"
import { useState } from "react"

const Edit = (props: any) => {
    console.log(props)
    const {userID} = props;

    const router = useRouter()

    const [title, setTitle] = useState(props.journal[0].title)
    const [description, setDescription] = useState(props.journal[0].description)

    const handleSubmit = async (e: any) => {
        const user = await new PassageUser().userInfo();
        const res = await fetch("/api/updateJournal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            userID,
            username: user?.user_metadata?.username,
            journalId: router.query.id
          }),
        }).then((res) => res.json());
      };
    return (
        <> 
        
        <div  className="flex">
        <label>title</label>

        <input type="text" name="title" className="border p-2" value={title} onChange={(e) => setTitle(e.target.value)}/>

        <br />
        <label>description</label>

        <textarea className="border" name="description" rows={4} cols={50} value={description} onChange={(e) => setDescription(e.target.value)}/>

        <button onClick={handleSubmit}>Submit</button>
      </div>

        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const loginProps = await getAuthenticatedUserFromSession(
        context.req,
        context.res
      );
    
      if (loginProps?.isAuthorized) {
        const supabase: any = getSupabase(loginProps.userId);
        const { data } = await supabase.from("journal").select().eq('id', context.query.id);
        console.log(data)
        return {
          props: {
            isAuthorized: loginProps?.isAuthorized ?? false,
            userID: loginProps?.userId ?? "",
            journal: data ?? [],
          },
        };
      }
      return {
        props: {
          isAuthorized: loginProps?.isAuthorized ?? false,
          userID: loginProps?.userId ?? "",
        },
      };
}


export default Edit