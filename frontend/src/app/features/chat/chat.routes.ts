import { Routes } from '@angular/router';
import { ChatBotComponent } from './chat-bot/chat-bot.component';

export const chatRoutes: Routes = [
  {
    path: '',
    component: ChatBotComponent,
    title: 'AI Chat Assistant'
  }
];
