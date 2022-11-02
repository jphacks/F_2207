const serviceWorkerVersion = "1.0.0"
const cacheName = `Recapsule-v${serviceWorkerVersion}`

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
}

self.addEventListener("install", function (evt) {
  console.log(`[Service Worker] Installing... cacheName: ${cacheName}`)
})

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable()
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload())
  event.waitUntil(() => caches.delete(cacheName))
})

const getResponse = async (evt, useCache, cacheSeconds) => {
  const request = evt.request

  if (useCache) {
    const preloadResponsePromise = evt.preloadResponse
    const responseFromCache = await caches.match(request)
    if (responseFromCache) {
      return responseFromCache
    }

    const preloadResponse = await preloadResponsePromise
    if (preloadResponse) {
      putInCache(request, preloadResponse.clone())
      return preloadResponse
    }
  }

  try {
    const responseFromNetwork = await fetch(request)
    if (useCache) {
      const clonedResponse = responseFromNetwork.clone()
      if (cacheSeconds) {
        const expiredAt = new Date()
        expiredAt.setSeconds(expiredAt.getSeconds() + cacheSeconds)

        const newHeaders = new Headers(clonedResponse.headers)
        newHeaders.append("sw-expires-at", expiredAt.toISOString())

        putInCache(
          request,
          new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: newHeaders,
          }),
        )
      } else {
        putInCache(request, clonedResponse)
      }
    }
    return responseFromNetwork
  } catch (error) {
    console.log("sw: error", error)
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

self.addEventListener("fetch", async (evt) => {
  const request = evt.request
  const isLayersApi = request.url.startsWith(
    "https://prod-mqplatform-api.azure-api.net/maps-api/layers/v1/18?subscription_key=",
  )
  const isStatic = request.url.startsWith("https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap")

  if (request.url.startsWith("mqplatform://")) {
    evt.respondWith(
      new Response("error", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      }),
    )
    return
  }

  const response = getResponse(evt, isLayersApi || isStatic, isStatic ? null : 60 * 2)

  evt.respondWith(response)
})
