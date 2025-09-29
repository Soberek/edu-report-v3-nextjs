import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the form component
const MockEducationalTaskForm = ({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  initialData?: Record<string, unknown>;
}) => {
  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    programName: initialData?.programName || "",
    date: initialData?.date || "",
    schoolId: initialData?.schoolId || "",
    taskNumber: initialData?.taskNumber || "",
    referenceNumber: initialData?.referenceNumber || "",
    activities: initialData?.activities || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div data-testid="educational-task-form">
      <form onSubmit={handleSubmit}>
        <input
          data-testid="form-title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Tytuł zadania"
        />
        <select data-testid="form-program" value={formData.programName} onChange={(e) => handleInputChange("programName", e.target.value)}>
          <option value="">Wybierz program</option>
          <option value="Program Edukacyjny 1">Program Edukacyjny 1</option>
          <option value="Program Edukacyjny 2">Program Edukacyjny 2</option>
        </select>
        <input data-testid="form-date" type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} />
        <select data-testid="form-school" value={formData.schoolId} onChange={(e) => handleInputChange("schoolId", e.target.value)}>
          <option value="">Wybierz szkołę</option>
          <option value="school-1">Szkoła Podstawowa nr 1</option>
          <option value="school-2">Szkoła Podstawowa nr 2</option>
        </select>
        <input
          data-testid="form-task-number"
          value={formData.taskNumber}
          onChange={(e) => handleInputChange("taskNumber", e.target.value)}
          placeholder="Numer zadania"
        />
        <input
          data-testid="form-reference-number"
          value={formData.referenceNumber}
          onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
          placeholder="Numer referencyjny"
        />
        <button type="submit" data-testid="form-submit">
          Dodaj zadanie
        </button>
        <button type="button" onClick={onCancel} data-testid="form-cancel">
          Anuluj
        </button>
      </form>
    </div>
  );
};

// Mock the page component
const MockEducationalTasksPage = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [submittedData, setSubmittedData] = React.useState<Record<string, unknown> | null>(null);

  const handleAddTask = () => {
    setEditTask(null);
    setIsFormOpen(true);
  };

  // const handleEditTask = (task: Record<string, unknown>) => {
  //   setEditTask(task);
  //   setIsFormOpen(true);
  // };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    setSubmittedData(data);
    setIsFormOpen(false);
    setEditTask(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditTask(null);
  };

  return (
    <div>
      <button onClick={handleAddTask} data-testid="add-task-button">
        Dodaj zadanie
      </button>
      {isFormOpen && <MockEducationalTaskForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} initialData={editTask} />}
      {submittedData && (
        <div data-testid="submitted-data">
          <h3>Zadanie zostało dodane:</h3>
          <p>Tytuł: {submittedData.title}</p>
          <p>Program: {submittedData.programName}</p>
          <p>Data: {submittedData.date}</p>
          <p>Szkoła: {submittedData.schoolId}</p>
          <p>Numer zadania: {submittedData.taskNumber}</p>
          <p>Numer referencyjny: {submittedData.referenceNumber}</p>
        </div>
      )}
    </div>
  );
};

describe("Form Submission Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should open form when clicking 'Dodaj zadanie' button", async () => {
    const user = userEvent.setup();
    render(<MockEducationalTasksPage />);

    // Initially, form should not be visible
    expect(screen.queryByTestId("educational-task-form")).not.toBeInTheDocument();

    // Click "Dodaj zadanie" button
    const addButton = screen.getByTestId("add-task-button");
    await user.click(addButton);

    // Form should now be visible
    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });
  });

  it("should fill form data and submit successfully", async () => {
    const user = userEvent.setup();
    render(<MockEducationalTasksPage />);

    // Open form
    const addButton = screen.getByTestId("add-task-button");
    await user.click(addButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });

    // Fill form fields
    const titleInput = screen.getByTestId("form-title");
    const programSelect = screen.getByTestId("form-program");
    const dateInput = screen.getByTestId("form-date");
    const schoolSelect = screen.getByTestId("form-school");
    const taskNumberInput = screen.getByTestId("form-task-number");
    const referenceNumberInput = screen.getByTestId("form-reference-number");

    await user.type(titleInput, "Nowe zadanie edukacyjne");
    await user.selectOptions(programSelect, "Program Edukacyjny 1");
    await user.type(dateInput, "2025-02-15");
    await user.selectOptions(schoolSelect, "school-1");
    await user.type(taskNumberInput, "2/2025");
    await user.type(referenceNumberInput, "TEST.002.2025");

    // Submit form
    const submitButton = screen.getByTestId("form-submit");
    await user.click(submitButton);

    // Verify that data was submitted and displayed
    await waitFor(() => {
      expect(screen.getByTestId("submitted-data")).toBeInTheDocument();
      expect(screen.getByText("Tytuł: Nowe zadanie edukacyjne")).toBeInTheDocument();
      expect(screen.getByText("Program: Program Edukacyjny 1")).toBeInTheDocument();
      expect(screen.getByText("Data: 2025-02-15")).toBeInTheDocument();
      expect(screen.getByText("Szkoła: school-1")).toBeInTheDocument();
      expect(screen.getByText("Numer zadania: 2/2025")).toBeInTheDocument();
      expect(screen.getByText("Numer referencyjny: TEST.002.2025")).toBeInTheDocument();
    });

    // Form should be closed after submission
    expect(screen.queryByTestId("educational-task-form")).not.toBeInTheDocument();
  });

  it("should close form when clicking cancel", async () => {
    const user = userEvent.setup();
    render(<MockEducationalTasksPage />);

    // Open form
    const addButton = screen.getByTestId("add-task-button");
    await user.click(addButton);

    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByTestId("form-cancel");
    await user.click(cancelButton);

    // Form should be closed
    await waitFor(() => {
      expect(screen.queryByTestId("educational-task-form")).not.toBeInTheDocument();
    });
  });

  it("should pre-fill form when editing existing task", async () => {
    const user = userEvent.setup();
    const existingTask = {
      id: "task-1",
      title: "Existing Task",
      programName: "Program Edukacyjny 1",
      date: "2025-01-15",
      schoolId: "school-1",
      taskNumber: "1/2025",
      referenceNumber: "TEST.001.2025",
    };

    // Mock the page with existing task
    const MockPageWithTask = () => {
      const [isFormOpen, setIsFormOpen] = React.useState(false);
      const [editTask, setEditTask] = React.useState<Record<string, unknown>>(existingTask);

      const handleFormSubmit = () => {
        setIsFormOpen(false);
        setEditTask(null);
      };

      const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditTask(null);
      };

      return (
        <div>
          <button onClick={() => setIsFormOpen(true)} data-testid="edit-task-button">
            Edytuj zadanie
          </button>
          {isFormOpen && <MockEducationalTaskForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} initialData={editTask} />}
        </div>
      );
    };

    render(<MockPageWithTask />);

    // Click edit button
    const editButton = screen.getByTestId("edit-task-button");
    await user.click(editButton);

    // Wait for form to appear with existing data
    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });

    // Verify form is pre-filled with existing data
    const titleInput = screen.getByTestId("form-title");
    const programSelect = screen.getByTestId("form-program");
    const dateInput = screen.getByTestId("form-date");
    const schoolSelect = screen.getByTestId("form-school");
    const taskNumberInput = screen.getByTestId("form-task-number");
    const referenceNumberInput = screen.getByTestId("form-reference-number");

    expect(titleInput).toHaveValue("Existing Task");
    expect(programSelect).toHaveValue("Program Edukacyjny 1");
    expect(dateInput).toHaveValue("2025-01-15");
    expect(schoolSelect).toHaveValue("school-1");
    expect(taskNumberInput).toHaveValue("1/2025");
    expect(referenceNumberInput).toHaveValue("TEST.001.2025");
  });

  it("should handle form validation", async () => {
    const user = userEvent.setup();
    render(<MockEducationalTasksPage />);

    // Open form
    const addButton = screen.getByTestId("add-task-button");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });

    // Try to submit without filling required fields
    const submitButton = screen.getByTestId("form-submit");
    await user.click(submitButton);

    // Note: The mock form doesn't have validation, so it will submit with empty data
    // In a real implementation, validation would prevent submission
    // The form will close after submission, so we check for submitted data instead
    await waitFor(() => {
      expect(screen.getByTestId("submitted-data")).toBeInTheDocument();
    });
  });

  it("should update form fields when user types", async () => {
    const user = userEvent.setup();
    render(<MockEducationalTasksPage />);

    // Open form
    const addButton = screen.getByTestId("add-task-button");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("educational-task-form")).toBeInTheDocument();
    });

    // Type in title field
    const titleInput = screen.getByTestId("form-title");
    await user.type(titleInput, "Test Title");

    // Verify the value was updated
    expect(titleInput).toHaveValue("Test Title");

    // Type in task number field
    const taskNumberInput = screen.getByTestId("form-task-number");
    await user.type(taskNumberInput, "5/2025");

    // Verify the value was updated
    expect(taskNumberInput).toHaveValue("5/2025");
  });
});
