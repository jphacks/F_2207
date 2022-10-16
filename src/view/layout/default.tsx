import React from "react"

export type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <>{children}</>
}

export default DefaultLayout
