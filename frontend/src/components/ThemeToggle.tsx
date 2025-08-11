import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'inherit',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg) scale(1.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {isDarkMode ? (
          <LightIcon sx={{ fontSize: 24 }} />
        ) : (
          <DarkIcon sx={{ fontSize: 24 }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
