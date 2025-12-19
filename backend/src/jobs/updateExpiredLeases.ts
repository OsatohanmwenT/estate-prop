import leaseService from "../services/lease.service";

export interface UpdateExpiredResult {
  updated: number;
  errors: Array<{ leaseId: string; error: string }>;
}

export async function updateExpiredLeases(): Promise<UpdateExpiredResult> {
  const result: UpdateExpiredResult = { updated: 0, errors: [] };

  try {
    const expiredLeases = await leaseService.updateExpiredLeases();
    result.updated = expiredLeases.length;
    console.log(`✅ Updated ${expiredLeases.length} leases to expired status`);
  } catch (error: any) {
    throw new Error(`Failed to update expired leases: ${error.message}`);
  }

  return result;
}
