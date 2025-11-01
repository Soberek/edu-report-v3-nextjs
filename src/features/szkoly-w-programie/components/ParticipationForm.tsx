/**
 * ParticipationForm - Main form for adding new school program participations.
 * Handles form submission and field validation.
 * Keeps component focused on orchestration, delegating layout to FormSection.
 */

import React, { useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import { SchoolProgramParticipationDTO } from '@/models/SchoolProgramParticipation';
import { ParticipationFormFields } from './ParticipationFormFields';
import { FormSection } from './FormSection';
import { FormSubmitButton } from './FormSubmitButton';
import {
  createSchoolOptions,
  createContactOptions,
  createProgramOptions,
  createSchoolYearOptions,
} from '../utils/optionFactories';
import { PAGE_CONSTANTS, SCHOOL_YEAR_OPTIONS, STYLE_CONSTANTS } from '../constants';
import type { ParticipationFormProps } from '../types';

export const ParticipationForm: React.FC<ParticipationFormProps> = ({
  schools,
  contacts,
  programs,
  loading,
  onSubmit,
  formMethods,
  showSubmitButton = true,
}) => {
  const { control, handleSubmit, reset, formState } = formMethods;
  const { isDirty } = formState;

  // Memoize option transformations for performance
  const schoolsOptions = useMemo(() => createSchoolOptions(schools), [schools]);
  const contactsOptions = useMemo(
    () => createContactOptions(contacts),
    [contacts]
  );
  const programsOptions = useMemo(
    () => createProgramOptions(programs),
    [programs]
  );
  const schoolYearsOptions = useMemo(
    () => createSchoolYearOptions(SCHOOL_YEAR_OPTIONS),
    []
  );

  // Handle form submission with error handling
  const handleFormSubmit = useCallback(
    async (data: SchoolProgramParticipationDTO) => {
      try {
        await onSubmit(data);
        reset();
      } catch (error) {
        // Error already handled in parent hook
        throw error;
      }
    },
    [onSubmit, reset]
  );

  return (
    <FormSection title={PAGE_CONSTANTS.FORM_TITLE} sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: STYLE_CONSTANTS.SPACING.MEDIUM,
        }}
      >
        <ParticipationFormFields
          control={control}
          schoolsOptions={schoolsOptions}
          contactsOptions={contactsOptions}
          programsOptions={programsOptions}
          schoolYearsOptions={schoolYearsOptions}
        />

        {showSubmitButton && (
          <FormSubmitButton loading={loading} isDirty={isDirty} />
        )}
      </Box>
    </FormSection>
  );
};
