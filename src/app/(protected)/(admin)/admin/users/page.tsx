"use client";
import { useEffect, useReducer } from "react";
import { getAllUsers, updateUser, deleteUser } from "@/services/userService";
import { useUser } from "@/hooks/useUser";
import type { UserData } from "@/types/user";
import { Container, Typography, CircularProgress, Box, Button, TextField, MenuItem } from "@mui/material";
import { UserTable } from "@/components/shared/UserTable";
import { EditDialog } from "@/components/shared/EditDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

type State = {
  users: UserData[];
  loading: boolean;
  editUser: UserData | null;
  editLoading: boolean;
  deleteUserObj: UserData | null;
  deleteLoading: boolean;
  passwordDialogOpen: boolean;
  passwordUser: UserData | null;
  passwordLoading: boolean;
  generatedPassword: string | null;
};

const initialState: State = {
  users: [],
  loading: true,
  editUser: null,
  editLoading: false,
  deleteUserObj: null,
  deleteLoading: false,
  passwordDialogOpen: false,
  passwordUser: null,
  passwordLoading: false,
  generatedPassword: null,
};

type Action =
  | { type: "SET_USERS"; users: UserData[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "EDIT_USER"; user: UserData }
  | { type: "CLOSE_EDIT" }
  | { type: "SET_EDIT_LOADING"; loading: boolean }
  | { type: "DELETE_USER"; user: UserData }
  | { type: "CLOSE_DELETE" }
  | { type: "SET_DELETE_LOADING"; loading: boolean }
  | { type: "OPEN_PASSWORD_DIALOG"; user: UserData }
  | { type: "CLOSE_PASSWORD_DIALOG" }
  | { type: "SET_PASSWORD_LOADING"; loading: boolean }
  | { type: "SET_GENERATED_PASSWORD"; password: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.users };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "EDIT_USER":
      return { ...state, editUser: action.user };
    case "CLOSE_EDIT":
      return { ...state, editUser: null, editLoading: false };
    case "SET_EDIT_LOADING":
      return { ...state, editLoading: action.loading };
    case "DELETE_USER":
      return { ...state, deleteUserObj: action.user };
    case "CLOSE_DELETE":
      return { ...state, deleteUserObj: null, deleteLoading: false };
    case "SET_DELETE_LOADING":
      return { ...state, deleteLoading: action.loading };
    case "OPEN_PASSWORD_DIALOG":
      return { ...state, passwordDialogOpen: true, passwordUser: action.user, passwordLoading: false, generatedPassword: null };
    case "CLOSE_PASSWORD_DIALOG":
      return { ...state, passwordDialogOpen: false, passwordUser: null, passwordLoading: false, generatedPassword: null };
    case "SET_PASSWORD_LOADING":
      return { ...state, passwordLoading: action.loading };
    case "SET_GENERATED_PASSWORD":
      return { ...state, generatedPassword: action.password, passwordLoading: false };
    default:
      return state;
  }
}

export default function UsersPage() {
  const { userData, loading: userLoading } = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchUsers() {
      dispatch({ type: "SET_LOADING", loading: true });
      const users = await getAllUsers();
      dispatch({ type: "SET_USERS", users });
      dispatch({ type: "SET_LOADING", loading: false });
    }
    fetchUsers();
  }, []);

  const handleEdit = (user: UserData) => dispatch({ type: "EDIT_USER", user });
  const handleDelete = (user: UserData) => dispatch({ type: "DELETE_USER", user });
  const handleGeneratePassword = (user: UserData) => dispatch({ type: "OPEN_PASSWORD_DIALOG", user });

  const handleEditSave = async (data: { displayName: string; role: UserData["role"] }) => {
    if (!state.editUser) return;
    dispatch({ type: "SET_EDIT_LOADING", loading: true });
    await updateUser(state.editUser.uid, data);
    dispatch({ type: "CLOSE_EDIT" });
    dispatch({ type: "SET_LOADING", loading: true });
    const users = await getAllUsers();
    dispatch({ type: "SET_USERS", users });
    dispatch({ type: "SET_LOADING", loading: false });
  };

  const handleDeleteConfirm = async () => {
    if (!state.deleteUserObj) return;
    dispatch({ type: "SET_DELETE_LOADING", loading: true });
    await deleteUser(state.deleteUserObj.uid);
    dispatch({ type: "CLOSE_DELETE" });
    dispatch({ type: "SET_LOADING", loading: true });
    const users = await getAllUsers();
    dispatch({ type: "SET_USERS", users });
    dispatch({ type: "SET_LOADING", loading: false });
  };

  const handleGeneratePasswordConfirm = async () => {
    if (!state.passwordUser) return;
    dispatch({ type: "SET_PASSWORD_LOADING", loading: true });
    // Simulate password generation
    await new Promise((r) => setTimeout(r, 1200));
    const newPassword = Math.random().toString(36).slice(-10);
    // TODO: Integrate with backend to actually set password
    dispatch({ type: "SET_GENERATED_PASSWORD", password: newPassword });
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
        <Typography variant="h6" color="error" align="center">
          Access denied. Admins only.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Lista użytkowników
        </Typography>
        {state.loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserTable users={state.users} onEdit={handleEdit} onDelete={handleDelete} onGeneratePassword={handleGeneratePassword} />
        )}
      </Container>

      {/* Edit Dialog */}
      <EditDialog
        open={!!state.editUser}
        onClose={() => dispatch({ type: "CLOSE_EDIT" })}
        title={state.editUser ? `Edytuj użytkownika: ${state.editUser.displayName || state.editUser.email}` : ""}
        loading={state.editLoading}
        onSave={() => {}}
        showActions={false}
      >
        {state.editUser && (
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, minWidth: 350 }}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as typeof e.target & {
                displayName: { value: string };
                role: { value: string };
              };
              await handleEditSave({
                displayName: form.displayName.value,
                role: form.role.value as UserData["role"],
              });
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              UID: {state.editUser.uid}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Email: {state.editUser.email}
            </Typography>
            <TextField
              name="displayName"
              label="Display Name"
              defaultValue={state.editUser.displayName || ""}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              name="role"
              label="Role"
              select
              defaultValue={state.editUser.role}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="user">user</MenuItem>
            </TextField>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button onClick={() => dispatch({ type: "CLOSE_EDIT" })} disabled={state.editLoading}>
                Anuluj
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={state.editLoading}>
                Zapisz
              </Button>
            </Box>
          </Box>
        )}
      </EditDialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={!!state.deleteUserObj}
        onClose={() => dispatch({ type: "CLOSE_DELETE" })}
        onConfirm={handleDeleteConfirm}
        title="Usuń użytkownika"
        message={
          state.deleteUserObj
            ? `Czy na pewno chcesz usunąć użytkownika ${state.deleteUserObj.displayName || state.deleteUserObj.email}?`
            : ""
        }
        type="delete"
        loading={state.deleteLoading}
      />

      {/* Password Dialog */}
      <EditDialog
        open={state.passwordDialogOpen}
        onClose={() => dispatch({ type: "CLOSE_PASSWORD_DIALOG" })}
        title={state.passwordUser ? `Nowe hasło dla: ${state.passwordUser.displayName || state.passwordUser.email}` : "Generuj nowe hasło"}
        loading={state.passwordLoading}
        showActions={true}
        onSave={handleGeneratePasswordConfirm}
      >
        <Box sx={{ py: 2, minWidth: 320 }}>
          {state.passwordLoading ? (
            <Typography variant="body1">Generowanie hasła...</Typography>
          ) : state.generatedPassword ? (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Nowe hasło:</strong>
              </Typography>
              <TextField value={state.generatedPassword} fullWidth InputProps={{ readOnly: true }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                Przekaż użytkownikowi nowe hasło. Po zalogowaniu może je zmienić w swoim profilu.
              </Typography>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleGeneratePasswordConfirm} disabled={state.passwordLoading}>
              Wygeneruj hasło
            </Button>
          )}
        </Box>
      </EditDialog>
    </>
  );
}
