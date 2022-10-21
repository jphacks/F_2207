import { Avatar, Button, Group } from "@mantine/core"
import { NextPage } from "next"
import Head from "next/head"
import React from "react"

import DefaultLayout from "@/view/layout/default"
import { useAuth, useAuthOperation } from "@/auth/useAuth"

const User: NextPage = () => {
  const { user, isLoading } = useAuth()
  const { login, logout } = useAuthOperation()
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
              <p className="">{user?.name ?? "not logged in"}</p>
            </Group>
          </div>
          {user == null ? (
            <Button onClick={login}>👋 LOGIN with Google</Button>
          ) : (
            <Button onClick={logout}>👋 LOGOUT</Button>
          )}
        </main>
      </DefaultLayout>
    </>
  )
}

export default User
