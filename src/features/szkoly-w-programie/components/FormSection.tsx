/**
 * Reusable form section component for consistent layout.
 * Extracted to reduce duplication and follow SRP.
 */

import React from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { STYLE_CONSTANTS } from '../constants';

export interface FormSectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly sx?: Record<string, unknown>;
}

/**
 * Wrapper component for form sections with consistent styling.
 * Provides glassmorphic header with fade animation.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  sx = {},
}) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.EXTRA_LARGE,
      background: STYLE_CONSTANTS.COLORS.BACKGROUND_GRADIENT,
      overflow: 'hidden',
      mb: STYLE_CONSTANTS.SPACING.LARGE,
      ...sx,
    }}
  >
    {/* Section Header */}
    <Box
      sx={{
        background: STYLE_CONSTANTS.COLORS.HEADER_BACKGROUND,
        backdropFilter: 'blur(10px)',
        p: STYLE_CONSTANTS.SPACING.MEDIUM,
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: STYLE_CONSTANTS.SPACING.SMALL,
        }}
      >
        <AddIcon sx={{ color: STYLE_CONSTANTS.COLORS.PRIMARY }} />
        {title}
      </Typography>
    </Box>

    {/* Section Content */}
    <Box sx={{ p: STYLE_CONSTANTS.SPACING.LARGE }}>
      <Fade in timeout={300}>
        <div>{children}</div>
      </Fade>
    </Box>
  </Paper>
);
