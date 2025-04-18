import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/contexts/DataContext";

function Messages() {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch messages for the logged-in user
      axios
        .get("http://127.0.0.1:8000/api/accounts/messages/list", {
          headers: {
            Authorization: `Token ${token}`, // Add token in Authorization header
          },
        })
        .then((response) => {
          console.log(response.data); // Check the API response
          setMessages(response.data); // Set messages state with API data
        })
        .catch((err) => {
          console.error("Error fetching messages", err);
        });
    }
  }, [isAuthenticated, token]);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="bg-background p-6 min-h-screen mt-40">
      <div className="container-custom">
        <h1 className="text-2xl font-semibold text-primary mb-4">Messages</h1>

        {/* Sidebar for list of messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="col-span-1 lg:col-span-1 bg-white rounded-lg shadow-lg p-4">
            <h2 className="font-semibold text-lg text-muted mb-4">Inbox</h2>
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.username}
                    className="cursor-pointer border-b py-2 hover:bg-muted rounded-md"
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-primary">{message.username}</span>
                      <span className="text-sm text-foreground/70">{message.email}</span>
                    </div>
                    <div className="text-sm text-muted">{message.message}</div>
                  </div>
                ))
              ) : (
                <p>No messages available.</p>
              )}
            </div>
          </div>

          {/* Selected Message */}
          <div className="col-span-2 lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {selectedMessage ? (
              <>
                <h2 className="font-semibold text-xl text-primary mb-4">
                  Message from {selectedMessage.username}
                </h2>
                <div className="mb-4">
                  <span className="font-medium text-muted">Email: </span>
                  <span className="text-primary">{selectedMessage.email}</span>
                </div>
                <div className="text-sm text-foreground/80">{selectedMessage.message}</div>
                {/* Optional Reply Section */}
                <div className="mt-6">
                  <textarea
                    placeholder="Write your reply..."
                    className="w-full p-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={4}
                  ></textarea>
                  <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md ">
                    <p>Send Reply</p>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-muted">Select a message to read.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
