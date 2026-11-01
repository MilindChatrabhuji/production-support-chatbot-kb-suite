/**
 * Omnichannel Dialogue Manager & State Machine
 * Orchestrates multi-turn conversation memory, human escalation, and CSAT triggers.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'human_agent';
  content: string;
  timestamp: string;
  citations?: Array<{ title: string; chunkId: string }>;
}

export interface ConversationSession {
  sessionId: string;
  channel: 'web_chat' | 'zendesk' | 'freshdesk' | 'gorgias';
  userId: string;
  status: 'active_bot' | 'escalated_human' | 'resolved' | 'abandoned';
  messages: ChatMessage[];
  turnCount: number;
  deflected: boolean;
  csatRating?: number; // 1 to 5
}

export class OmnichannelDialogueManager {
  private sessions: Map<string, ConversationSession> = new Map();

  public createSession(sessionId: string, channel: ConversationSession['channel'], userId: string): ConversationSession {
    const session: ConversationSession = {
      sessionId,
      channel,
      userId,
      status: 'active_bot',
      messages: [],
      turnCount: 0,
      deflected: true
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  public getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }

  public addMessage(sessionId: string, role: ChatMessage['role'], content: string, citations?: ChatMessage['citations']): ConversationSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found.`);

    session.messages.push({
      role,
      content,
      timestamp: new Date().toISOString(),
      citations
    });

    if (role === 'user') {
      session.turnCount += 1;
    }

    return session;
  }

  public escalateToHuman(sessionId: string, reason: string): ConversationSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found.`);

    session.status = 'escalated_human';
    session.deflected = false;
    session.messages.push({
      role: 'system',
      content: `[SYSTEM ESCALATION]: Conversation transferred to live human agent. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    });

    return session;
  }

  public resolveSession(sessionId: string, csatScore?: number): ConversationSession {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found.`);

    session.status = 'resolved';
    if (csatScore !== undefined) {
      session.csatRating = Math.max(1, Math.min(5, csatScore));
    }
    return session;
  }
}
