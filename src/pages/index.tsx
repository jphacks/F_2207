import { Button, Loader, Text } from "@mantine/core"
import { NextPage } from "next"
import React from "react"
import Image from "next/image"

import DefaultLayout from "@/view/layout/default"
import { useAuth, useAuthOperation } from "@/auth/useAuth"
import MetaHeader from "@/view/common/MetaHeader"
import { useAuthRouter } from "@/auth/useAuthRouter"

const Index: NextPage = () => {
  useAuthRouter(false)
  const { user } = useAuth()
  const { login } = useAuthOperation()

  return (
    <>
      <MetaHeader title="ログイン" />
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
            <div className="fixed inset-0 flex items-center justify-center">
              <Loader aria-label="ロード中" />
            </div>
          )}
        </main>
      </DefaultLayout>
    </>
  )
}

export default Index
