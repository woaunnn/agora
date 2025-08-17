'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import { Person, ExitToApp, AdminPanelSettings } from '@mui/icons-material'

import { ClientAuthService, User } from '../../lib/auth/client-auth'

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    const authState = ClientAuthService.getCurrentUser()
    if (authState.isAuthenticated) {
      setUser(authState.user)
    } else {
      router.push('/auth/signin')
    }
  }, [router])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    ClientAuthService.signOut()
    router.push('/auth/signin')
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          กำลังโหลด...
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ cursor: 'pointer', bgcolor: 'primary.main' }}
            onClick={handleMenuOpen}
          >
            <Person />
          </Avatar>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2">
                {user.firstName} {user.lastName}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} fontSize="small" />
              ออกจากระบบ
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* User Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ข้อมูลผู้ใช้
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>ชื่อ:</strong> {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>อีเมล:</strong> {user.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>สิทธิ์:</strong> 
            <Box component="span" sx={{ 
              ml: 1,
              px: 1,
              py: 0.5,
              bgcolor: user.role === 'admin' ? 'error.light' : 'success.light',
              color: 'white',
              borderRadius: 1,
              fontSize: '0.8rem'
            }}>
              {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
            </Box>
          </Typography>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        {user.role === 'admin' && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              จัดการระบบและผู้ใช้งาน
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }}>
              เข้าสู่ Admin Panel
            </Button>
          </Paper>
        )}
        
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            โปรไฟล์
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            แก้ไขข้อมูลส่วนตัว
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            แก้ไขโปรไฟล์
          </Button>
        </Paper>
      </Box>

      {/* Quick Links */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link href="/auth/signin" passHref>
          <Button variant="outlined" color="primary">
            หน้าเข้าสู่ระบบ
          </Button>
        </Link>
        
        <Link href="/auth/signup" passHref>
          <Button variant="outlined" color="primary">
            หน้าสมัครสมาชิก
          </Button>
        </Link>
        
        <Button variant="contained" color="error" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Box>
    </Container>
  )
}

export default Dashboard