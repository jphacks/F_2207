import React from "react"

import BottomBar from "../BottomBar"

export type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <BottomBar />
    </>
  )
}

export default DefaultLayout
