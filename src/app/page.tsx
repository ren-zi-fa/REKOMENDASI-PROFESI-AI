"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import TextareaAutosize from "react-textarea-autosize";
import { Send, Copy, Check, Bot, User, Briefcase, PlusCircle, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassificationResult } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  parsedData?: ClassificationResult | null;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: uuidv4(), title: "Sesi Baru", messages: [] },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    // Cek apakah jarak scroll dari bawah kurang dari 150px
    const isBottom = div.scrollHeight - div.scrollTop - div.clientHeight < 150;
    isAtBottomRef.current = isBottom;
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [activeSession.messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createNewSession = () => {
    const newSession = { id: uuidv4(), title: "Sesi Baru", messages: [] };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const updateSessionMessages = (sessionId: string, updater: (msgs: Message[]) => Message[]) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const newMessages = updater(session.messages);
          let title = session.title;
          if (title === "Sesi Baru" && newMessages.length > 0 && newMessages[0].role === "user") {
            title = newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? "..." : "");
          }
          return { ...session, messages: newMessages, title };
        }
        return session;
      })
    );
  };

  const parseClaudeOutput = (content: string): ClassificationResult | null => {
    try {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: uuidv4(), role: "user", content: input.trim() };
    const assistantMessageId = uuidv4();
    
    updateSessionMessages(activeSessionId, (msgs) => [...msgs, userMessage, { id: assistantMessageId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    // Paksa auto scroll ke bawah saat mengirim pesan baru
    isAtBottomRef.current = true;
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...activeSession.messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          
          updateSessionMessages(activeSessionId, (msgs) => 
            msgs.map((m) => 
              m.id === assistantMessageId 
                ? { ...m, content: accumulatedText, parsedData: parseClaudeOutput(accumulatedText) } 
                : m
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      updateSessionMessages(activeSessionId, (msgs) => 
        msgs.map((m) => 
          m.id === assistantMessageId 
            ? { ...m, content: "Maaf, terjadi kesalahan. Silakan coba lagi." } 
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden text-foreground">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-72 flex-col bg-card/50 backdrop-blur-md border-r border-border/50 shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Briefcase className="w-5 h-5" />
            <span>ProfesiAI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={createNewSession} className="text-muted-foreground hover:text-primary transition-colors">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-3 space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all duration-200",
                  activeSessionId === session.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-dvh bg-background">
        {/* Header Mobile */}
        <div className="md:hidden p-4 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Briefcase className="w-5 h-5" />
            <span>ProfesiAI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={createNewSession}>
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Messages Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto min-h-0 px-4 md:px-8 py-6"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            {activeSession.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
                  <Briefcase className="w-10 h-10 text-primary relative z-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Klasifikasi Profesi AI</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Masukkan nama pekerjaan atau deskripsi pekerjaan dalam bahasa Indonesia atau Inggris untuk mendapatkan kode profesi yang sesuai.
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center mt-4">
                  {["software developer", "barista", "buruh bangunan", "pemilik warung sarapan"].map((example) => (
                    <Button 
                      key={example} 
                      variant="outline" 
                      className="rounded-full bg-background/50 hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
                      onClick={() => setInput(example)}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              activeSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-primary/20 ring-2 ring-primary/10 shrink-0 mt-1">
                      <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary">
                        <Bot className="w-5 h-5" />
                      </div>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "relative group max-w-[85%] md:max-w-[75%]",
                    message.role === "user" ? "order-1" : "order-2"
                  )}>
                    {message.role === "user" ? (
                      <div className="bg-primary text-primary-foreground px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm text-sm md:text-base leading-relaxed">
                        {message.content}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {message.parsedData ? (
                          <Card className="p-5 md:p-6 rounded-2xl rounded-tl-sm bg-card/80 backdrop-blur border-border/50 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Kode Profesi</div>
                                <div className="text-3xl font-bold text-primary">{message.parsedData.kode}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Keyakinan</div>
                                <div className="text-lg font-semibold">{(message.parsedData.confidence * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Nama Profesi</div>
                              <div className="text-xl font-semibold">{message.parsedData.profesi}</div>
                            </div>
                            <div className="pt-4 border-t border-border/50">
                              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Alasan</div>
                              <div className="text-sm md:text-base leading-relaxed text-muted-foreground">{message.parsedData.reason}</div>
                            </div>
                          </Card>
                        ) : (
                          <div className="bg-secondary/50 text-secondary-foreground px-5 py-3.5 rounded-2xl rounded-tl-sm text-sm md:text-base leading-relaxed font-mono overflow-x-auto border border-border/50 shadow-sm">
                            {message.content || (
                              <div className="flex items-center gap-1.5 h-6">
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {message.content && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 mt-2 ml-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => handleCopy(message.content, message.id)}
                            >
                              {copiedId === message.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8 md:w-10 md:h-10 shrink-0 mt-1 order-2">
                      <div className="bg-secondary w-full h-full flex items-center justify-center text-secondary-foreground">
                        <User className="w-5 h-5" />
                      </div>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="shrink-0 bg-background border-t border-border/30 p-4 pb-6 md:pb-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end gap-2 bg-card/80 backdrop-blur-xl border border-border/50 shadow-sm focus-within:shadow-md rounded-3xl p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50"
            >
              <TextareaAutosize
                minRows={1}
                maxRows={5}
                placeholder="Ketik deskripsi pekerjaan di sini..."
                className="w-full resize-none bg-transparent px-4 py-3 text-sm md:text-base outline-none placeholder:text-muted-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="shrink-0 rounded-full w-10 h-10 mb-1 mr-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="text-center mt-3 text-xs text-muted-foreground/70">
              AI dapat membuat kesalahan. Harap verifikasi kode profesi dengan referensi asli @Renzifebriandika
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
