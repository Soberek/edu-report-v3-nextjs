/**
 * Submit button component for forms.
 * Extracted to reduce duplication and follow SRP.
 */

import React from 'react';
import { Box } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { ActionButton } from '@/components/shared';
import { STYLE_CONSTANTS, BUTTON_LABELS } from '../constants';

export interface FormSubmitButtonProps {
  readonly loading: boolean;
  readonly isDirty: boolean;
}

/**
 * Styled submit button with consistent appearance across forms.
 * Shows loading state and disables when form hasn't changed.
 */
export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  loading,
  isDirty,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      mt: STYLE_CONSTANTS.SPACING.MEDIUM,
      pt: STYLE_CONSTANTS.SPACING.MEDIUM,
      borderTop: '1px solid rgba(0,0,0,0.1)',
    }}
  >
    <ActionButton
      type="submit"
      disabled={loading || !isDirty}
      variant="contained"
      startIcon={<SaveIcon />}
      loading={loading}
      sx={{
        borderRadius: STYLE_CONSTANTS.BORDER_RADIUS.LARGE,
        textTransform: 'none',
        fontWeight: 'bold',
        px: STYLE_CONSTANTS.SPACING.LARGE,
        py: STYLE_CONSTANTS.SPACING.SMALL,
        background: STYLE_CONSTANTS.GRADIENTS.PRIMARY,
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
        '&:hover': {
          background: STYLE_CONSTANTS.GRADIENTS.PRIMARY_HOVER,
          boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          background: 'rgba(0,0,0,0.12)',
          color: 'rgba(0,0,0,0.26)',
        },
      }}
    >
      {BUTTON_LABELS.SAVE_PARTICIPATION}
    </ActionButton>
  </Box>
);
