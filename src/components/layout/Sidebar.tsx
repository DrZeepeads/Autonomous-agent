import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  BookOpen, 
  Search, 
  MessageSquare, 
  Plus, 
  Settings, 
  User,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    icon: BookOpen,
    label: 'Library',
    path: '/library',
    description: 'Categorized Nelson textbook resources'
  },
  {
    icon: Search,
    label: 'Explore GPTs',
    path: '/explore',
    description: 'Growth Chart Visualizer, Drug Dosing Calculator'
  },
  {
    icon: MessageSquare,
    label: 'Chats',
    path: '/chats',
    description: 'Saved conversation history'
  },
  {
    icon: Plus,
    label: 'New Chat',
    path: '/chat',
    description: 'Fresh session'
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    description: 'Preferences, theme, export'
  }
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed left-0 top-0 z-50 h-full w-80 bg-background border-r border-border lg:relative lg:translate-x-0"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                      isActive 
                        ? "bg-ai-bubble text-foreground" 
                        : "text-muted-foreground hover:bg-hover-color hover:text-foreground"
                    )}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70 truncate">
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </nav>

            {/* Profile Section */}
            <div className="p-4 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/profile')}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                  location.pathname === '/profile'
                    ? "bg-ai-bubble text-foreground"
                    : "text-muted-foreground hover:bg-hover-color hover:text-foreground"
                )}
              >
                <User className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">Zeeshan Islam</div>
                  <div className="text-xs opacity-70">
                    Healthcare Professional
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

