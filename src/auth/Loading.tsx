import { Loader } from "@mantine/core"
import React from "react"

import { useAuth } from "./useAuth"

export type LoadingProps = {
  children: React.ReactNode
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0">
        <Loader aria-label="ロード中" />
      </div>
    )
  }

  return <>{children}</>
}

export default Loading
