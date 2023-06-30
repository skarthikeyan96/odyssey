// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSupabase } from "../../utils/supabase";

export default async function handler(req: any, res: any) {
  const { userID, title, description, username } = req.body;
  const supabase:any = getSupabase(userID);
  console.log("" , userID, title, description)
  const { data, error } = await supabase
    .from("journal")
    .insert({ title, description, user_name: username, user_id: userID })
    .select()
    .single();
  if (error) return res.status(400).json(error);
  res.status(200).json(data);
}
