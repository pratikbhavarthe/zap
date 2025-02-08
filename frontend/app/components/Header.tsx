import type React from "react"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

interface HeaderProps {
  onClearCache: () => void
}

export const Header: React.FC<HeaderProps> = ({ onClearCache }) => (
  <div className="fixed top-0 right-0 p-4 flex items-center space-x-4 z-50">
    {process.env.NODE_ENV === "development" && (
      <InteractiveHoverButton onClick={onClearCache}>Clear Cache</InteractiveHoverButton>
    )}
    <p className="text-sm text-gray-500">
      <span className="font-semibold">Better Alt</span> of <span className="text-blue-500">Snapdrop.net</span>
    </p>
  </div>
)

