export const loadScript = (url: string, onload: () => void) => {
  // check if it is already loaded
  if (!Array.from(document.scripts).find((s) => s.src == url)) {
    const head = document.getElementsByTagName("head")[0] as HTMLElement
    const script = document.createElement("script")
    script.setAttribute("type", "text/javascript")
    script.setAttribute("src", url)
    script.addEventListener("load", onload)

    head.appendChild(script)
  }
}
