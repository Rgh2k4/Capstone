import { Button } from "@mantine/core";

export default function UserList({ handleEdit, data }) {
  const accounts = data;

  function handleData({ user }) {
    const selectedUser = {
      displayName: user.displayName,
      email: user.email,
      user_ID: user.user_ID,
      dateCreated: user.dateCreated
        ? new Date(user.dateCreated.seconds * 1000).toLocaleDateString()
        : "Unknown",
      lastLogin: user.lastLogin
        ? new Date(user.lastLogin.seconds * 1000).toLocaleDateString()
        : "Never",
      note: user.note ? user.note : "",
    };

    handleEdit(selectedUser);
  }

  return (
    <ul>
      {accounts.map((user, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-4 gap-4 m-4">
            <p className=" mt-6 mr-8 font-bold text-1xl">
              {user.user_ID ? user.user_ID.slice(0, 5) + "..." : "N/A"}
            </p>
            <p className=" mt-6 mr-8 font-semibold text-1xl wrap-anywhere">
              {user.email}
            </p>
            <p className=" mt-6 mr-8 text-1xl">
              Created:{" "}
              {user.dateCreated
                ? new Date(user.dateCreated.seconds * 1000).toLocaleDateString()
                : "Unknown"}
            </p>
            <Button
              className="w-full"
              size="lg"
              variant="filled"
              onClick={() => handleData({ user })}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </ul>
  );
}
