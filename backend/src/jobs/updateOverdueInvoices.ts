import invoiceService from "../services/invoice.service";

export interface UpdateOverdueResult {
  updated: number;
  errors: Array<{ invoiceId: string; error: string }>;
}

export async function updateOverdueInvoices(): Promise<UpdateOverdueResult> {
  const result: UpdateOverdueResult = { updated: 0, errors: [] };

  try {
    const overdueInvoices = await invoiceService.updateOverdueInvoices();
    result.updated = overdueInvoices.length;
    console.log(
      `✅ Updated ${overdueInvoices.length} invoices to overdue status`
    );
  } catch (error: any) {
    throw new Error(`Failed to update overdue invoices: ${error.message}`);
  }

  return result;
}
