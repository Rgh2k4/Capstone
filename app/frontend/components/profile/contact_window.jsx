"use client";

import { Button, Input, Select, Textarea } from "@mantine/core";
import { useState } from "react";

export default function ContactWindow({
  companyEmail = "support@nationalparks.com",
  companyPhone = "(555) 123-4567",
  onClose
 }) {
  const [submited, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email] = useState("<your_email@example.com>");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  

  function handleEmail(e) {
    e.preventDefault();
    if (!name.trim() || !reason || !message.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    // Simulate sending
    setTimeout(() => {
      alert("Message sent successfully! We'll get back to you soon.");
      onClose();
    }, 1000);
  }

  return (
    <div className="overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Contact Support</h2>
          <p className="text-green-100">We're here to help! Send us your questions or feedback.</p>
        </div>
      </div>

      <div className="p-8">
        <form className="space-y-6" onSubmit={handleEmail}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input.Wrapper size="md" label="Full Name" required>
              <Input
                disabled={submited}
                size="md"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                leftSection={
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                }
              />
            </Input.Wrapper>
            
            <Input.Wrapper size="md" label="Email Address">
              <Input
                disabled
                size="md"
                value={email}
                leftSection={
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
            </Input.Wrapper>
          </div>

          <Select
            label="Reason for Contact"
            placeholder="Please select a reason"
            size="md"
            required
            data={[
              { value: "technical", label: "Technical Support" },
              { value: "general", label: "General Inquiry" },
              { value: "feedback", label: "Feedback & Suggestions" },
              { value: "billing", label: "Billing Question" },
              { value: "bug", label: "Report a Bug" },
              { value: "other", label: "Other" }
            ]}
            value={reason}
            onChange={setReason}
            leftSection={
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            }
          />

          <Textarea
            label="Message"
            description="Please provide detailed information about your inquiry"
            placeholder="Describe your question or issue in detail..."
            minRows={5}
            maxRows={8}
            required
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />

          <Button
            size="lg"
            type="submit"
            loading={submited}
            variant="filled"
            fullWidth
            className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
            leftSection={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            }
          >
            Send Message
          </Button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Alternative Contact Methods
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-blue-700 font-medium">{companyEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-green-700 font-medium">{companyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
