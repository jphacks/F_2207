import React from "react"

export type CapsuleIconProps = {
  className?: string
}

const CapsuleIcon: React.FC<CapsuleIconProps> = ({ className }) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_587_10831)">
        <path
          d="M12.5 2C6.97768 2 2.5 6.47768 2.5 12C2.5 17.5223 6.97768 22 12.5 22C18.0223 22 22.5 17.5223 22.5 12C22.5 6.47768 18.0223 2 12.5 2ZM12.5 20.3036C7.91518 20.3036 4.19643 16.5848 4.19643 12C4.19643 7.41518 7.91518 3.69643 12.5 3.69643C17.0848 3.69643 20.8036 7.41518 20.8036 12C20.8036 16.5848 17.0848 20.3036 12.5 20.3036Z"
          fill="black"
        />
        <path d="M3.5 12L21.5 12" stroke="black" strokeWidth="4" />
      </g>
      <defs>
        <clipPath id="clip0_587_10831">
          <rect width="24" height="24" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default CapsuleIcon
