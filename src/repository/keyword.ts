import axios from "axios"

const GOO_LAB_API = process.env.NEXT_PUBLIC_GOO_LAB_API
const GOO_LAB_APP_ID = process.env.NEXT_PUBLIC_GOO_LAB_APP_ID

type APIResponse = { keywords: Record<string, number>[] }

export const extractKeywords = async (title: string, body: string) => {
  const res = await axios.post<APIResponse>(GOO_LAB_API, {
    app_id: GOO_LAB_APP_ID,
    title,
    body,
    max_num: 5,
  })

  return res.data?.keywords?.map((obj) => Object.keys(obj)[0]) ?? []
}
