export default function UserList({ handleEdit, data }) {
  let accounts = data.filter((acc) => acc.role !== "user");

  function handleData({ user }) {
    console.log("Data:");
    console.log(user);

    handleEdit(user);
  }

  return (
    <ul>
      {accounts.map((user, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-4 gap-4 m-4">
            <p className=" mt-6 mr-8 font-bold text-1xl">{user.id}</p>
            <p className=" mt-6 mr-8 font-semibold text-2xl wrap-anywhere">
              {user.username}
            </p>
            <p className=" mt-6 mr-8 text-1xl">Created: {user.dateCreated}</p>
            <button onClick={() => handleData({ user })}>Edit</button>
          </div>
        </div>
      ))}
    </ul>
  );
}
