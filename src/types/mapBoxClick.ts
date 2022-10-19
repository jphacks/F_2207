export type mapBoxClick = mapboxgl.MapMouseEvent & {
  features?: mapboxgl.MapboxGeoJSONFeature[] | undefined
} & mapboxgl.EventData
