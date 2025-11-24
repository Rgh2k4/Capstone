import { Button, PasswordInput, Select } from "@mantine/core";
import { Input } from "postcss";
import { useEffect, useState } from "react";

function Add({ onClose, users, onPromoteAccount }) {
  const [accounts, setAccounts] = useState(null);
  const [submited, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function handlePromoteToAdmin() {
    //console.log("Selected User to Promote:", selectedUser);
    setSubmitted(true);
    onPromoteAccount(selectedUser);
    setSubmitted(false);
    onClose();
    alert(`Added user "${selectedUser}" as Admin`);
  }

  useEffect(() => {
    setAccounts(users.map((user) => ({label: user.email, value: user.user_ID})));

  }, []);

  //console.log("add_window Accounts:", accounts);


  return (
    <div className=" p-24 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center text-4xl font-bold">
        <p>Add Admin</p>
      </div>
      <div className="flex flex-col space-y-6">
        <Select
          label="Select User to Promote"
          placeholder="Pick user"
          autoSelectOnBlur
          searchable
          data={accounts}
          onChange={(account) => setSelectedUser(account)}
        />
      </div>
      <div>
        <Button
          className="w-full"
          size="lg"
          variant="outline"
          color="green"
          loading={submited}
          onClick={handlePromoteToAdmin}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default Add;
