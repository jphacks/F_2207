import React from "react"
import { Image, Loader } from "@mantine/core"
import { AiOutlineVideoCamera } from "react-icons/ai"

export type PreviewItemProps = {
  url: string
  isLoading?: boolean
  isVideo?: boolean
}

const PreviewItem: React.FC<PreviewItemProps> = ({ url, isLoading = false, isVideo = false }) => {
  return (
    <div className="relative">
      {isVideo ? (
        <video
          src={url}
          className="aspect-square h-full w-full object-cover"
          muted
          playsInline
          autoPlay
        />
      ) : (
        <Image
          alt=""
          src={url}
          imageProps={{ onLoad: () => URL.revokeObjectURL(url) }}
          styles={{
            figure: {
              width: "100%",
              height: "100%",
            },
            imageWrapper: {
              aspectRatio: "1 / 1",
              width: "100%",
              height: "100%",
            },
          }}
          height="100%"
          width="100%"
        />
      )}
      {isVideo && (
        <div className="absolute top-2 right-2 text-white">
          <AiOutlineVideoCamera />
        </div>
      )}
      {isLoading && (
        <>
          <div className="absolute inset-0 animate-pulse bg-gray-900/50" />
          <Loader
            color="white"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
        </>
      )}
    </div>
  )
}

export default PreviewItem
