import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MainCategoryAggregatedData } from "../../utils/mainCategoryAggregation";

interface MainCategoriesViewProps {
  data: MainCategoryAggregatedData;
}

export const MainCategoriesView: React.FC<MainCategoriesViewProps> = ({ data }) => {
  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Całkowita liczba osób
            </Typography>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {data.grandTotalPeople.toLocaleString("pl-PL")}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Całkowita liczba działań
            </Typography>
            <Typography variant="h3" color="secondary" fontWeight="bold">
              {data.grandTotalActions.toLocaleString("pl-PL")}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Grand Total Monthly Breakdown */}
      {data.monthlyBreakdown && data.monthlyBreakdown.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📅 Podział według miesięcy (wszystkie kategorie)
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Miesiąc</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Liczba osób</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Liczba działań</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.monthlyBreakdown.map((monthData) => (
                    <TableRow key={monthData.month} hover>
                      <TableCell>{monthData.monthName}</TableCell>
                      <TableCell align="right">{monthData.people.toLocaleString("pl-PL")}</TableCell>
                      <TableCell align="right">{monthData.actions.toLocaleString("pl-PL")}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell>
                      <strong>SUMA</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{data.grandTotalPeople.toLocaleString("pl-PL")}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{data.grandTotalActions.toLocaleString("pl-PL")}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Podział według kategorii głównych
      </Typography>

      {data.categories
        .filter((cat) => cat.programs.length > 0)
        .map((category, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                  {category.category}
                </Typography>
                <Chip label={`Osób: ${category.totalPeople.toLocaleString("pl-PL")}`} color="primary" size="small" />
                <Chip label={`Działań: ${category.totalActions.toLocaleString("pl-PL")}`} color="primary" size="small" variant="outlined" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {/* Category Monthly Breakdown */}
              {category.monthlyBreakdown && category.monthlyBreakdown.length > 0 && (
                <Card sx={{ mb: 3, backgroundColor: "background.default" }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      📅 Podział według miesięcy dla kategorii: {category.category}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Miesiąc</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Liczba osób</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Liczba działań</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {category.monthlyBreakdown.map((monthData) => (
                            <TableRow key={monthData.month} hover>
                              <TableCell>{monthData.monthName}</TableCell>
                              <TableCell align="right">{monthData.people.toLocaleString("pl-PL")}</TableCell>
                              <TableCell align="right">{monthData.actions.toLocaleString("pl-PL")}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow sx={{ backgroundColor: "action.hover" }}>
                            <TableCell>
                              <strong>SUMA</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{category.totalPeople.toLocaleString("pl-PL")}</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{category.totalActions.toLocaleString("pl-PL")}</strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}

              {category.programs.map((program, pIndex) => (
                <Card key={pIndex} sx={{ mb: 2, "&:last-child": { mb: 0 } }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {program.isSubCategoryGroup ? (
                        <>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            🔗 {program.programName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Podkategoria obejmująca {program.totalProgramCount} program(y/ów)
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 1, mb: 1, flexWrap: "wrap" }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                              Przykłady programów:
                            </Typography>
                            {program.examplePrograms.map((exProg, idx) => (
                              <Chip key={idx} label={exProg} size="small" variant="outlined" />
                            ))}
                            {program.totalProgramCount > program.examplePrograms.length && (
                              <Chip
                                label={`+${program.totalProgramCount - program.examplePrograms.length} więcej`}
                                size="small"
                                color="info"
                              />
                            )}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {program.programName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Typ programu: {program.programType}
                          </Typography>
                        </>
                      )}
                      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                        <Chip
                          label={`Osób: ${program.totalPeople.toLocaleString("pl-PL")}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          label={`Działań: ${program.totalActions.toLocaleString("pl-PL")}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    </Box>

                    {/* Program Monthly Breakdown */}
                    {program.monthlyBreakdown && program.monthlyBreakdown.length > 0 && (
                      <Box sx={{ mb: 2, p: 2, backgroundColor: "background.default", borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          📅 Miesięczny podział danych
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "action.hover" }}>
                                <TableCell>
                                  <strong>Miesiąc</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Osób</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Działań</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {program.monthlyBreakdown.map((monthData) => (
                                <TableRow key={monthData.month} hover>
                                  <TableCell>{monthData.monthName}</TableCell>
                                  <TableCell align="right">{monthData.people.toLocaleString("pl-PL")}</TableCell>
                                  <TableCell align="right">{monthData.actions.toLocaleString("pl-PL")}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    {/* Display actions */}
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Działanie</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Liczba działań</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>Liczba osób</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {program.actions.map((action, aIndex) => (
                            <TableRow key={aIndex} hover>
                              <TableCell>{action.actionName}</TableCell>
                              <TableCell align="right">{action.actionNumber.toLocaleString("pl-PL")}</TableCell>
                              <TableCell align="right">{action.people.toLocaleString("pl-PL")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

      {data.categories.every((cat) => cat.programs.length === 0) && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Brak danych do wyświetlenia
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
