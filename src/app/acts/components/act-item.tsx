import { Box, Grid } from "@mui/material";
import type { CaseRecord } from "@/types";
import { formatDate } from "@/utils";

export const ActCaseRecord = ({ data, index }: { data: CaseRecord; index: number }) => {
  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        fontFamily: "Calibri, Arial, sans-serif",
        "& > div": {
          border: "1px solid #000000ff",
          textAlign: "center",
          // alignContent: "center",
          fontFamily: "inherit",
        },
      }}
    >
      <Grid
        size={1}
        sx={{
          border: "1px solid #ff0000ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {index + 1}.
      </Grid>

      <Grid
        size={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "130px",
          px: "10px",
        }}
      >
        {data.title}
      </Grid>

      <Grid
        size={3}
        container
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          py="2px"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          -
        </Box>
        <Box
          sx={{
            borderTop: "1px solid #000000ff",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              flexGrow: 3,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid #000000ff",
            }}
          >
            {data.referenceNumber}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              wordBreak: "break-word",
              wordWrap: "break-word",
            }}
          >
            {formatDate(data.date)}
          </Box>
        </Box>
      </Grid>

      <Grid
        size={2}
        container
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            width: "100%",
            wordBreak: "break-word",
          }}
        >
          <Box
            sx={{
              //   flexGrow: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid #000000ff",
            }}
          >
            {formatDate(data.startDate)}
          </Box>
          <Box
            sx={{
              //   flexGrow: 1,
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {formatDate(data.endDate)}
          </Box>
        </Box>
      </Grid>

      <Grid
        size={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.comments}
      </Grid>
    </Grid>
  );
};
