import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ChatMessageBubble, TypingIndicator } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { buildSystemPrompt, type ChatMessage, type ChatContextState, initialChatContext } from "@/lib/chatContext";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hey! I'm **RetailBot**, your AI shopping assistant. I can help you:\n\n📱 **Search products** — \"Show me phones under ₹50,000\"\n🔍 **Compare products** — \"Compare iPhone 13 vs Samsung S24\"\n🛒 **Place orders** — \"I want to buy the MacBook Air\"\n🚚 **Track orders** — \"Track my order\"\n💡 **Get recommendations** — \"Best headphones for music\"\n\nWhat are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [context, setContext] = useState<ChatContextState>(initialChatContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (input: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const updatedHistory = [...context.conversationHistory, { role: "user" as const, content: input }];

    try {
      const systemPrompt = buildSystemPrompt(products);
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...updatedHistory.slice(-20), // keep last 20 messages for context
      ];

      const resp = await supabase.functions.invoke("chat", {
        body: { messages: apiMessages },
      });

      if (resp.error) throw new Error(resp.error.message);

      // Handle streaming response or plain text
      let assistantContent = "";
      if (typeof resp.data === "string") {
        assistantContent = resp.data;
      } else if (resp.data?.choices) {
        assistantContent = resp.data.choices[0]?.message?.content || "I couldn't process that. Please try again.";
      } else if (resp.data?.error) {
        throw new Error(resp.data.error);
      } else {
        assistantContent = "I couldn't process that. Please try again.";
      }

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setContext(prev => ({
        ...prev,
        conversationHistory: [...updatedHistory, { role: "assistant" as const, content: assistantContent }],
        lastSearchQuery: input,
      }));
    } catch (err: any) {
      console.error("Chat error:", err);
      toast.error(err.message || "Failed to get response");
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll space-y-4 p-4">
        {messages.map(msg => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
