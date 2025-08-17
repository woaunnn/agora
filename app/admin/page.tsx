'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Box,
  Button
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { ClientAuthService, User } from '../../lib/auth/client-auth'

const AdminPanel = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  // Mock users data
  const mockUsers = [
    { id: '1', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin' as const },
    { id: '2', email: 'user@example.com', firstName: 'Test', lastName: 'User', role: 'user' as const },
    { id: '3', email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'user' as const },
  ]

  useEffect(() => {
    const authState = ClientAuthService.getCurrentUser()
    if (!authState.isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/admin')
      return
    }
    
    if (authState.user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    setUser(authState.user)
  }, [router])

  const handleGoBack = () => {
    router.push('/dashboard')
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">
          กำลังตรวจสอบสิทธิ์...
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          กลับ Dashboard
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Panel
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary">
          ยินดีต้อนรับ {user.firstName} {user.lastName} (ผู้ดูแลระบบ)
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          จัดการผู้ใช้งาน
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่อ</TableCell>
                <TableCell>อีเมล</TableCell>
                <TableCell>สิทธิ์</TableCell>
                <TableCell>การจัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers.map((mockUser) => (
                <TableRow key={mockUser.id}>
                  <TableCell>{mockUser.id}</TableCell>
                  <TableCell>{mockUser.firstName} {mockUser.lastName}</TableCell>
                  <TableCell>{mockUser.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={mockUser.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'} 
                      color={mockUser.role === 'admin' ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      แก้ไข
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default AdminPanel
