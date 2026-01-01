"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { TextAreaField } from "@/components/ui/textarea";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { useDatasets } from "@/contexts/dataset-context";
import type { CustomDataParts, DatasetsDataPart } from "@momentum/schemas/ai";
import type { TextUIPart } from "ai";

export default function Home() {
  const { messages, sendMessage, status, stop, error } = useChat<
    UIMessage<unknown, CustomDataParts>
  >({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const { selectedDatasets } = useDatasets();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      // Build message parts including text and datasets data part
      const parts: Array<TextUIPart | DatasetsDataPart> = [{ type: "text", text: input }];

      // Add datasets data part if any are selected
      if (selectedDatasets.length > 0) {
        parts.push({
          type: "data-datasets",
          data: { datasets: selectedDatasets },
        });
      }

      sendMessage({ parts });
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full flex-col overflow-hidden bg-base-200">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4" role="list" aria-label="Chat messages">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-base-content/50">
              <p>Start a conversation by sending a message below.</p>
            </div>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <ChatBubble key={message.id} placement="end" color="primary" header="You">
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <span key={index} className="whitespace-pre-wrap">
                        {part.text.trim()}
                      </span>
                    );
                  }
                  return null;
                })}
              </ChatBubble>
            ) : (
              <div key={message.id} className="max-w-none">
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <Streamdown
                        key={index}
                        isAnimating={status === "streaming"}
                        controls={{ table: false }}
                      >
                        {part.text.trim()}
                      </Streamdown>
                    );
                  }
                  if (part.type === "reasoning") {
                    return (
                      <details key={index} className="collapse collapse-arrow bg-base-200/50 my-2">
                        <summary className="collapse-title text-sm">Reasoning</summary>
                        <div className="collapse-content">
                          <Streamdown isAnimating={status === "streaming"}>
                            {part.text.trim()}
                          </Streamdown>
                        </div>
                      </details>
                    );
                  }
                  return null;
                })}
              </div>
            ),
          )}

          {status === "submitted" && (
            <div className="max-w-none">
              <span className="loading loading-dots loading-sm" />
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>An error occurred. Please try again.</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input form */}
      <div className="border-t border-base-300 bg-base-100 p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
          <TextAreaField
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1"
            textAreaClassName="w-full"
            minRows={1}
            maxRows={10}
            isDisabled={isLoading}
            aria-label="Message input"
          />
          {isLoading ? (
            <Button type="button" variant="secondary" onPress={stop}>
              Stop
            </Button>
          ) : (
            <Button type="submit" isDisabled={!input.trim()}>
              Send
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
