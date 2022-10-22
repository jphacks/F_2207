import React from "react"

import BottomBar from "../BottomBar"

export type DefaultLayoutProps = {
  children: React.ReactNode
  hideBottomBar?: boolean
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, hideBottomBar = false }) => {
  return (
    <>
      <div className="fixed inset-0 flex flex-col">
        <div className="grow">{children}</div>
        {!hideBottomBar && (
          <div className="w-full shrink-0">
            <BottomBar />
          </div>
        )}
      </div>
    </>
  )
}

export default DefaultLayout
