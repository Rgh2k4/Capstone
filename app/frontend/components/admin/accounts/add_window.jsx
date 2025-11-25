import { Button, Select } from "@mantine/core";
import { useEffect, useState } from "react";

function Add({ onClose, users, onPromoteAccount }) {
  const [accounts, setAccounts] = useState(null);
  const [submited, setSubmitted] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  function handlePromoteToAdmin() {
    if (!selectedUser) {
      alert("Please select a user to promote");
      return;
    }

    setSubmitted(true);
    onPromoteAccount(selectedUser);
    setSubmitted(false);
    onClose();
    alert(`Added user "${selectedUser}" as Admin`);
  }

  useEffect(() => {
    setAccounts(users.map((user) => ({ label: user.email, value: user.user_ID })));
  }, []);

  return (
    <div className=" overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-500 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Promote to Admin</h2>
          <p className="text-purple-100">Select a user to promote to administrator</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">User Selection</h3>
            </div>
            <Select
              label="Choose User to Promote"
              placeholder="Search and select a user..."
              size="md"
              searchable
              data={accounts}
              value={selectedUser}
              onChange={setSelectedUser}
              styles={{
                input: {
                  backgroundColor: "white",
                  border: "2px solid #e5e7eb",
                  "&:focus": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Promoted users will have full administrative privileges including the ability to manage reviews, reports, and other user accounts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
            disabled={submited}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="filled"
            color="purple"
            className="flex-1 bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            loading={submited}
            onClick={handlePromoteToAdmin}
            leftSection={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Promote to Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Add;
