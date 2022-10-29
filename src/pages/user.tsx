import { Avatar, Button, Group, Text } from "@mantine/core"
import { NextPage } from "next"
import React from "react"
import Image from "next/image"

import DefaultLayout from "@/view/layout/default"
import { useAuth, useAuthOperation } from "@/auth/useAuth"
import MetaHeader from "@/view/common/MetaHeader"

const User: NextPage = () => {
  const { user, isLoading } = useAuth()
  const { login, logout } = useAuthOperation()
  return (
    <>
      <MetaHeader title="マイページ" />
      <DefaultLayout hideBottomBar={user == null}>
        <main className="relative h-full p-4">
          {user == null ? (
            <div className="fixed inset-0 flex flex-col items-center justify-center px-12">
              <Image src="/commet.png" alt="" width={240} height={240} />
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

export default User
