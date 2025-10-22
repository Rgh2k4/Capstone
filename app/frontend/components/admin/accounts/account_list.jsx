import AdminList from "./admin_list";
import UserList from "./user_list";
import { AdminEditUser } from "@/app/backend/database";
import { Modal, Select, Button } from "@mantine/core";

function AccountList({ setShowModalEdit, setShowModalAdd, setRole, sendUser, users, admins }) {
  const handleAdd = (role) => {
    setRole(role);
    setShowModalAdd(true);
  };

  const handleEdit = (account) => {
    console.log("Data Recieved:");
    console.log(account);
    sendUser(account);
    setShowModalEdit(true);
  };

const [promoteOpen, setPromoteOpen] = useState(false);
const [promoteTargetUid, setPromoteTargetUid] = useState(null);

async function handlePromoteConfirm() {
  const target = userAccounts.find(u => u.user_ID === promoteTargetUid);
  if (!target) return;

  await AdminEditUser({
    oldData: { user_ID: target.user_ID, email: target.email },
    newData: { role: "Admin" },
  });

  setPromoteOpen(false);
  setPromoteTargetUid(null);
}


  return (
    <>
      <div className="flex flex-row space-x-4 h-screen ">
        <section className="overflow-y-auto bg-gray-100 drop-shadow-md drop-shadow-gray-400">
          <div className="flex flex-row justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 drop-shadow-sm drop-shadow-gray-400 space-x-8">
            <p className="mt-6">Users</p>
            <button className="plus-button" onClick={() => handleAdd("user")}>
              +
            </button>
          </div>
          <div className="rounded-b-lg p-4 overflow-y-auto">
            <UserList handleEdit={handleEdit} data={users}  />
          </div>
        </section>

        <section className="overflow-y-auto bg-gray-100 drop-shadow-md drop-shadow-gray-400">
          <div className="flex flex-row justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 drop-shadow-sm drop-shadow-gray-400 space-x-8">
            <p className="mt-6">Admins</p>
            <button className="plus-button" onClick={() => setPromoteOpen(true)}>
              +
            </button>
          </div>
          <div className="rounded-b-lg p-4 overflow-y-auto">
            <AdminList handleEdit={handleEdit} data={admins} />
          </div>
        </section>
        <Modal
        opened={promoteOpen}
        onClose={() => setPromoteOpen(false)}
        title="Promote user to Admin"
        centered
      >
        <Select
          label="Choose a user"
          placeholder="Select a user to promote"
          data={userAccounts.map(u => ({ value: u.user_ID, label: u.email }))}
          value={promoteTargetUid}
          onChange={setPromoteTargetUid}
          searchable
          nothingFoundMessage="No users found"
        />
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="default" onClick={() => setPromoteOpen(false)}>Cancel</Button>
          <Button disabled={!promoteTargetUid} onClick={handlePromoteConfirm}>Promote</Button>
        </div>
      </Modal>
      </div>
    </>
  );
}

export default AccountList;
