/**
 * Topic.DJ_CHANNELS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (4), djangoGapFillQuestions.ts (1)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_channels_questions: Question[] = [
  {
      id: 'be-infra-channels-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'What are Django Channels and when do you need them?',
      options: [
        { id: 'a', text: 'An extension that lets Django speak WebSockets and other async protocols — needed for chat, live notifications, and live dashboards', isCorrect: true },
        { id: 'b', text: 'A replacement for Django REST Framework that builds faster JSON APIs using async views instead of serializers', isCorrect: false },
        { id: 'c', text: 'A horizontal-scaling layer that only becomes worthwhile once an application passes ten thousand concurrent users', isCorrect: false },
        { id: 'd', text: 'Django\'s built-in background task queue — a bundled alternative to Celery for running jobs outside the request cycle', isCorrect: false },
      ],
      explanation: 'Standard Django follows the request/response pattern: client sends request, server processes it, server returns response, connection closes. WebSockets maintain a persistent connection — the server can push data to the client at any time. Django Channels replaces Django\'s HTTP-only server with an ASGI server (like Daphne or Uvicorn) that handles both HTTP and WebSocket protocols. Consumers (similar to views) handle WebSocket events: connect, receive message, disconnect. This enables real-time features without polling.',
      tags: ['channels', 'websockets', 'asgi', 'real-time'],
      concepts: ['inf-wsgi-vs-asgi'],
    },
  {
      id: 'be-infra-channels-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Django Channels WebSocket consumer for a chat room. Create an AsyncWebSocketConsumer with connect, disconnect, and receive methods. Users should join a room group on connect, leave on disconnect, and broadcast messages to all room members. Show the consumer and routing.py with URLRouter.',
      starterCode: `# consumers.py and routing.py
# Write the WebSocket consumer and URL routing
`,
      testCases: [
        {
          input: 'Chat consumer and routing',
          expectedOutput: 'AsyncWebSocketConsumer with group_add, group_discard, group_send',
          description: 'Should implement a WebSocket chat consumer with room groups',
        },
      ],
      solution: `# consumers.py
import json
from channels.generic.websocket import AsyncWebSocketConsumer


class ChatConsumer(AsyncWebSocketConsumer):
    async def connect(self):
        # Get room name from URL route
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        # Accept the WebSocket connection
        await self.accept()

        # Notify room that user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": f"A user has joined the room.",
                "sender": "system",
            },
        )

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        # Parse incoming message
        data = json.loads(text_data)
        message = data["message"]
        sender = data.get("sender", "anonymous")

        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": message,
                "sender": sender,
            },
        )

    async def chat_message(self, event):
        # Send message to WebSocket client
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))


# routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\\w+)/$", consumers.ChatConsumer.as_asgi()),
]


# asgi.py (project-level)
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat import routing

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(routing.websocket_urlpatterns)
    ),
})`,
      explanation: 'The consumer lifecycle mirrors WebSocket events: connect() is called when a client opens a connection, receive() when they send a message, and disconnect() when they leave. channel_layer.group_add() subscribes this consumer to a named group (the chat room). group_send() broadcasts a message to all consumers in that group. The "type" field in group_send maps to a method name: "chat.message" calls chat_message() on each consumer. This decoupling means the sender does not need to know about individual recipients. AuthMiddlewareStack adds the user to self.scope so you can access the authenticated user.',
      hints: [
        'self.scope["url_route"]["kwargs"] gives URL parameters like views',
        'group_send "type" maps to a method: "chat.message" → chat_message()',
        'self.channel_name is unique per connection — assigned by Channels',
        'AuthMiddlewareStack adds self.scope["user"] for authentication',
      ],
      tags: ['channels', 'websocket', 'consumer', 'chat', 'async'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'be-infra-channels-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'What is the Channels layer (channel_layers) and what role does Redis play?',
      options: [
        { id: 'a', text: 'The channel layer is Django\'s database connection pool, and Redis stores the pooled connections between requests', isCorrect: false },
        { id: 'b', text: 'Redis only accelerates caching — group messaging across multiple Daphne workers works fine on the in-memory layer', isCorrect: false },
        { id: 'c', text: 'A message-passing system between consumers — the Redis backend routes group messages across processes, where the in-memory layer cannot', isCorrect: true },
        { id: 'd', text: 'Channel layers supersede Django signals, and Redis persists every dispatched signal for replay after a crash', isCorrect: false },
      ],
      explanation: 'When you call group_send(), the message needs to reach all consumers in that group — even if they are connected to different server processes. The channel layer is the transport mechanism. InMemoryChannelLayer only works within one process (fine for development). RedisChannelLayer uses Redis pub/sub to route messages between processes and even between different servers. Without Redis, if user A connects to process 1 and user B connects to process 2, they cannot communicate. Redis acts as the central message broker that connects all processes.',
      tags: ['channels', 'channel-layer', 'redis', 'message-passing'],
      concepts: ['dj-channels-realtime', 'dj-caching'],
    },
  {
      id: 'be-infra-channels-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'What is the difference between WebSockets, Server-Sent Events (SSE), and Long Polling?',
      options: [
        { id: 'a', text: 'All three are wire-identical — browsers simply expose the same underlying TCP stream under three different JavaScript APIs', isCorrect: false },
        { id: 'b', text: 'Long polling is the modern successor to WebSockets, replacing them since HTTP/2 because persistent sockets cannot multiplex', isCorrect: false },
        { id: 'c', text: 'SSE is faster than WebSocket in every scenario because it skips the HTTP upgrade handshake and writes straight to the TCP socket', isCorrect: false },
        { id: 'd', text: 'WebSocket is full-duplex; SSE streams server-to-client only with auto-reconnect; long polling holds an HTTP request open until data arrives', isCorrect: true },
      ],
      explanation: 'WebSockets establish a persistent TCP connection where both sides can send messages independently — ideal for chat, gaming, collaborative editing where bidirectional communication is needed. SSE uses a standard HTTP connection where the server streams events to the client — simpler than WebSockets, built-in reconnection, works through most proxies, but one-direction only. Perfect for live feeds, notifications, stock tickers. Long polling is the oldest technique: the client makes an HTTP request, the server holds it until data is available, responds, and the client immediately makes another request. It works everywhere but has higher latency and overhead.',
      tags: ['websocket', 'sse', 'long-polling', 'real-time', 'protocols'],
      concepts: ['dj-channels-realtime'],
    },
  {
      id: 'dj-channels-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'What are WebSockets and when do you need them?\n\nNormal HTTP works like this: the client sends a request, the server sends a response, and the connection closes. But what if the server needs to send data to the client without the client asking?',
      options: [
        {
          id: 'a',
          text: 'A newer version of HTTP that loads pages faster and is gradually replacing REST APIs in modern browsers',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A protocol for persistent two-way communication — unlike HTTP\'s request-then-response cycle, either side can send a message at any time',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'A database replication protocol that keeps data synchronized between multiple servers in real time',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'A browser API for opening raw TCP sockets from JavaScript so pages can talk to any server directly',
          isCorrect: false,
        },
      ],
      explanation: 'HTTP is one-directional per exchange: client requests, server responds, done. If you want the server to push updates (new chat message, stock price change, notification), the client would have to keep polling ("any updates? any updates?"). WebSockets solve this by establishing a persistent, bidirectional connection — both client and server can send messages at any time without the overhead of new HTTP requests. Django Channels is the package that adds WebSocket support to Django, extending it beyond traditional HTTP.',
      hints: [
        'HTTP = client always initiates. WebSocket = either side can send anytime.',
        'Django Channels extends Django to handle WebSocket connections alongside HTTP',
      ],
      tags: ['django', 'channels', 'websockets', 'real-time', 'basics'],
      concepts: ['dj-channels-realtime'],
    },
];
