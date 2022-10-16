import OuterLink, { OuterLinkProps } from "./OuterLink"

export type TwitterShareButtonProps = Omit<OuterLinkProps, "href"> & {
  text?: string
  url?: string
  hashtags?: string[]
}

const TwitterShareButton: React.FC<TwitterShareButtonProps> = ({
  text,
  url,
  hashtags,
  ...props
}) => {
  return (
    <OuterLink
      href={`https://twitter.com/share?ref_src=twsrc%5Etfw&text=${encodeURIComponent(
        text ?? "",
      )}&url=${encodeURIComponent(url ?? "")}${
        hashtags == null ? "" : `&hashtags=${encodeURIComponent(hashtags.join(","))}`
      }`}
      suppressHydrationWarning
      {...props}
    >
      シェア
    </OuterLink>
  )
}

export default TwitterShareButton
