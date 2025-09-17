"use client";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CaseRecord } from "@/types";

import { formatDate } from "@/utils/index";

type Props = {
  caseRecords: CaseRecord[];
  code: string;
  year: string;
  title: string;
};

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4taVIGxA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UN7rgOUuhsKKSTjw.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v34/mem5YaGs126MiZpBA-UN8rsOUuhsKKSTjw.woff2",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  body: {
    fontFamily: "Open Sans",
    fontSize: 12,
  },
  page: {
    width: 1050,
    height: 1485,
    padding: 0,
    paddingBottom: 40,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 32, // mt: 4 equivalent
    marginHorizontal: 16, // mx: 2 equivalent
    fontFamily: "Open Sans",
  },
  headerGrid: {
    flexDirection: "row",
    // border: "1px solid #000",
    fontSize: 16,
  },
  // Column 1 - Lp.
  lpColumn: {
    width: "8.33%", // size={1} = 1/12
    border: "1px solid #000000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    minHeight: 120,
  },
  // Column 2 - Sprawa
  sprawaColumn: {
    width: "25%", // size={3} = 3/12
    border: "1px solid #000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 8,
    minHeight: 120,
  },
  // Column 3 - Nadawca
  nadawcaColumn: {
    width: "25%", // size={3} = 3/12
    border: "1px solid #000",
    flexDirection: "column",
    minHeight: 120,
  },
  nadawcaTop: {
    paddingVertical: 4,
    paddingBottom: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  nadawcaBottom: {
    borderTop: "1px solid #000",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    flexDirection: "row",
  },
  nadawcaZnak: {
    flex: 3,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #000",
    textAlign: "center",
    padding: 4,
  },
  nadawcaDnia: {
    flex: 1,
    minWidth: 35,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 4,
  },
  // Column 4 - Data
  dataColumn: {
    width: "20%", // size={2} = 2/12
    border: "1px solid #000",
    flexDirection: "column",
    minHeight: 120,
  },
  dataTop: {
    paddingVertical: 4,
    paddingBottom: 4,
    width: "100%",
    borderBottom: "1px solid #000",
    fontSize: 16,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dataBottom: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
  },
  dataWszczecia: {
    width: "50%",
    height: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #000",
  },
  dataWszczeciaTekst: {
    // Note: rotate doesn't work well in react-pdf, using smaller vertical text
    fontSize: 16,
    textAlign: "center",
    transform: "rotate(-90deg)",
  },
  dataOstatecznego: {
    width: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dataOstatecznegoTekst: {
    fontSize: 16,
    textAlign: "center",
    transform: "rotate(-90deg)",
  },
  // Column 5 - Uwagi
  uwagiColumn: {
    width: "21.9%", // size={2} = 2/12
    border: "1px solid #000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    paddingBottom: 8,
    minHeight: 120,
    textAlign: "center",
  },
  uwagiSmall: {
    fontSize: 16,
    paddingHorizontal: 14,
    textAlign: "center",
    marginTop: 4,
  },
  // ************************************
  // Data rows
  dataRow: {
    flexDirection: "row",
    fontSize: 12,
    minHeight: 40,
  },
  dataCell: {
    border: "1px solid #000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    textAlign: "center",
  },

  // Data Column 1 - Lp.
  dataCellLp: {
    width: "8.33%",
    border: "1px solid #000",
  },

  // Data Column 2 - Sprawa
  dataCellSprawa: {
    width: "25%",
    wordBreak: "break-word",
    wordWrap: "break-word",
    paddingHorizontal: 8,
    border: "1px solid #000",
  },

  // Data Column 3 - Nadawca - OZIPZ.0442.1.2025
  dataCellNadawca: {
    width: "24.9%",
    border: "1px solid #000",
    flexDirection: "column",
    padding: 0,
  },
  dataCellData: {
    width: "20%",
    border: "1px solid #000",
    flexDirection: "row",
    padding: 0,
  },

  // Data Column 5 - Uwagi
  dataCellUwagi: {
    width: "21.9%",
    border: "1px solid #000",
  },
  nadawcaDataTop: {
    paddingVertical: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderBottom: "1px solid #000",
    flex: 1,
  },

  //
  nadawcaDataBottom: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  nadawcaDataZnak: {
    width: "66%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #000",
    textAlign: "center",
    padding: 2,
  },
  nadawcaDataDnia: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 2,
  },
  dataDataWszczecia: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid #000",
    textAlign: "center",
    padding: 2,
  },
  dataDataOstatecznego: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 2,
  },
});

export const ActRecordA4PagePDF: React.FC<Props> = ({ caseRecords, code, year, title }) => (
  <Document>
    <Page size={[1050, 1485]} style={styles.page}>
      <View style={styles.container}>
        {/* Top Header */}
        <View
          style={{
            display: "flex",
            borderBottom: "1px solid #000",
          }}
        >
          {/* 2024 - Oświata - 0442 - Sprawozdawczość */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid #000",
              borderBottom: "none",
            }}
          >
            <View
              style={{
                width: "8.25%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                borderBottom: "none",
                textAlign: "center",
              }}
            >
              <Text>{year}</Text>
            </View>
            <View
              style={{
                width: "16.66%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                borderBottom: "none",
                textAlign: "center",
                paddingVertical: 16,
              }}
            >
              <Text>Oświata Zdrowotna i Promocja Zdrowia</Text>
            </View>
            <View
              style={{
                width: "8.3%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                borderBottom: "none",
                textAlign: "center",
              }}
            >
              <Text>{code}</Text>
            </View>
            <View
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                borderBottom: "none",
                textAlign: "center",
                fontSize: 20,
              }}
            >
              <Text>{title}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
          }}
        >
          {/* Rok - Komórka organizacyjna - Symbol klasyfikacyjny z wykazu akt - Hasło klasyfikacyjne z wykazu akt */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid #000",
            }}
          >
            <View
              style={{
                width: "8.25%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              <Text>Rok</Text>
            </View>
            <View
              style={{
                width: "16.66%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                textAlign: "center",
                paddingVertical: 16,
                // paddingHorizontal: 48,
              }}
            >
              <Text>{"Komórka \n organizacyjna"}</Text>
            </View>
            <View
              style={{
                width: "8.3%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              <Text>{"Symbol \n klasyfikacyjny \n z wykazu\n akt"}</Text>
            </View>
            <View
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                textAlign: "center",
              }}
            >
              <Text>Hasło klasyfikacyjne z wykazu akt</Text>
            </View>
          </View>
        </View>

        {/* Header Row */}
        <View style={styles.headerGrid}>
          {/* Lp. Column */}
          <View style={styles.lpColumn}>
            <Text>Lp.</Text>
          </View>

          {/* Sprawa Column */}
          <View style={styles.sprawaColumn}>
            <Text>SPRAWA{"\n"}(krótka treść)</Text>
          </View>

          {/* Nadawca Column */}
          <View style={styles.nadawcaColumn}>
            <View style={styles.nadawcaTop}>
              <Text>Nazwa nadawcy</Text>
            </View>
            <View style={styles.nadawcaBottom}>
              <View style={styles.nadawcaZnak}>
                <Text>znak pisma</Text>
              </View>
              <View style={styles.nadawcaDnia}>
                <Text>z dnia</Text>
              </View>
            </View>
          </View>

          {/* Data Column */}
          <View style={styles.dataColumn}>
            <View style={styles.dataTop}>
              <Text>DATA</Text>
            </View>
            <View style={styles.dataBottom}>
              <View style={styles.dataWszczecia}>
                <Text style={styles.dataWszczeciaTekst}>wszczęcia sprawy</Text>
              </View>
              <View style={styles.dataOstatecznego}>
                <Text style={styles.dataOstatecznegoTekst}>ostatecznego{"\n"}załatwienia</Text>
              </View>
            </View>
          </View>

          {/* Uwagi Column */}
          <View style={styles.uwagiColumn}>
            <Text>UWAGI</Text>
            <Text style={styles.uwagiSmall}>
              (oznaczenie prowadzącego sprawę oraz ewentualne informacje dotyczące sposobu załatwienia sprawy)
            </Text>
          </View>
        </View>

        {/* Data Rows */}
        {caseRecords.length > 0 &&
          caseRecords.map((record, index) => (
            <View key={record.id} style={styles.dataRow}>
              {/* Lp. */}
              <View style={[styles.dataCell, styles.dataCellLp]}>
                <Text>{index + 1}</Text>
              </View>

              {/* Sprawa */}
              <View style={[styles.dataCell, styles.dataCellSprawa]}>
                <Text>{record.title}</Text>
              </View>

              {/* Nadawca */}
              <View style={styles.dataCellNadawca}>
                <View style={styles.nadawcaDataTop}>
                  <Text>{record.sender ?? "-"}</Text>
                </View>
                <View style={styles.nadawcaDataBottom}>
                  <View style={styles.nadawcaDataZnak}>
                    <Text>{record.referenceNumber}</Text>
                  </View>
                  <View style={styles.nadawcaDataDnia}>
                    <Text>{formatDate(record.date)}</Text>
                  </View>
                </View>
              </View>

              {/* Data */}
              <View style={styles.dataCellData}>
                <View style={styles.dataDataWszczecia}>
                  <Text>{formatDate(record.startDate)}</Text>
                </View>
                <View style={styles.dataDataOstatecznego}>
                  <Text>{formatDate(record.endDate) || ""}</Text>
                </View>
              </View>

              {/* Uwagi */}
              <View style={[styles.dataCell, styles.dataCellUwagi]}>
                <Text>{record.comments ?? ""}</Text>
              </View>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);
