import leaseService from "../services/lease.service";
import invoiceService from "../services/invoice.service";

export interface GenerateInvoicesResult {
  created: number;
  skipped: number;
  errors: Array<{ leaseId: number; error: string }>;
}

export async function generateRecurringInvoices(): Promise<GenerateInvoicesResult> {
  const result: GenerateInvoicesResult = { created: 0, skipped: 0, errors: [] };

  try {
    const activeLeases = await leaseService.getAllLeases({
      status: "active",
      limit: 1000,
    });

    for (const lease of activeLeases) {
      try {
        const invoice = await invoiceService.generateRecurringInvoice(lease.id);
        if (invoice) {
          result.created++;
          console.log(`✅ Generated invoice for lease ${lease.id}`);
        } else {
          result.skipped++;
        }
      } catch (error: any) {
        result.errors.push({
          leaseId: lease.id,
          error: error.message,
        });
        console.error(
          `❌ Failed to generate invoice for lease ${lease.id}:`,
          error.message
        );
        // Continue processing other leases
      }
    }

    console.log(
      `✅ Invoice generation completed: ${result.created} generated, ${result.skipped} skipped, ${result.errors.length} errors`
    );
  } catch (error: any) {
    throw new Error(`Failed to fetch active leases: ${error.message}`);
  }

  return result;
}
