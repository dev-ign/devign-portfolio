import React from 'react';
import { Box, Typography } from '@mui/material';

interface RoleChipRowProps {
  roles: string[];
}

const RoleChipRow: React.FC<RoleChipRowProps> = ({ roles }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '7px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}
    >
      {roles.map((role) => (
        <Box
          key={role}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '5px 11px',
          }}
        >
          <Box
            sx={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-active)',
              flexShrink: 0,
              transition: 'background-color 0.4s ease',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.04em',
              color: 'var(--dim)',
            }}
          >
            {role}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RoleChipRow;
