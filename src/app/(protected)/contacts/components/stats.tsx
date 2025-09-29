import React from "react";
import { Box, Card, CardContent, Typography, Grid, Avatar, useTheme } from "@mui/material";
import { People, Email, Phone, PersonAdd, TrendingUp } from "@mui/icons-material";
import { Contact } from "@/types";

interface ContactStatsProps {
  contacts: Contact[];
  loading: boolean;
}

export default function ContactStats({ contacts, loading }: ContactStatsProps) {
  const theme = useTheme();

  const stats = {
    total: contacts.length,
    withEmail: contacts.filter((c) => c.email).length,
    withPhone: contacts.filter((c) => c.phone).length,
    recent: contacts.filter((c) => {
      const createdAt = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length,
  };

  const statCards = [
    {
      title: "Wszystkie kontakty",
      value: stats.total,
      icon: <People />,
      color: theme.palette.primary.main,
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Z adresem email",
      value: stats.withEmail,
      icon: <Email />,
      color: theme.palette.success.main,
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Z numerem telefonu",
      value: stats.withPhone,
      icon: <Phone />,
      color: theme.palette.warning.main,
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Dodane w tym tygodniu",
      value: stats.recent,
      icon: <TrendingUp />,
      color: theme.palette.info.main,
      bgColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                animation: "pulse 2s infinite",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <PersonAdd sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      ...
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Ładowanie...
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              background: stat.bgColor,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {React.cloneElement(stat.icon, {
                    sx: {
                      color: "white",
                      fontSize: 28,
                    },
                  })}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
