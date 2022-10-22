import { convertLngLat } from "@/lib/convertLngLat"

test("convertLngLatのユニットテスト", () => {
  expect(convertLngLat(34.97802953993395, "lng")).toBe("34°58'40.9\"N")
  expect(convertLngLat(135.73258717897514, "lat")).toBe("135°43'57.3\"E")
})
