import formatDistanceToNow from "date-fns/formatDistanceToNow"
import jaLocale from "date-fns/locale/ja"

export const formatDate = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: jaLocale })
}
