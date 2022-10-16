export type OuterLinkProps = Omit<React.ComponentProps<"a">, "target" | "rel">

const OuterLink: React.FC<OuterLinkProps> = (props) => {
  return <a {...props} target="_blank" rel="noopener noreferrer" />
}

export default OuterLink
