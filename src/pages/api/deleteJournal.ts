// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PostgrestError } from "@supabase/supabase-js";
import { getSupabase } from "../../utils/supabase";

export default async function handler(req: any, res: any) {
  const { userID, journalId} = req.body;
  const supabase:any = getSupabase(userID);
  const { data, error } = await supabase
    .from("journal")
    .delete()
    .eq("id", journalId);
  if (error) return res.status(400).json(error);
  res.status(200).json(data);
}
