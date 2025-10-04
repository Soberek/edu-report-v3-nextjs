import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton, Stack, Divider } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

interface AudienceSubGroup {
  name: string;
  count: number;
}

interface AudienceGroup {
  id: string;
  groupName: string;
  subGroups: AudienceSubGroup[];
}

interface Props {
  onDescriptionChange: (description: string) => void;
  onTotalCountChange?: (totalCount: number) => void;
}

export const AudienceGroupBuilder: React.FC<Props> = ({ onDescriptionChange, onTotalCountChange }) => {
  const [groups, setGroups] = useState<AudienceGroup[]>([
    {
      id: "1",
      groupName: "Grupa I",
      subGroups: [
        { name: "Szkoła Podstawowa (klasy 1-8)", count: 0 },
        {
          name: "Opiekunowie",
          count: 0,
        },
      ],
    },
    {
      id: "2",
      groupName: "Grupa II",
      subGroups: [
        { name: "Szkoła Ponadpodstawowa (klasy 1-4)", count: 0 },
        {
          name: "Opiekunowie",
          count: 0,
        },
      ],
    },
  ]);

  const generateDescription = (currentGroups: AudienceGroup[]): string => {
    return currentGroups
      .map((group) => {
        const subGroupsText = group.subGroups.map((sg) => `${sg.name}: ${sg.count} osób; `).join("\n");
        return `${group.groupName}:\n${subGroupsText}`;
      })
      .join("\n\n");
  };

  const calculateTotalCount = (currentGroups: AudienceGroup[]): number => {
    return currentGroups.reduce(
      (total, group) => total + group.subGroups.reduce((groupTotal, subGroup) => groupTotal + subGroup.count, 0),
      0
    );
  };

  const updateDescription = (updatedGroups: AudienceGroup[]) => {
    const description = generateDescription(updatedGroups);
    const totalCount = calculateTotalCount(updatedGroups);
    onDescriptionChange(description);
    onTotalCountChange?.(totalCount);
  };

  const addGroup = () => {
    const newId = String(groups.length + 1);
    const newGroups = [
      ...groups,
      {
        id: newId,
        groupName: `Grupa ${toRoman(groups.length + 1)}`,
        subGroups: [{ name: "Uczniowie", count: 0 }],
      },
    ];
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const removeGroup = (groupId: string) => {
    const newGroups = groups.filter((g) => g.id !== groupId);
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const updateGroupName = (groupId: string, newName: string) => {
    const newGroups = groups.map((g) => (g.id === groupId ? { ...g, groupName: newName } : g));
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const addSubGroup = (groupId: string) => {
    const newGroups = groups.map((g) => (g.id === groupId ? { ...g, subGroups: [...g.subGroups, { name: "", count: 0 }] } : g));
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const removeSubGroup = (groupId: string, subGroupIndex: number) => {
    const newGroups = groups.map((g) => (g.id === groupId ? { ...g, subGroups: g.subGroups.filter((_, i) => i !== subGroupIndex) } : g));
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const updateSubGroup = (groupId: string, subGroupIndex: number, field: "name" | "count", value: string | number) => {
    const newGroups = groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            subGroups: g.subGroups.map((sg, i) => (i === subGroupIndex ? { ...sg, [field]: value } : sg)),
          }
        : g
    );
    setGroups(newGroups);
    updateDescription(newGroups);
  };

  const toRoman = (num: number): string => {
    const romanNumerals: [number, string][] = [
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ];
    let result = "";
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        Grupy wiekowe
      </Typography>

      <Stack spacing={2}>
        {groups.map((group) => (
          <Paper key={group.id} elevation={2} sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TextField
                size="small"
                value={group.groupName}
                onChange={(e) => updateGroupName(group.id, e.target.value)}
                placeholder="Nazwa grupy"
                sx={{ flex: 1 }}
              />
              {groups.length > 1 && (
                <IconButton size="small" color="error" onClick={() => removeGroup(group.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Stack spacing={1.5}>
              {group.subGroups.map((subGroup, subIndex) => (
                <Box key={subIndex} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    size="small"
                    value={subGroup.name}
                    onChange={(e) => updateSubGroup(group.id, subIndex, "name", e.target.value)}
                    placeholder="Np. Uczniowie klas 1-3"
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    value={subGroup.count}
                    onChange={(e) => updateSubGroup(group.id, subIndex, "count", parseInt(e.target.value) || 0)}
                    placeholder="Liczba"
                    sx={{ width: 100 }}
                    inputProps={{ min: 0 }}
                  />
                  {group.subGroups.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => removeSubGroup(group.id, subIndex)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>

            <Button size="small" startIcon={<Add />} onClick={() => addSubGroup(group.id)} sx={{ mt: 1.5 }} variant="outlined">
              Dodaj podgrupę
            </Button>
          </Paper>
        ))}
      </Stack>

      <Button size="small" startIcon={<Add />} onClick={addGroup} sx={{ mt: 2 }} variant="contained">
        Dodaj grupę
      </Button>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Podgląd opisu:
        </Typography>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "primary.main", backgroundColor: "#e3f2fd", px: 1.5, py: 0.5, borderRadius: 1 }}
        >
          Łącznie: {calculateTotalCount(groups)} osób
        </Typography>
      </Box>
      <Paper sx={{ p: 1.5, mt: 1, backgroundColor: "#f1f3f5", fontSize: "0.85rem", whiteSpace: "pre-line" }}>
        {generateDescription(groups) || "Brak danych"}
      </Paper>
    </Box>
  );
};
