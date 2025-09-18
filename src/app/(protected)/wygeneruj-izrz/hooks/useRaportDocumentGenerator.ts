import React, { useReducer, useState } from "react";

interface FormData {
  templateFile: File | null;
  caseNumber: string;
  reportNumber: string;
  programName: string;
  taskType: string;
  address: string;
  dateInput: string;
  viewerCount: number;
  viewerCountDescription: string;
  taskDescription: string;
  additionalInfo: string;
  attendanceList: boolean;
  rozdzielnik: boolean;
}

type FormAction =
  | { type: "SET_FIELD"; name: keyof FormData; value: any }
  | { type: "SET_FILE"; file: File | null }
  | { type: "RESET"; payload?: Partial<FormData> };

const initialFormData: FormData = {
  templateFile: null,
  caseNumber: "",
  reportNumber: "",
  programName: "",
  taskType: "",
  address: "",
  dateInput: new Date().toISOString().split("T")[0],
  viewerCount: 0,
  viewerCountDescription: `Grupa I:\nUczniowie szkoły podstawowej: 0\nOpiekunowie: 1\nGrupa II:\nUczniowie szkoły podstawowej: 0\nOpiekunowie: 1\nGrupa III:\nUczniowie szkoły podstawowej: 0\nOpiekunowie: 1\n`,
  taskDescription: "",
  additionalInfo: "",
  rozdzielnik: false,
  attendanceList: true,
};

function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.name]: action.value };
    case "SET_FILE":
      return { ...state, templateFile: action.file };
    case "RESET":
      return { ...initialFormData, ...action.payload };
    default:
      return state;
  }
}

export const useRaportDocumentGenerator = () => {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" && "checked" in target ? (target as HTMLInputElement).checked : undefined;
    dispatch({
      type: "SET_FIELD",
      name: name as keyof FormData,
      value: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    dispatch({ type: "SET_FILE", file });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    const formDataToSend = new FormData(e.currentTarget);

    if (formData.templateFile) {
      formDataToSend.set("templateFile", formData.templateFile);
    }

    try {
      const response = await fetch("/api/generate-izrz", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const fileBlob = await response.blob();

      let filename = "report.docx";
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1];
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(fileBlob);
      downloadLink.download = filename;
      downloadLink.click();

      setSubmitMessage({
        type: "success",
        text: "Raport został wygenerowany! Pobieranie rozpoczęte.",
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Błąd podczas generowania raportu. Spróbuj ponownie.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    dispatch,
    isSubmitting,
    submitMessage,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};
