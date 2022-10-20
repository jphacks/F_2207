import { Button } from "@mantine/core"
import React, { useState } from "react"
import { NextPage } from "next"

import { useLerp } from "@/lib/useLerp"

const Lerp: NextPage = () => {
  const [value, setValue] = useState(0.0)
  const smoothedValue = useLerp(value)

  return (
    <div className="p-4">
      <div className="my-8">
        <p>Original Value: {value}</p>
        <div className="relative h-6">
          <div className="h-6 bg-green-400" style={{ width: `${value}%` }} />
        </div>
        <p>Smoothed value: {smoothedValue}</p>
        <div className="relative h-6">
          <div className="h-6 bg-green-400" style={{ width: `${smoothedValue}%` }} />
        </div>
      </div>
      <Button fullWidth onClick={() => setValue((value) => value + 10.0)}>
        Click
      </Button>
    </div>
  )
}

export default Lerp
