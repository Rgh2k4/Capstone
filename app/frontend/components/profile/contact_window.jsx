"use client";

import { Button, Input, Select, Textarea } from "@mantine/core";
import { useState } from "react";
<div><Toaster/></div>

export default function ContactWindow({
  companyEmail = "place@holder.com",
  companyPhone = "(111) 111-1111",
  onClose
 }) {
  const [submited, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const email = "<your_email@example.com>";
  const [message, setMessage] = useState("");
  

  function handleEmail(e) {
    e.preventDefault();
    toast("Message Sent!");
    onClose();
  }
  return (
    <main className="min-h-[80vh] p-12  flex-col items-center justify-start pt-16">
      <h1 className="text-7xl md:text-8xl font-bold text-black-200 text-shadow-black text-center mb-10">
        Contact Us
      </h1>

      <section className="w-[540px] max-w-[90vw] rounded-2xl">
        <form className="flex flex-col gap-6" onSubmit={(e) => handleEmail(e)}>
          <Input.Wrapper className="w-full" size="md" label="Enter Name">
            <Input
              disabled={submited}
              size="md"
              placeholder="Your name..."
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper className="w-full" size="md" label="Email">
            <Input
              disabled
              size="md"
              value={email}
            />
          </Input.Wrapper>
          <Select
            label="Reason for contacting us"
            placeholder="Pick value"
            data={["Technical Support", "General Inquiry", "Feedback", "Other"]}
          />
          <Textarea
            label="Message"
            description="Please provide more details about your inquiry."
            placeholder="Type your message here..."
            minRows={6}
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
          <Button
            className="w-full"
            size="lg"
            type="submit"
            loading={submited}
            variant="filled"
          >
            Send Message
          </Button>
        </form>
      </section>

      <div className="mt-6 w-[540px] max-w-[90vw] flex flex-col items-center gap-2">
        <div className="w-full rounded-xl bg-white/70 backdrop-blur p-4 text-center shadow">
          <p className="text-gray-700">
            Company Email: <span className="font-semibold">{companyEmail}</span>
          </p>
          <p className="text-gray-700">
            Phone: <span className="font-semibold">{companyPhone}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
