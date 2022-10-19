import { Box, SimpleGrid } from "@mantine/core"
import { useState } from "react"

type ColorSelectorProps = {
  colors: string[]
  onSelect: (color: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, onSelect }) => {
  const [checked, setChecked] = useState(colors[0])

  const swatches = colors.map((color) => {
    const isChecked = color === checked
    return (
      <Box
        key={color}
        component="button"
        className="relative transition"
        sx={{
          padding: isChecked ? 3 : 0,
          border: isChecked ? "3px solid white" : "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "transparent",

          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Box
          sx={{
            background: color,
            borderRadius: "50%",
            border: "none",
            width: "100%",
            height: "100%",
          }}
          onClick={() => {
            setChecked(color)
            onSelect(color)
          }}
        />
      </Box>
    )
  })

  return (
    <SimpleGrid className="p-4" cols={6} spacing="xs" verticalSpacing="sm">
      {swatches}
    </SimpleGrid>
  )
}

export default ColorSelector
