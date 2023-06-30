import { NextApiRequest, NextApiResponse } from "next";
import {Client} from '@notionhq/client'
import {NotionToMarkdown} from "notion-to-md";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
      })
      const n2m = new NotionToMarkdown({ notionClient: notion });

      const pageId = req.body.pageId;
    
      const mdblocks = await n2m.pageToMarkdown(pageId);
      const mdString = n2m.toMarkdownString(mdblocks);
      console.log(mdString.parent);

    res.status(200).json({data: mdString.parent})
}