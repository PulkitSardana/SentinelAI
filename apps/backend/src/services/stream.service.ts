import { Response } from 'express';
import { EventEmitter } from 'events';
import { logger } from '@/utils/logger';

class StreamService extends EventEmitter {
  private clients: Set<Response> = new Set();
  private static instance: StreamService;

  private constructor() {
    super();
    // Increase max listeners to prevent memory leak warnings if many clients connect
    this.setMaxListeners(100);

    // Heartbeat mechanism to prevent memory leaks from stale TCP connections
    setInterval(() => {
      this.broadcast('ping', { timestamp: new Date().toISOString() });
    }, 15000);
  }

  public static getInstance(): StreamService {
    if (!StreamService.instance) {
      StreamService.instance = new StreamService();
    }
    return StreamService.instance;
  }

  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Adds a new client response object to the broadcast pool.
   */
  public addClient(res: Response): void {
    this.clients.add(res);
    logger.info(`New SSE client connected. Total clients: ${this.clients.size}`);
    
    // Send an initial connection success event
    this.sendToClient(res, 'connection', { message: 'Connected to SentinelAI Stream' });

    res.on('close', () => {
      this.clients.delete(res);
      logger.info(`SSE client disconnected. Total clients: ${this.clients.size}`);
    });
  }

  /**
   * Broadcasts an event to all connected clients.
   */
  public broadcast(event: string, data: any): void {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      client.write(payload);
    }
  }

  /**
   * Sends an event to a specific client.
   */
  private sendToClient(client: Response, event: string, data: any): void {
    client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
}

export const streamService = StreamService.getInstance();
