import { Button } from "@mantine/core";
import AdminList from "./admin_list";
import UserList from "./user_list";

function AccountList({ setShowModalEdit, setShowModalAdd, sendUser, users, admins }) {
  const handlePromote = () => {
    setShowModalAdd(true);
  };

  const handleEdit = (account) => {
    //console.log("Data Recieved:");
    //console.log(account);
    sendUser(account);
    setShowModalEdit(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Account Management</h2>
          <Button 
            size="md" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handlePromote(users)}
            leftSection={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Promote User
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 overflow-hidden">
        <section className="border-r border-gray-200 flex flex-col">
          <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Users ({users.length})</h3>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <UserList handleEdit={handleEdit} data={users} />
          </div>
        </section>

        <section className="flex flex-col">
          <div className="bg-purple-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Administrators ({admins.length})</h3>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <AdminList handleEdit={handleEdit} data={admins} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AccountList;
