"use client";

import { CreditCard } from "lucide-react";
import { formatCurrency } from "~/lib/utils";

interface LeaseFinancialCardProps {
  rentAmount: number;
  cautionDeposit?: number;
  agencyFee?: number;
  legalFee?: number;
}

export function LeaseFinancialCard({
  rentAmount,
  cautionDeposit = 0,
  agencyFee = 0,
  legalFee = 0,
}: LeaseFinancialCardProps) {
  const totalAmount = rentAmount + cautionDeposit + agencyFee + legalFee;
  const fees = [
    { label: "Caution Fee", amount: cautionDeposit },
    { label: "Agency Fee", amount: agencyFee },
    { label: "Legal Fee", amount: legalFee },
  ].filter((fee) => fee.amount > 0);

  return (
    <div className="bg-[#1A1A1A] text-white p-6 rounded-sm shadow-sm space-y-6">
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
          Financial Summary
        </p>
        <div className="flex justify-between items-end">
          <h3 className="text-3xl font-light tracking-tight text-white">
            {formatCurrency(rentAmount)}
            <span className="text-base text-white/40 font-normal ml-1">
              /yr
            </span>
          </h3>
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 mb-1">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex justify-between text-xs text-white/60">
          <span>Base Rent</span>
          <span className="text-white font-medium">
            {formatCurrency(rentAmount)}
          </span>
        </div>
        {fees.map((fee) => (
          <div
            key={fee.label}
            className="flex justify-between text-xs text-white/60"
          >
            <span>{fee.label}</span>
            <span className="text-white font-medium">
              {formatCurrency(fee.amount)}
            </span>
          </div>
        ))}

        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
          <span className="text-xs uppercase tracking-wide self-center text-white/60 font-normal">
            Total Initial
          </span>
          <span className="text-emerald-400">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
