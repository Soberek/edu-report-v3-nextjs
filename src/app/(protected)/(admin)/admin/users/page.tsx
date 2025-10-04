"use client";

import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box, Button, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useUser } from "@/hooks/useUser";
import { useAdminUsers, type AdminUser } from "@/hooks/useAdminUsers";
import { EnhancedUserTable } from "./components/EnhancedUserTable";
import { CreateUserDialog } from "./components/CreateUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { ResetPasswordDialog } from "./components/ResetPasswordDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function AdminUsersPage() {
  const { userData, loading: userLoading } = useUser();
  const { listUsers, createUser, updateUser, deleteUser, generatePassword, resetPassword, loading: apiLoading } = useAdminUsers();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected user states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Snackbar states
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const fetchedUsers = await listUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      showSnackbar("Nie udało się pobrać listy użytkowników", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Create user handlers
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateUser = async (data: { email: string; password: string; displayName: string; role: string }) => {
    try {
      await createUser(data);
      await fetchUsers();
      showSnackbar("Użytkownik utworzony pomyślnie", "success");
    } catch (error) {
      throw error; // Let dialog handle the error
    }
  };

  // Edit user handlers
  const handleOpenEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedUser(null);
    setEditDialogOpen(false);
  };

  const handleUpdateUser = async (uid: string, updates: Partial<AdminUser>): Promise<void> => {
    try {
      await updateUser(uid, updates);
      await fetchUsers();
      showSnackbar("Użytkownik zaktualizowany pomyślnie", "success");
    } catch (error) {
      throw error; // Let dialog handle the error
    }
  };

  // Reset password handlers
  const handleOpenResetPasswordDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleCloseResetPasswordDialog = () => {
    setSelectedUser(null);
    setResetPasswordDialogOpen(false);
  };

  const handleResetPassword = async (uid: string, password: string) => {
    return await resetPassword(uid, password);
  };

  // Delete user handlers
  const handleOpenDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedUser(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.uid);
      await fetchUsers();
      handleCloseDeleteDialog();
      showSnackbar("Użytkownik usunięty pomyślnie", "success");
    } catch (error) {
      showSnackbar("Nie udało się usunąć użytkownika", "error");
    }
  };

  if (userLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!userData || userData.role !== "admin") {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Brak dostępu. Ta strona jest dostępna tylko dla administratorów.</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Zarządzanie użytkownikami
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pełna kontrola nad użytkownikami systemu z wykorzystaniem Firebase Admin SDK
            </Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} size="large">
            Dodaj użytkownika
          </Button>
        </Box>

        {loadingUsers ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={48} />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Znaleziono {users.length} użytkowników
            </Typography>
            <EnhancedUserTable
              users={users}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              onResetPassword={handleOpenResetPasswordDialog}
            />
          </>
        )}
      </Container>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreateUser}
        onGeneratePassword={generatePassword}
        loading={apiLoading}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        user={selectedUser}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateUser}
        loading={apiLoading}
      />

      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        user={selectedUser}
        onClose={handleCloseResetPasswordDialog}
        onReset={handleResetPassword}
        onGeneratePassword={generatePassword}
        loading={apiLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteUser}
        title="Usuń użytkownika"
        message={
          selectedUser
            ? `Czy na pewno chcesz usunąć użytkownika ${selectedUser.displayName || selectedUser.email}? Ta operacja jest nieodwracalna.`
            : ""
        }
        type="delete"
        loading={apiLoading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
