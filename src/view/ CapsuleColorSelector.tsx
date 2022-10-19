import { CheckIcon, ColorSwatch, SimpleGrid, useMantineTheme } from "@mantine/core"
import { useState } from "react"

type ColorSelectorProps = {
  colors: string[]
  onSelect: (color: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, onSelect }) => {
  const theme = useMantineTheme()
  const [checked, setChecked] = useState(colors[0])

  const isDarkColor = (color: string) => {
    return color == "#2351D5" || color == "#000000"
  }

  const swatches = colors.map((color) => (
    <ColorSwatch
      component="button"
      key={color}
      color={color}
      onClick={() => {
        setChecked(color)
        onSelect(color)
      }}
      sx={{ color: isDarkColor(color) ? "#fff" : "#000000", cursor: "pointer" }}
      size={40}
    >
      {checked == color && <CheckIcon width={10} />}
    </ColorSwatch>
  ))

  return (
    <SimpleGrid className="p-4" cols={6} spacing="xs" verticalSpacing="sm">
      {swatches}
    </SimpleGrid>
  )
}

export default ColorSelector
