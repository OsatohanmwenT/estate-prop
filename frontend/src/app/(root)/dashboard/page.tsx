import MaxContainer from "~/components/shared/MaxContainer";
import { dashboardService } from "~/services/dashboardService";

const DashboardPage = async () => {

  return (
    <MaxContainer>
      <div className="my-8 text-3xl font-bold">Dashboard</div>
      {/* <DashboardContent initialStats={stats} /> */}
    </MaxContainer>
  );
};

export default DashboardPage;
