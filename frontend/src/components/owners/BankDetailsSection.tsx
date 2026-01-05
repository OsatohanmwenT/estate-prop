"use client";

interface BankDetailsSectionProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
  errors?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

export default function BankDetailsSection({
  bankName,
  accountNumber,
  accountName,
  onBankNameChange,
  onAccountNumberChange,
  onAccountNameChange,
  errors,
}: BankDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
          Bank Details (Optional)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Add bank account information for receiving payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="bankName"
            className="text-sm font-medium text-slate-700"
          >
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            value={bankName}
            onChange={(e) => onBankNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            placeholder="Enter bank name"
          />
          {errors?.bankName && (
            <p className="text-xs text-red-600">{errors.bankName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="accountNumber"
            className="text-sm font-medium text-slate-700"
          >
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => onAccountNumberChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            placeholder="Enter account number"
          />
          {errors?.accountNumber && (
            <p className="text-xs text-red-600">{errors.accountNumber}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="accountName"
            className="text-sm font-medium text-slate-700"
          >
            Account Name
          </label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => onAccountNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            placeholder="Enter account name"
          />
          {errors?.accountName && (
            <p className="text-xs text-red-600">{errors.accountName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
