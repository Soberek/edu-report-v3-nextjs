import type { Contact, Program, School } from "@/types";
import { SchoolProgramParticipation } from "@/models/SchoolProgramParticipation";
import { Box, Typography, Paper } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import EditDialog from "./edit-dialog";
import { createColumns, CUSTOM_STYLES } from "./TableConfig";
import { LoadingSpinner, EmptyState, DataTable, defaultActions } from "@/components/shared";
import { useState } from "react";

interface SchoolProgramParticipationTableProps {
  schoolsMap: Record<string, School>;
  contactsMap: Record<string, Contact>;
  programsMap: Record<string, Program>;
  participations: SchoolProgramParticipation[];
  errorMessage: string | null;
  loading: boolean;
  schools: School[];
  contacts: Contact[];
  programs: Program[];
  onUpdate: (id: string, data: Partial<SchoolProgramParticipation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SchoolProgramParticipationTable: React.FC<SchoolProgramParticipationTableProps> = ({
  schoolsMap,
  contactsMap,
  programsMap,
  participations,
  errorMessage,
  loading,
  schools,
  contacts,
  programs,
  onUpdate,
  onDelete,
}) => {
  const [editingParticipation, setEditingParticipation] = useState<SchoolProgramParticipation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditParticipation = (participation: SchoolProgramParticipation) => {
    setEditingParticipation(participation);
    setEditDialogOpen(true);
  };

  const handleSaveParticipation = async (id: string, data: Partial<SchoolProgramParticipation>) => {
    await onUpdate(id, data);
    setEditDialogOpen(false);
    setEditingParticipation(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingParticipation(null);
  };

  const handleDeleteParticipation = async (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć to uczestnictwo?")) {
      await onDelete(id);
    }
  };

  const mappedParticipations =
    participations?.map((participation) => {
      const { id, schoolId, programId, coordinatorId } = participation;
      const school = schoolsMap[schoolId];
      const program = programsMap[programId];
      const coordinator = contactsMap[coordinatorId];

      return {
        ...participation,
        schoolName: school?.name || "N/A",
        programName: program?.name || "N/A",
        coordinatorName: coordinator ? `${coordinator.firstName} ${coordinator.lastName}` : "N/A",
      };
    }) || [];

  const columns = createColumns();

  const actions = [
    defaultActions.edit((id: string) => {
      const participation = participations.find((p) => p.id === id);
      if (participation) {
        handleEditParticipation(participation);
      }
    }),
    defaultActions.delete(handleDeleteParticipation),
  ];

  if (errorMessage) {
    return <EmptyState title="Błąd ładowania danych" description={errorMessage} sx={{ mb: 3 }} />;
  }

  if (loading) {
    return <LoadingSpinner size={48} message="Ładowanie danych..." sx={{ minHeight: 200 }} />;
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SchoolIcon sx={{ color: "#1976d2" }} />
            Lista uczestnictwa ({mappedParticipations.length})
          </Typography>
        </Box>

        <Box sx={{ p: 2, background: "transparent" }}>
          {mappedParticipations.length === 0 ? (
            <EmptyState title="Brak danych" description="Dodaj pierwsze uczestnictwo szkoły w programie" />
          ) : (
            <DataTable
              data={mappedParticipations}
              columns={columns}
              actions={actions}
              loading={loading}
              height={600}
              pageSizeOptions={[5, 10, 25]}
              getRowId={(row) => row.id}
              sx={{
                background: "white",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                ...CUSTOM_STYLES,
              }}
            />
          )}
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        participation={editingParticipation}
        schools={schools}
        contacts={contacts}
        programs={programs}
        onClose={handleCloseEditDialog}
        onSave={handleSaveParticipation}
        loading={loading}
      />
    </>
  );
};
