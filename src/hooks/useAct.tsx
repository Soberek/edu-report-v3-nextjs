import { useFirebaseData } from "./useFirebaseData";
import { useUser } from "./useUser";
import z from "zod";

const ActSchema = z.object({
  id: z.string(),
  code: z.string(),
  referenceNumber: z.string(),
  date: z.string(),
  title: z.string(),
  createdAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  sender: z.string(),
  comments: z.string(),
  notes: z.string(),
  userId: z.string(),
});

const ActCreateDTO = ActSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});
const ActUpdateDTO = ActSchema.partial().required({ id: true });

type Act = z.infer<typeof ActSchema>;
type ActCreate = z.infer<typeof ActCreateDTO>;
type ActUpdate = z.infer<typeof ActUpdateDTO>;

export const useAct = () => {
  const userId = useUser().user?.uid;

  const {
    data: actRecords,
    error: actRecordsError,
    loading: actRecordsLoading,
    createItem: createActRecord,
    updateItem: updateActItem,
    deleteItem: deleteActRecord,
    refetch: refetchActRecords,
  } = useFirebaseData<Act>("case-records", userId);

  const addActRecord = async (data: Omit<ActCreate, "userId">) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const parsedData = ActCreateDTO.parse(data);

      return await createActRecord({ ...parsedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation failed at addActRecord: ${error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`
        );
      }
      throw error;
    }
  };

  const updateActRecord = async (data: ActUpdate) => {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const parsedData = ActUpdateDTO.parse(data);
      return await updateActItem(parsedData.id, parsedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  };

  const removeActRecord = async (id: string) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await deleteActRecord(id);
  };

  return {
    actRecords,
    actRecordsError,
    addActRecord,
    actRecordsLoading,
    updateActRecord,
    removeActRecord,
    refetchActRecords,
  };
};
