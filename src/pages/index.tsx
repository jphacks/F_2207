import Head from "next/head"
import { Avatar, Button, Group } from "@mantine/core"
import { useEffect } from "react"
import { useRouter } from "next/router"

import { useAuth, useAuthOperation } from "@/auth/useAuth"
import DefaultLayout from "@/view/layout/default"

import type { NextPage } from "next"

const Index: NextPage = () => {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { login, logout } = useAuthOperation()

  useEffect(() => {
    if (user != null) {
      router.push("/map")
    }
  }, [router, user])

  return (
    <>
      <Head>
        <title>リカプセル</title>
        <meta name="description" content="sample next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <main className="p-4">
          <div className="m-4">
            <p>{isLoading ? "loading" : ""}</p>
            <Group>
              <Avatar src={user?.iconUrl} />
              <p className="text-red-400">{user?.name ?? "not logged in"}</p>
            </Group>
          </div>
          {user == null ? (
            <Button onClick={login}>👋 LOGIN with Google</Button>
          ) : (
            <Button onClick={logout}>👋 LOGOUT</Button>
          )}
        </main>
        {/* <Button component={NextLink} href="/cupsel/create">
          カプセルを作る
        </Button> */}
      </DefaultLayout>
    </>
  )
}

export default Index
