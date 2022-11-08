import classNames from "classnames"
import React, { useMemo } from "react"
import { Text, UnstyledButton } from "@mantine/core"

import { Capsule } from "@/types/capsule"
import { formatDate } from "@/lib/date"

import CapsuleComponent from "./Capsule"

const FILTER_OPTIONS = [
  {
    value: "all" as const,
    label: "すべて",
  },
  {
    value: "openable" as const,
    label: "未開封",
  },
  {
    value: "opened" as const,
    label: "開封済み",
  },
]

type FilterOption = typeof FILTER_OPTIONS[number]["value"]

export type SerachResultProps = {
  capsules: Capsule[]
  className?: string
  onClickCapsule: (capsuleId: string) => void
  filterOption: FilterOption
  onChangeFilterOption: (option: FilterOption) => void
}

const SearchResult: React.FC<SerachResultProps> = ({
  capsules,
  onClickCapsule,
  className,
  filterOption,
  onChangeFilterOption,
}) => {
  const filteredCapsules = useMemo(() => {
    if (filterOption === "all") {
      return capsules
    } else if (filterOption === "openable") {
      return capsules.filter((capsule) => capsule.userOpenDate == null)
    } else {
      return capsules.filter((capsule) => capsule.userOpenDate != null)
    }
  }, [capsules, filterOption])

  return (
    <section
      className={classNames(
        "flex w-full flex-col items-center space-y-6 overflow-y-scroll bg-bgcolor px-4 pb-10 pt-[100px]",
        className,
      )}
    >
      <div className="flex w-full items-center space-x-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChangeFilterOption(option.value)}
            className={classNames(
              "rounded-full border-2 border-solid bg-bgcolor px-4 py-1 text-sm font-bold",
              option.value === filterOption
                ? "border-primary text-primary"
                : "border-gray-500 text-gray-500",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {filteredCapsules.map((capsule) => (
        <UnstyledButton
          key={capsule.id}
          onClick={() => onClickCapsule(capsule.id)}
          className="flex w-full items-center space-x-4"
        >
          <CapsuleComponent
            capsuleColor={capsule.color}
            gpsColor={capsule.gpsTextColor}
            emoji={capsule.emoji}
            size="xs"
            lng={capsule.longitude}
            lat={capsule.latitude}
          />
          <div className="flex flex-col justify-center">
            <Text size={18} color="white">
              {capsule.title}
            </Text>
            {/* TODO: replace dummy date */}
            <Text size={14}>京都府京都市吉田本町付近・{formatDate(capsule.addDate)}</Text>
          </div>
        </UnstyledButton>
      ))}
      {filteredCapsules.length === 0 && (
        <div className="py-10 text-sm">該当するタイムカプセルはありません</div>
      )}
    </section>
  )
}

export default SearchResult
