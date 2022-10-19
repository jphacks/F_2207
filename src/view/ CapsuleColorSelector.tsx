import { CheckIcon, ColorSwatch, SimpleGrid, useMantineTheme } from "@mantine/core"
import { useState } from "react"

const CapsuleColorSelector = () => {
  const theme = useMantineTheme()
  const [checked, setChecked] = useState(theme.colors["brand"][3])
  const targetColors = [
    theme.colors["brand"][3],
    "#9581F2",
    "#F1ABDD",
    "#EB5040",
    "#DE6437",
    "#F8D551",
    "#6BE58B",
    "#73E4E3",
    "#2351D5",
    "#000000",
    "#D3DAE1",
    "#FFFFFF",
  ]

  const isDarkColor = (color: string) => {
    return color == "#2351D5" || color == "#000000"
  }

  const swatches = targetColors.map((color) => (
    <ColorSwatch
      component="button"
      key={color}
      color={color}
      onClick={() => setChecked(color)}
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

export default CapsuleColorSelector
