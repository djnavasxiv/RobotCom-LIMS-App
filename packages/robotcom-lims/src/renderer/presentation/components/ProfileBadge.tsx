import React from 'react';
import { Box, Avatar } from '@mui/material';
import { useAuthStore } from '../../application/state/authStore';

/**
 * ProfileBadge Component
 * Displays the currently logged-in user's profile in the top-right corner
 * Shows user initials and lab name
 */
const ProfileBadge: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color based on user ID (consistent across sessions)
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const userId = user.id || user.username || 'user';
  const userColor = colors[userId.charCodeAt(0) % colors.length];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        borderRadius: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          backgroundColor: userColor,
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
      >
        {getInitials(user.email || 'User')}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Box sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#333' }}>
          {user.email?.split('@')[0] || 'User'}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileBadge;
