import { motion } from 'framer-motion'
import { Mail, Shield, Info, LogOut, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useChatStore } from '@/stores/chatStore'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'

export default function Profile() {
  const { user, profile, signOut } = useAuth()
  const { chats, loadChats } = useChatStore()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    lastActive: 'Today'
  })

  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user, loadChats])

  useEffect(() => {
    // Calculate usage statistics
    const totalMessages = chats.reduce((total, chat) => total + chat.messages.length, 0)
    setStats({
      totalChats: chats.length,
      totalMessages,
      lastActive: chats.length > 0 ? 'Today' : 'Never'
    })
  }, [chats])

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to sign out. Please try again.',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Signed Out',
          description: 'You have been successfully signed out.'
        })
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Mock data for display when not authenticated
  const displayUser = {
    name: profile?.full_name || user?.email || 'Zeeshan Islam',
    email: user?.email || 'zeeshan@example.com',
    avatar: profile?.avatar_url || '',
    role: 'Healthcare Professional',
    joinDate: profile?.created_at 
      ? new Date(profile.created_at).toLocaleDateString()
      : 'December 2024',
    totalChats: stats.totalChats || 47,
    favoriteTopics: ['Cardiology', 'Neonatology', 'Infectious Diseases']
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback className="bg-muted text-lg">
                    {displayUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{displayUser.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{displayUser.email}</span>
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{displayUser.role}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Member since {displayUser.joinDate}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Usage Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                Your activity and engagement with Nelson-GPT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {displayUser.totalChats}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Conversations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stats.totalMessages}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Messages Exchanged
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {displayUser.favoriteTopics.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Favorite Topics
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Favorite Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Favorite Medical Topics</CardTitle>
              <CardDescription>
                Areas you frequently ask about
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayUser.favoriteTopics.map((topic, index) => (
                  <Badge key={index} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Privacy & Security</div>
                    <div className="text-sm text-muted-foreground">
                      Manage your privacy settings and data
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">App Information</div>
                    <div className="text-sm text-muted-foreground">
                      Version 1.0.0 • Privacy Policy • Terms of Service
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sign Out</div>
                  <div className="text-sm text-muted-foreground">
                    Sign out of your Nelson-GPT account
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleSignOut}
                  disabled={!user}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
