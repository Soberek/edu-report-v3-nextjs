"use client";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { ActRecordA4PagePDF } from "./a4-page-pdf";
import type { CaseRecord } from "@/types";
import { Button } from "@mui/material";

type Props = {
  caseRecords: CaseRecord[];
  selectedCode: string;
  year: string;
  title: string;
};

export const ActRecordsPdfPreview: React.FC<Props> = ({ caseRecords, selectedCode, year, title }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const blob = await pdf(
      <ActRecordA4PagePDF caseRecords={caseRecords} code={selectedCode} year={year ?? "2025"} title={title} />
    ).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `akty_spraw_${selectedCode}_${year || new Date().getFullYear()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <>
      <Button variant="contained" disabled={loading} onClick={handleDownload}>
        {loading ? "Generowanie dokumentu..." : "Pobierz PDF"}
      </Button>
      {/* Render PDF preview */}
      {/* <div style={{ marginTop: 24, border: "1px solid #ccc" }}>
        <PDFViewer width="100%" height={1400}>
          <ActRecordA4PagePDF
            caseRecords={caseRecords}
            code={selectedCode}
            year={year ?? "2025"}
            title={title}
          />
        </PDFViewer>
      </div> */}
    </>
  );
};
