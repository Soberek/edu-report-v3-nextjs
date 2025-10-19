import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { People, Email, Phone, TrendingUp } from "@mui/icons-material";
import { StatsCard } from "@/components/shared";
import { Contact } from "../types";
import { calculateContactStats } from "../utils";

interface ContactStatsProps {
  contacts: Contact[];
  loading: boolean;
}

/**
 * Contact statistics dashboard
 * Uses shared StatsCard component for consistency
 */
export default function ContactStats({ contacts, loading }: ContactStatsProps) {
  const stats = useMemo(() => calculateContactStats(contacts), [contacts]);

  const statItems = [
    {
      title: "Wszystkie kontakty",
      value: stats.total,
      icon: <People />,
      color: "primary" as const,
    },
    {
      title: "Z adresem email",
      value: stats.withEmail,
      icon: <Email />,
      color: "success" as const,
    },
    {
      title: "Z numerem telefonu",
      value: stats.withPhone,
      icon: <Phone />,
      color: "warning" as const,
    },
    {
      title: "Dodane w tym tygodniu",
      value: stats.recentCount,
      icon: <TrendingUp />,
      color: "info" as const,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statItems.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <StatsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
}
