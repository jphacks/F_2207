import React from "react"

import BottomBar from "../BottomBar"

export type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="fixed inset-0 flex flex-col">
        <div className="grow">{children}</div>
        <div className="w-full shrink-0">
          <BottomBar />
        </div>
      </div>
    </>
  )
}

export default DefaultLayout
