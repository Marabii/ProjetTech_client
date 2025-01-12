import FiliereDistributionChart from "./FiliereDistributionChart";
import InternshipByCountryChart from "./InternshipByCountryChart";
import NationalityDistributionChart from "./NationalityDistributionChart";

export default async function StatsPage() {
  const { count } = await (
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stats/total-students`)
  ).json();
  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Tableau de bord des statistiques des étudiants
      </h1>
      {count && <h2>Nombre Total des étudiants: {count}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NationalityDistributionChart />
        <FiliereDistributionChart />
        <InternshipByCountryChart />
      </div>
    </div>
  );
}
