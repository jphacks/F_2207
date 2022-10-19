export const loadCss = (url: string) => {
  // check if it is already loaded
  if (!Array.from(document.getElementsByTagName("link")).find((l) => l.href == url)) {
    const head = document.getElementsByTagName("head")[0] as HTMLElement
    const link = document.createElement("link")
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("href", url)

    head.appendChild(link)
  }
}
