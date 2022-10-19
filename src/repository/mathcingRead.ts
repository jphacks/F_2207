import { AppUser } from "@/types/user"

import { getItem, setItem } from "./datasource/localStorage"

const READ_MATCHING_IDS = "READ_MATCHING_IDS"

export const makeMatchingRead = ({ user, matchingId }: { user: AppUser; matchingId: string }) => {
  let value = (getItem(READ_MATCHING_IDS) ?? {}) as Record<string, string[]>
  if (value == null) {
    value = { [user.id]: [matchingId] }
  } else if (value[user.id] != null && Array.isArray(value[user.id])) {
    value[user.id].push(matchingId)
  } else {
    value[user.id] = [matchingId]
  }
  setItem(READ_MATCHING_IDS, value)
}

export const isMatchingAlreadyRead = ({
  user,
  matchingId,
}: {
  user: AppUser
  matchingId: string
}) => {
  const value = (getItem(READ_MATCHING_IDS) ?? {}) as Record<string, string[]>
  if (value == null || value[user.id] == null || !Array.isArray(value[user.id])) {
    return false
  }

  return value[user.id].includes(matchingId)
}
