import { Avatar, Button, Group, Text } from "@mantine/core"
import { NextPage } from "next"
import Head from "next/head"
import React, { useEffect } from "react"
import { useRouter } from "next/router"

import DefaultLayout from "@/view/layout/default"
import { useAuth, useAuthOperation } from "@/auth/useAuth"

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
      <DefaultLayout hideBottomBar={user == null}>
        <main className="relative h-full p-4">
          {user == null ? (
            <div className="fixed inset-0 flex flex-col items-center justify-center px-12">
              <img src="/commet.png" alt="" width={240} height={240} />
              <Button color="brand.3" onClick={login} fullWidth size="md" mt={48}>
                <Text color="black">Googleでログイン</Text>
              </Button>
            </div>
          ) : (
            <>
              <div className="m-4">
                <p>{isLoading ? "loading" : ""}</p>
                <Group>
                  <Avatar src={user?.iconUrl} />
                  <p className="">{user?.name ?? "not logged in"}</p>
                </Group>
              </div>
              {user == null ? (
                <Button onClick={login}>👋 LOGIN with Google</Button>
              ) : (
                <Button onClick={logout}>👋 LOGOUT</Button>
              )}
            </>
          )}
        </main>
      </DefaultLayout>
    </>
  )
}

export default Index
