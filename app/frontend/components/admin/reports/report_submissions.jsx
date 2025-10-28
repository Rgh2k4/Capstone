import { Button } from "@mantine/core";

function ReportSubmissions({ handleReport, reports }) {
  function handleData({ rep }) {
    console.log("Data:");
    console.log(rep);

    handleReport(rep);
  }
  return (
    <ul>
      {reports.map((rep, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-4 gap-4 m-4">
            <p className=" mt-6 mr-8 font-bold text-1xl">{rep.uid ? rep.uid.slice(0,5) + "...": "N/A"}</p>
            <p className=" mt-6 mr-8 font-semibold text-2xl">{rep.displayName || "Anonymous"}</p>
            <p className=" mt-6 mr-8 text-1xl">Submited: {/*rep.date*/}</p>
            <Button
              className="w-full"
              size="lg"
              variant="filled"
              onClick={() => handleData({ rep })}
            >
              Review
            </Button>
          </div>
        </div>
      ))}
    </ul>
  );
}

export default ReportSubmissions;
