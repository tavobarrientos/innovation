import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ChatMessage, ChatSession, ChatRequest, ChatResponse, AICapabilities } from '../models/chat.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl: string;
  private sessionsSubject = new BehaviorSubject<ChatSession[]>([]);
  private currentSessionSubject = new BehaviorSubject<ChatSession | null>(null);
  private isTypingSubject = new BehaviorSubject<boolean>(false);

  public sessions$ = this.sessionsSubject.asObservable();
  public currentSession$ = this.currentSessionSubject.asObservable();
  public isTyping$ = this.isTypingSubject.asObservable();
  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = `${environment.apiUrl}/chat`;
  }

  /**
   * Send a message to the AI chatbot
   */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    // For now, return a mock response. Replace with actual API call
    return this.mockChatResponse(request).pipe(
      delay(1000) // Simulate network delay
    );
  }

  /**
   * Create a new chat session
   */
  createSession(title?: string): ChatSession {
    const session: ChatSession = {
      id: this.generateId(),
      title: title || `Chat ${new Date().toLocaleString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      isActive: true
    };

    const sessions = this.sessionsSubject.value;
    this.sessionsSubject.next([...sessions, session]);
    this.setCurrentSession(session);
    
    return session;
  }

  /**
   * Set the current active session
   */
  setCurrentSession(session: ChatSession): void {
    this.currentSessionSubject.next(session);
  }

  /**
   * Add a message to the current session
   */
  addMessage(message: ChatMessage): void {
    const currentSession = this.currentSessionSubject.value;
    if (currentSession) {
      currentSession.messages.push(message);
      currentSession.updatedAt = new Date();
      this.updateSession(currentSession);
    }
  }

  /**
   * Update an existing session
   */
  updateSession(session: ChatSession): void {
    const sessions = this.sessionsSubject.value;
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
      this.sessionsSubject.next([...sessions]);
      if (this.currentSessionSubject.value?.id === session.id) {
        this.currentSessionSubject.next(session);
      }
    }
  }

  /**
   * Delete a chat session
   */
  deleteSession(sessionId: string): void {
    const sessions = this.sessionsSubject.value.filter(s => s.id !== sessionId);
    this.sessionsSubject.next(sessions);
    
    if (this.currentSessionSubject.value?.id === sessionId) {
      const newCurrentSession = sessions.length > 0 ? sessions[0] : null;
      this.currentSessionSubject.next(newCurrentSession);
    }
  }

  /**
   * Clear all chat history
   */
  clearAllSessions(): void {
    this.sessionsSubject.next([]);
    this.currentSessionSubject.next(null);
  }

  /**
   * Set typing indicator
   */
  setTyping(isTyping: boolean): void {
    this.isTypingSubject.next(isTyping);
  }

  /**
   * Get AI capabilities
   */
  getCapabilities(): Observable<AICapabilities> {
    return of({
      textGeneration: true,
      codeGeneration: true,
      documentAnalysis: true,
      summarization: true,
      translation: true,
      questionAnswering: true
    });
  }

  /**
   * Mock chat response for development
   */
  private mockChatResponse(request: ChatRequest): Observable<ChatResponse> {
    const responses = [
      "I'm here to help! How can I assist you with your documents today?",
      "That's an interesting question. Let me think about that...",
      "Based on your documents, I can help you with analysis, summaries, or any other questions.",
      "I can help you create, edit, or analyze documents. What would you like to work on?",
      "Here's what I found in your document collection...",
      "Would you like me to help you organize your documents or create new content?",
      "I can assist with document creation, editing, summarization, and much more!",
      "Let me search through your documents to find relevant information...",
      "I'm powered by AI and can help with various document-related tasks. What do you need?",
      "That's a great question! Here's what I can help you with..."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const mockResponse: ChatResponse = {
      message: randomResponse,
      sessionId: request.sessionId || this.generateId(),
      suggestions: [
        "Tell me about my documents",
        "Help me create a new document",
        "Summarize my recent files",
        "Search for specific content"
      ],
      relatedDocuments: []
    };

    return of(mockResponse);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
