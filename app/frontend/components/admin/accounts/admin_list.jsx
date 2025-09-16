import data from "../user_test_data.json";

export default function AdminList({ handleEdit }) {
  let accounts = data.accounts.filter((acc) => acc.role !== "admin");

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
            <p className=" mt-6 mr-8 font-bold text-1xl">{admin.id}</p>
            <p className=" mt-6 mr-8 font-semibold text-2xl wrap-anywhere">
              {admin.username}
            </p>
            <p className=" mt-6 mr-8 text-1xl">Created: {admin.dateCreated}</p>
            <button onClick={() => handleData({ admin })}>Edit</button>
          </div>
        </div>
      ))}
    </ul>
  );
}
