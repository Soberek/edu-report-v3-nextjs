// src/app/api/generate-izrz/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import PizZip from "pizzip";
import docxtemplater from "docxtemplater";

// --- Schemas & Types ---
const createIzrzDocumentSchema = z.object({
  templateFile: z.instanceof(Buffer),
  caseNumber: z.string().min(1, "Case number is required."),
  reportNumber: z.string().min(1, "Report number is required."),
  programName: z.string().min(1, "Program name is required."),
  taskType: z.string().min(1, "Task type is required."),
  address: z.string().min(1, "Address is required."),
  dateInput: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format. Please use a valid date.",
  }),
  viewerCount: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().int().nonnegative("Viewer count cannot be negative.")
  ),
  viewerCountDescription: z.string().optional(),
  taskDescription: z.string().optional(),
  additionalInfo: z.string().optional(),
  attendanceList: z.string().optional(),
  rozdzielnik: z.string().optional(),
});
type CreateIzrzDocumentT = z.infer<typeof createIzrzDocumentSchema>;
const createIzrzDocumentCreateSchema = createIzrzDocumentSchema.omit({ templateFile: true });

// --- Utility Functions ---
function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/[\/\\]/g, "-")
    .replace(/[\/:*?"<>|\\]/g, "")
    .replace(/[^a-zA-Z0-9._\- ]/g, "")
    .trim();
}

function formatDate(dateInput: string) {
  const date = new Date(dateInput).toISOString().split("T")[0];
  return date.split("-").reverse().join(".");
}

function extractCity(address: string) {
  const parts = address.trim().split(" ");
  return parts[parts.length - 1];
}

// --- Repository ---
class IzrzRepository {
  async generateIzrz(data: CreateIzrzDocumentT): Promise<{ buffer: Buffer; fileName: string }> {
    const validation = createIzrzDocumentCreateSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      throw new Error("Niepoprawne dane: " + errors.join(", "));
    }

    if (!data.templateFile) throw new Error("Szablon nie został wybrany.");

    const zip = new PizZip(data.templateFile);
    const doc = new docxtemplater(zip);

    let index = 0;
    doc.setData({
      znak_sprawy: data.caseNumber,
      numer_izrz: data.reportNumber,
      nazwa_programu: data.programName,
      typ_zadania: data.taskType,
      miasto: extractCity(data.address),
      adres: data.address,
      liczba_osob: data.viewerCount,
      liczba_osob_opis: data.viewerCountDescription,
      opis_zadania: data.taskDescription,
      dodatkowe_informacje: data.additionalInfo,
      data: formatDate(data.dateInput),
      lista_obecnosci: data.attendanceList === "true" ? `${++index}. Potwierdzenie spotkania zał. F/PT/PZ/01/02` : "",
      rozdzielnik: data.rozdzielnik === "true" ? `${++index}. Rozdzielnik materiałów zał. F/PT/PZ/01/01` : "",
    });

    try {
      doc.render();
    } catch (error) {
      console.error("Error during document rendering:", error);
      throw new Error("Error rendering document");
    }

    const blob = doc.getZip().generate({ type: "blob" });
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = sanitizeFileName(
      `${data.reportNumber} - ${data.caseNumber} - ${formatDate(data.dateInput)} - ${data.taskType} - ${data.programName} - ${
        data.address.split(",")[0]
      } - ${extractCity(data.address)}`
    );

    return { buffer, fileName };
  }
}

// --- Service ---
class IzrzService {
  constructor(private repo: IzrzRepository) {}

  async generateIzrzDocument(data: CreateIzrzDocumentT) {
    const validation = createIzrzDocumentCreateSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      throw new Error("Invalid data: " + errors.join(", "));
    }
    return this.repo.generateIzrz(data);
  }
}

// --- API Route Handler ---
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("templateFile") as File;
    if (!file) return NextResponse.json({ message: "Brak szablonu w żądaniu." }, { status: 400 });

    const templateFile = Buffer.from(await file.arrayBuffer());
    // const rawData = Object.fromEntries(formData.entries());
    const data: CreateIzrzDocumentT = {
      templateFile,
      caseNumber: String(formData.get("caseNumber") ?? ""),
      reportNumber: String(formData.get("reportNumber") ?? ""),
      programName: String(formData.get("programName") ?? ""),
      taskType: String(formData.get("taskType") ?? ""),
      address: String(formData.get("address") ?? ""),
      dateInput: String(formData.get("dateInput") ?? ""),
      viewerCount: Number(formData.get("viewerCount") ?? 0),
      viewerCountDescription: String(formData.get("viewerCountDescription") ?? ""),
      taskDescription: String(formData.get("taskDescription") ?? ""),
      additionalInfo: String(formData.get("additionalInfo") ?? ""),
      attendanceList: String(formData.get("attendanceList") ?? ""),
      rozdzielnik: String(formData.get("rozdzielnik") ?? ""),
    };

    // Log boolean values for debugging
    console.log("attendanceList:", data.attendanceList);
    console.log("rozdzielnik:", data.rozdzielnik);

    const validation = createIzrzDocumentCreateSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      return NextResponse.json({ message: "Validation errors: " + errors.join(", ") }, { status: 400 });
    }

    const repo = new IzrzRepository();
    const service = new IzrzService(repo);
    const fileBuffer = await service.generateIzrzDocument(data);

    if (!fileBuffer?.buffer) {
      return NextResponse.json({ message: "Failed to generate document" }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(fileBuffer.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${fileBuffer.fileName}.docx`,
        "Content-Length": fileBuffer.buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
