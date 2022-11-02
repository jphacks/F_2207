import { Searcher } from "fast-fuzzy"
import { useMemo } from "react"

import { Capsule } from "@/types/capsule"

export const useCapsuleFuzzySearch = (items: Capsule[], query: string) => {
  const searcher = useMemo(
    () =>
      new Searcher(items, {
        keySelector: (capsule) => [capsule.emoji, capsule.title],
        threshold: 0.1,
      }),
    [items],
  )

  const res = useMemo(() => {
    if (query.length === 0) {
      return items
    }

    if (query.startsWith("tag:")) {
      const keyword = query.slice("tag:".length)
      return items.filter((item) => item.keywords?.includes(keyword) ?? false)
    }

    return searcher.search(query)
  }, [items, query, searcher])

  return res
}
