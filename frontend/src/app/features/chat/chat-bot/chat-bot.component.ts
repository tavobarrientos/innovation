import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ChatMessage, ChatSession } from '../models/chat.interface';

@Component({
  selector: 'app-chat-bot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  currentSession: ChatSession | null = null;
  sessions: ChatSession[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  
  private subscriptions = new Subscription();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.chatService.currentSession$.subscribe(session => {
        this.currentSession = session;
      })
    );

    this.subscriptions.add(
      this.chatService.sessions$.subscribe(sessions => {
        this.sessions = sessions;
      })
    );

    this.subscriptions.add(
      this.chatService.isTyping$.subscribe(isTyping => {
        this.isTyping = isTyping;
      })
    );

    // Create initial session if none exists
    if (this.sessions.length === 0) {
      this.startNewChat();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Start a new chat session
   */
  startNewChat(): void {
    const session = this.chatService.createSession();
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      content: "Hello! I'm your AI assistant. I can help you with document management, content creation, analysis, and much more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    this.chatService.addMessage(welcomeMessage);
  }

  /**
   * Send a message
   */
  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentSession) {
      return;
    }

    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    this.chatService.addMessage(userMessage);
    
    const messageContent = this.newMessage;
    this.newMessage = '';
    
    // Show typing indicator
    this.chatService.setTyping(true);

    // Send to AI service
    this.chatService.sendMessage({
      message: messageContent,
      sessionId: this.currentSession.id
    }).subscribe({
      next: (response) => {
        const botMessage: ChatMessage = {
          id: this.generateId(),
          content: response.message,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        
        this.chatService.addMessage(botMessage);
        this.chatService.setTyping(false);
      },
      error: (error) => {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: this.generateId(),
          content: "I'm sorry, I encountered an error. Please try again.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        this.chatService.addMessage(errorMessage);
        this.chatService.setTyping(false);
      }
    });
  }

  /**
   * Handle Enter key press
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Select a chat session
   */
  selectSession(session: ChatSession): void {
    this.chatService.setCurrentSession(session);
  }

  /**
   * Delete a chat session
   */
  deleteSession(session: ChatSession, event: Event): void {
    event.stopPropagation();
    this.chatService.deleteSession(session.id);
  }

  /**
   * Clear all chat history
   */
  clearAllChats(): void {
    if (confirm('Are you sure you want to clear all chat history?')) {
      this.chatService.clearAllSessions();
      this.startNewChat();
    }
  }

  /**
   * Get formatted time
   */
  getFormattedTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
