import type { Activity, Material } from "@/types";
import { isDistributionActivity } from "@/types";

/**
 * Extract all materials from educational task activities
 */
export const extractMaterialsFromActivities = (activities: Activity[]): Material[] => {
  const allMaterials: Material[] = [];

  activities.forEach((activity) => {
    if (isDistributionActivity(activity)) {
      allMaterials.push(...activity.materials);
    }
  });

  return allMaterials;
};

/**
 * Get total distributed count for all materials
 */
export const getTotalDistributedCount = (activities: Activity[]): number => {
  const materials = extractMaterialsFromActivities(activities);
  return materials.reduce((total, material) => total + material.distributedCount, 0);
};

/**
 * Get formatted summary of distributed materials
 */
export const getMaterialsSummary = (activities: Activity[]): string => {
  const materials = extractMaterialsFromActivities(activities);

  if (materials.length === 0) {
    return "Brak materiałów";
  }

  const totalCount = getTotalDistributedCount(activities);
  const uniqueTypes = new Set(materials.map((m) => m.type)).size;

  if (materials.length === 1) {
    return `${materials[0].name} (${materials[0].distributedCount} szt.)`;
  }

  return `${materials.length} materiałów (${totalCount} szt., ${uniqueTypes} typów)`;
};

/**
 * Get detailed materials list with counts
 */
export const getMaterialsDetailsList = (
  activities: Activity[]
): Array<{
  name: string;
  type: string;
  count: number;
  description?: string;
}> => {
  const materials = extractMaterialsFromActivities(activities);

  // Group by name and sum counts
  const groupedMaterials = materials.reduce((acc, material) => {
    const key = `${material.name}-${material.type}`;
    if (acc[key]) {
      acc[key].count += material.distributedCount;
    } else {
      acc[key] = {
        name: material.name,
        type: material.type,
        count: material.distributedCount,
        description: material.description,
      };
    }
    return acc;
  }, {} as Record<string, { name: string; type: string; count: number; description?: string }>);

  return Object.values(groupedMaterials).sort((a, b) => b.count - a.count);
};
