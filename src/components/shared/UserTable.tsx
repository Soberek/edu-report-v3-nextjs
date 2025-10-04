import * as React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { UserData } from "@/types/user";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import VpnKeyIcon from "@mui/icons-material/VpnKey";

interface UserTableProps {
  users: UserData[];
  onEdit?: (user: UserData) => void;
  onDelete?: (user: UserData) => void;
  onGeneratePassword?: (user: UserData) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onGeneratePassword }) => (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>UID</strong>
          </TableCell>
          <TableCell>
            <strong>Email</strong>
          </TableCell>
          <TableCell>
            <strong>Display Name</strong>
          </TableCell>
          <TableCell>
            <strong>Role</strong>
          </TableCell>
          <TableCell>
            <strong>Created At</strong>
          </TableCell>
          <TableCell align="center">
            <strong>Actions</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.uid}>
            <TableCell>{u.uid}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.displayName}</TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell>{u.createdAt}</TableCell>
            <TableCell align="center">
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => onEdit && onEdit(u)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              {u.uid !== "ZbrZDimLLpfZoTvcg838CsDBvW42" && (
                <>
                  <Tooltip title="Generate Password">
                    <IconButton size="small" color="info" onClick={() => onGeneratePassword && onGeneratePassword(u)}>
                      <VpnKeyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDelete && onDelete(u)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
