// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PostgrestError } from "@supabase/supabase-js";
import { getSupabase } from "../../utils/supabase";

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: PostgrestError): void; new(): any; }; }; }) {
  const { userID, title, description, username, journalId } = req.body;
  const supabase:any = getSupabase(userID);
  console.log("" , userID, title, description)
  const { data, error } = await supabase
    .from("journal")
    .update({ title, description, user_name: username, user_id: userID })
    .eq('id', journalId);
  if (error) return res.status(400).json(error);
  res.status(200).json(data);
}
