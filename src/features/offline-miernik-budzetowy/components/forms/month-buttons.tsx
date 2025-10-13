import { Box, Button, Typography, Chip } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

export interface Month {
  monthNumber: number;
  selected: boolean;
}

interface Props {
  months: Month[];
  handleMonthSelect: (selectedMonth: number) => void;
}

const MONTH_NAMES = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

const getMonthName = (monthNum: number): string => {
  if (monthNum < 1 || monthNum > 12) return monthNum.toString();
  return MONTH_NAMES[monthNum - 1] || monthNum.toString();
};

function ExcelUploaderMonthsButtons({ months, handleMonthSelect }: Props) {
  const selectedCount = months.filter((m) => m.selected).length;

  return (
    <Box
      sx={{
        p: 3,
        mx: 2,
        my: 2,
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          fontWeight={600}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "text.primary",
          }}
        >
          <CalendarMonth color="primary" />
          Wybierz miesiące
        </Typography>
        <Chip
          label={`${selectedCount} wybranych`}
          size="small"
          color={selectedCount > 0 ? "primary" : "default"}
          variant={selectedCount > 0 ? "filled" : "outlined"}
        />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(80px, 1fr))"
        gap={1.5}
      >
        {months.map(({ monthNumber, selected }) => (
          <Button
            key={monthNumber}
            onClick={() => handleMonthSelect(monthNumber)}
            size="medium"
            sx={{
              minWidth: 80,
              height: 44,
              borderRadius: 2.5,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              position: "relative",
              ...(selected
                ? {
                    background: "white",
                    transform: "translateY(4px)",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }
                : {
                    borderColor: "divider",
                    color: "black",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.50",
                    },
                  }),
            }}
          >
            {getMonthName(monthNumber)}
            {selected && (
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  color: "primary.main",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  bgcolor: "white",
                  outline: "2px solid",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "2px solid white",
                }}
              >
                ✓
              </Box>
            )}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default ExcelUploaderMonthsButtons;
