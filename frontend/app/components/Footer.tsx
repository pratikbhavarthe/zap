import type React from "react"

interface FooterProps {
  displayName: string | null
}

export const Footer: React.FC<FooterProps> = ({ displayName }) => (
  <div className="absolute bottom-4 pb-4 text-center text-gray-600 text-sm z-50">
    <h3 className="text-base font-medium">
      You are discoverable as <span className="font-semibold">{displayName}</span>
    </h3>
    <p className="mt-2 text-blue-500">You can be discovered by everyone on this network</p>
  </div>
)

