import Passage from '@passageidentity/passage-node'

const passage = new Passage({
    appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID as string,
    apiKey: process.env.PASSAGE_API_KEY as string,
});

export const getAuthenticatedUserFromSession = async (req: any, res: any) => {
    try{
        const userId = await passage.authenticateRequest(req)

        if(userId){
            return{
                isAuthorized: true,
                userId: userId
            }
        }
    }catch(error){
        return {
            isAuthorized: false,
            userId: ''
        }
    }
}