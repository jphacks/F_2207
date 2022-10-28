import React from "react"
import Image from "next/image"
import Link from "next/link"

import { useUser } from "@/auth/useAuth"

import SearchIcon from "./icons/SearchIcon"

const SearchBar: React.FC = () => {
  const user = useUser()

  return (
    <div className="w-full">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        className="w-full rounded-md border-transparent py-4 pl-[48px] pr-[56px] focus:outline-none"
        style={{
          boxShadow: "0px 1px 6px rgba(132, 132, 132, 0.26)",
        }}
        placeholder="カプセルを検索"
      />
      {user != null && (
        <div className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2">
          <Link href="/user">
            <a>
              <Image
                src={user?.iconUrl}
                alt="プロフィール"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default SearchBar
