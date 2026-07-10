import Chart from "@/components/Chart";
import { getFetch } from "@/utils/fetch";

export default async function Home() {
  const dataChart = await getFetch("/products");

  return (
    <>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h4 className="fw-bold">داشبورد</h4>
      </div>

      <Chart dataChart={dataChart} />
    </>
  );
}
