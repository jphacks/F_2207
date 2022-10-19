import Head from "next/head"
import { Button } from "@mantine/core"

import { useAuth, useAuthOperation } from "@/auth/useAuth"

import type { NextPage } from "next"

const Index: NextPage = () => {
  const { user, isLoading } = useAuth()
  const { login, logout } = useAuthOperation()

  return (
    <>
      <Head>
        <title>Sample Next App</title>
        <meta name="description" content="sample next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4">
        <div className="m-4">
          <p>{isLoading ? "loading" : ""}</p>
          <p className="text-red-400">{user?.displayName ?? "not logged in"}</p>
        </div>
        {user == null ? (
          <Button onClick={login}>👋 LOGIN with Google</Button>
        ) : (
          <Button onClick={logout}>👋 LOGOUT</Button>
        )}
      </main>
    </>
  )
}

export default Index
