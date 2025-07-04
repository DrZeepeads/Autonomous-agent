import { Menu, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-background">
      {/* Left: Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="text-foreground hover:bg-hover-color lg:hidden"
      >
        <Menu className="w-6 h-6" />
      </Button>
      
      {/* Center: Title */}
      <div className="flex-1 text-center lg:text-left lg:ml-4">
        <h1 className="text-xl font-bold text-foreground">
          Nelson-GPT
        </h1>
      </div>
      
      {/* Right: Options Button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-hover-color"
      >
        <MoreVertical className="w-5 h-5" />
      </Button>
    </header>
  )
}

