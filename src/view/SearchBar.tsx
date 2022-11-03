import React from "react"
import Image from "next/image"
import Link from "next/link"
import { FiChevronLeft } from "react-icons/fi"

import { useUser } from "@/auth/useAuth"

import SearchIcon from "./icons/SearchIcon"

export type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onClickBack?: () => void
  showProfileIcon?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClickBack,
  onFocus,
  showProfileIcon = false,
}) => {
  const user = useUser()

  return (
    <div className="w-full shadow-main">
      {onClickBack != null ? (
        <button
          onClick={onClickBack}
          className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center justify-center border-none bg-transparent p-2 text-gray-500"
        >
          <FiChevronLeft size={24} />
        </button>
      ) : (
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-transparent py-3 pl-[48px] pr-[56px] focus:outline-none"
        placeholder="カプセルを検索"
        onFocus={onFocus}
      />
      {user != null && showProfileIcon && (
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
