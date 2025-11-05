import AdminList from "./admin_list";
import UserList from "./user_list";

function AccountList({ setShowModalEdit, setShowModalAdd, setRole, sendUser, users, admins }) {
  const handleAdd = (role) => {
    setRole(role);
    setShowModalAdd(true);
  };

  const handleEdit = (account) => {
    //console.log("Data Recieved:");
    //console.log(account);
    sendUser(account);
    setShowModalEdit(true);
  };

  return (
    <>
      <div className="flex flex-row space-x-4 h-screen ">
        <section className="overflow-y-auto bg-gray-100 drop-shadow-md drop-shadow-gray-400">
          <div className="flex flex-row justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 drop-shadow-sm drop-shadow-gray-400 space-x-8">
            <p className="mt-6">Users</p>
          </div>
          <div className="rounded-b-lg p-4 overflow-y-auto">
            <UserList handleEdit={handleEdit} data={users}  />
          </div>
        </section>

        <section className="overflow-y-auto bg-gray-100 drop-shadow-md drop-shadow-gray-400">
          <div className="flex flex-row justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 drop-shadow-sm drop-shadow-gray-400 space-x-8">
            <p className="mt-6">Admins</p>
            <button className="plus-button" onClick={() => handleAdd("admin")}>
              +
            </button>
          </div>
          <div className="rounded-b-lg p-4 overflow-y-auto">
            <AdminList handleEdit={handleEdit} data={admins} />
          </div>
        </section>
      </div>
    </>
  );
}

export default AccountList;
