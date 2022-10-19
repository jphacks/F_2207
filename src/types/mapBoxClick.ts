export type MapBoxClick = mapboxgl.MapMouseEvent & {
  features?: mapboxgl.MapboxGeoJSONFeature[] | undefined
} & mapboxgl.EventData
