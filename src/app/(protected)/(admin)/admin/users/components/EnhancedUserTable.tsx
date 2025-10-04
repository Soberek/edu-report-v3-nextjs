"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as KeyIcon,
} from "@mui/icons-material";
import type { AdminUser } from "@/hooks/useAdminUsers";
import { format } from "date-fns";

interface EnhancedUserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
}

export function EnhancedUserTable({
  users,
  onEdit,
  onDelete,
  onResetPassword,
}: EnhancedUserTableProps) {
  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "moderator":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return "N/A";
    }
  };

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nazwa</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Rola</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Utworzony</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ostatnie logowanie</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
              Akcje
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                  Brak użytkowników
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.uid} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{user.email || "N/A"}</Typography>
                    {user.emailVerified && (
                      <Chip
                        label="Zweryfikowany"
                        size="small"
                        color="success"
                        sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{user.displayName || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role || "user"}
                    size="small"
                    color={getRoleColor(user.role)}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.disabled ? "Zablokowany" : "Aktywny"}
                    size="small"
                    color={user.disabled ? "error" : "success"}
                    variant={user.disabled ? "outlined" : "filled"}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {formatDate(user.metadata.creationTime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {formatDate(user.metadata.lastSignInTime)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <Tooltip title="Edytuj użytkownika">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Resetuj hasło">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onResetPassword(user)}
                      >
                        <KeyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Usuń użytkownika">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
