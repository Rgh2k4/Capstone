import { Button } from "@mantine/core";

export default function AdminList({ handleEdit, data }) {
  const accounts = data;

  function handleData({ admin }) {
    console.log("Data:");
    console.log(admin);

    handleEdit(admin);
  }

  return (
    <ul>
      {accounts.map((admin, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-4 gap-4 m-4">
            <p className=" mt-6 mr-8 font-bold text-1xl">{admin.user_ID ? admin.user_ID.slice(0,5) + "...": "N/A"}</p>
            <p className=" mt-6 mr-8 font-semibold text-1xl wrap-anywhere">
              {admin.email}
            </p>
            <p className=" mt-6 mr-8 text-1xl">
              Created:{" "}
              {admin.dateCreated
                ? new Date(
                    admin.dateCreated.seconds * 1000
                  ).toLocaleDateString()
                : "Unknown"}
            </p>
            <Button
              className="w-full"
              size="lg"
              variant="filled"
              onClick={() => handleData({ admin })}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </ul>
  );
}
