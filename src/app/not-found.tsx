import { Box, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "4rem", md: "6rem" },
            fontWeight: "bold",
            color: "primary.main",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Oops! Strona nie znaleziona
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: "400px",
            lineHeight: 1.6,
            mb: 1,
          }}
        >
          Strona której szukasz nie istnieje lub została przeniesiona. Sprawdź adres URL lub wróć do strony głównej.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
          }}
        >
          Powrót do Strony Głównej
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
