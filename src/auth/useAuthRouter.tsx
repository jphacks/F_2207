import { useRouter } from "next/router"

import { useAuth } from "./useAuth"

export const useAuthRouter = (requireAuth: boolean) => {
  const router = useRouter()
  const { isLoading, user } = useAuth()

  if (requireAuth && !isLoading && user == null) {
    router.push("/")
  }
  if (!requireAuth && !isLoading && user != null) {
    router.replace("/map")
  }
}
