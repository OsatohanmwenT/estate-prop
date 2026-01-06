import {
  Building2,
  FileText,
  LineChart,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

const features = [
  {
    title: "Property Management",
    description:
      "Track all your properties, units, and leases in one centralized database.",
    icon: Building2,
  },
  {
    title: "Tenant Portal",
    description:
      "Give tenants a seamless experience with digital lease signing and maintenance requests.",
    icon: Users,
  },
  {
    title: "Financial Reports",
    description:
      "Generate detailed financial reports, track expenses, and monitor portfolio health.",
    icon: LineChart,
  },
  {
    title: "Document Storage",
    description:
      "Securely store and organize leases, contracts, and other important documents.",
    icon: FileText,
  },
  {
    title: "Online Payments",
    description:
      "Automate rent collection and vendor payments with integrated payment processing.",
    icon: Wallet,
  },
  {
    title: "Maintenance Tracking",
    description:
      "Streamline maintenance requests, work orders, and vendor communications.",
    icon: Wrench,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to manage your real estate portfolio efficiently.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <feature.icon className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
