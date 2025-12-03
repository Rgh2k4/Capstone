import { Button, PasswordInput } from "@mantine/core";
import { Input } from "postcss";
import { useState } from "react";

function Add({ onClose, role, setRole, onAddAccount }) {
  const [submited, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);

  function handleAdd() {
    if (!email.trim() || !password.trim() || !confirm.trim()) {
      toast("All fields are required!");
      return;
    }
    if (password !== confirm) {
      toast("Passwords do not match!");
      return;
    }

    toast("Account Created!");
    setRole("");
    onClose();
  }

  return (
    <div className=" p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center text-4xl font-bold">
        <p>Add {role}</p>
      </div>
      <div className="flex flex-col space-y-6">
        <Input.Wrapper className="w-full" size="md" label="Enter Email">
          <Input
            disabled={submited}
            size="md"
            name="email"
            type="email"
            placeholder="Enter Email..."
            value={form.email}
            onChange={onChange}
            leftSection={<IconAt size={16} />}
            required
          />
        </Input.Wrapper>
        <Input.Wrapper className="w-full" size="md" label="Enter Password">
          <PasswordInput
            disabled={submited}
            size="md"
            name="password"
            type="password"
            placeholder="Enter Password..."
            value={form.password}
            onChange={onChange}
            visible={visible}
            onVisibilityChange={toggle}
            required
          />
        </Input.Wrapper>
        <Input.Wrapper className="w-full" size="md" label="Enter Password">
          <PasswordInput
            disabled={submited}
            size="md"
            name="confirm"
            type="password"
            placeholder="Confirm Password..."
            value={form.confirm}
            onChange={onChange}
            visible={visible}
            onVisibilityChange={toggle}
            required
          />
        </Input.Wrapper>
      </div>
      <div>
        <Button
          className="w-full"
          size="lg"
          variant="filled"
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default Add;
