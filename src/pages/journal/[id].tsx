import { useRouter } from "next/router"

const Journal = () => {
    const router = useRouter()

    return (
        <> {router.query.id }</>
    )
}

export default Journal