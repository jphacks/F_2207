import { type TransformRequestFunction } from "mapbox-gl"

const mqplatformTransformRequest = (
  subscriptionKey: string,
  userId: string,
): TransformRequestFunction => {
  return (url: string) => {
    if (
      url.startsWith("mqplatform://maps-api/features/v1/") &&
      url !== `mqplatform://maps-api/features/v1/${userId}`
    ) {
      return { url: "http://example.com" }
    }
    if (url.startsWith("mqplatform://")) {
      return {
        url: `${url.replace(
          "mqplatform://",
          "https://prod-mqplatform-api.azure-api.net/",
        )}?subscription_key=${subscriptionKey}`,
      }
    } else if (url.startsWith("dev-mqplatform://")) {
      return {
        url: `${url.replace(
          "dev-mqplatform://",
          "https://dev-mqp-api-management-developer.azure-api.net/",
        )}?subscription_key=${subscriptionKey}`,
      }
    }
    return { url }
  }
}

export default mqplatformTransformRequest
