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

    handleEdit(selectedUser.user_ID);
  }

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-lg">No users found</p>
        </div>
      ) : (
        accounts.map((user, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">User ID</p>
                  <p className="text-sm text-gray-500">{user.user_ID ? user.user_ID.slice(0, 5) + "..." : "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-500 break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Created</p>
                  <p className="text-sm text-gray-500">
                    {user.dateCreated
                      ? new Date(user.dateCreated.seconds * 1000).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="md"
                  variant="filled"
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  onClick={() => handleData({ user })}
                >
                  Edit User
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
