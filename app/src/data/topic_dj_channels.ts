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
      explanation: 'Plain Django views follow the request/response pattern: the client sends a request, the server returns a response, and the exchange is over. A WebSocket stays open, so the server can push data to the client at any time. Django Channels is a third-party package that adds this: the project runs under an ASGI server such as Daphne or Uvicorn, `asgi.py` routes `http` to the usual views and `websocket` to consumers, and consumers (the WebSocket version of views) handle connect, receive and disconnect. It is not a REST framework, not a scaling threshold you wait for, and not a task queue (that is Celery\'s job); you add it as soon as a feature needs the server to push.',
      tags: ['channels', 'websockets', 'asgi', 'real-time'],
      concepts: ['inf-wsgi-vs-asgi'],
    },
  {
      id: 'dj-channels-groupsend-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`connect` (not shown) has already set `self.group_name` and joined that group. Fill in the channel-layer call that broadcasts each client message to the whole group, and the name of the handler method that broadcast runs on every member. The "type" key\'s dots become underscores in the method name.',
      template: `class NotificationConsumer(AsyncWebsocketConsumer):
    async def receive(self, text_data):
        await self.channel_layer.___(
            self.group_name,
            {"type": "notify.message", "text": text_data},
        )

    async def ___(self, event):
        await self.send(text_data=event["text"])`,
      blanks: ['group_send', 'notify_message'],
      solution: 'class NotificationConsumer(AsyncWebsocketConsumer):\n    async def receive(self, text_data):\n        await self.channel_layer.group_send(\n            self.group_name,\n            {"type": "notify.message", "text": text_data},\n        )\n\n    async def notify_message(self, event):\n        await self.send(text_data=event["text"])',
      explanation: '`group_send(group_name, event)` hands `event` to the channel layer, which delivers it to every consumer in the group, the sender included. Channels turns the `"type"` value into a method name by replacing dots with underscores, so `"notify.message"` calls `notify_message(self, event)` on each member. That handler is where each member calls `self.send(...)` to write to its own client socket; `receive` itself never sends to the other clients directly.',
      hints: ['Broadcast method on channel_layer', 'Method name = type value with dots replaced by underscores'],
      tags: ['channels', 'websocket', 'group_send', 'cloze'],
      concepts: ['dj-channels-realtime'],
    },
  {
      id: 'be-infra-channels-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a Django Channels chat consumer `ChatConsumer`, a subclass of `AsyncWebsocketConsumer` (from `channels.generic.websocket`). It is routed at `ws/chat/<room_name>/`, so the room name is in `self.scope["url_route"]["kwargs"]["room_name"]`. In `connect`, join the group `chat_<room_name>` (for example `chat_lobby`) and accept the connection. In `disconnect`, leave that group. In `receive`, the client sends JSON text such as `{"message": "hi"}`: broadcast its `message` to the group in an event whose type is `"chat.message"`, with the text under the `"message"` key. Then write the `chat_message` handler that this event runs on every member, which sends `{"message": ...}` back down that member\'s socket as JSON text.',
      starterCode: `import json
from channels.generic.websocket import AsyncWebsocketConsumer

# Write the ChatConsumer WebSocket consumer
`,
      testCases: [
        {
          input: 'Chat consumer',
          expectedOutput: 'AsyncWebsocketConsumer with group_add, group_discard, group_send',
          description: 'Should implement a WebSocket chat consumer with room groups',
        },
      ],
      requires: [
        /\bAsyncWebsocketConsumer\b/,
        /\.group_add\(/,
        /\.group_discard\(/,
        /\.group_send\(/,
        /\.accept\(\s*\)/,
        /["']chat\.message["']/,
        /def\s+chat_message\s*\(/,
      ],
      solution: `import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
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

        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": message,
            },
        )

    async def chat_message(self, event):
        # Send message to WebSocket client
        await self.send(text_data=json.dumps({
            "message": event["message"],
        }))
# OR
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        room = self.scope["url_route"]["kwargs"]["room_name"]
        self.group = "chat_" + room
        await self.accept()
        await self.channel_layer.group_add(self.group, self.channel_name)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def receive(self, text_data):
        message = json.loads(text_data)["message"]
        await self.channel_layer.group_send(self.group, {"type": "chat.message", "message": message})

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))`,
      explanation: 'The consumer\'s methods follow the socket\'s life: `connect` runs when a client opens the socket, `receive` for each message it sends, and `disconnect` when it closes. `group_add(group, self.channel_name)` puts this connection in the room\'s group, and `group_discard` takes it out again, so the layer stops delivering to a closed socket. `receive` does not write to the other sockets itself: `group_send` hands the event to the channel layer, which delivers it to every member of the group, the sender included. The event\'s `"type"` of `"chat.message"` becomes a call to `chat_message(self, event)` on each member, and that handler sends the JSON down its own socket. Accepting before or after `group_add` both work. The class is `AsyncWebsocketConsumer` with a lower-case s; `AsyncWebSocketConsumer` does not exist and the import fails.',
      tieredHints: {
        apiSignature: 'self.channel_layer.group_send(group, message)',
        skeleton: 'import json\nfrom channels.generic.websocket import AsyncWebsocketConsumer\n\n\nclass ChatConsumer(AsyncWebsocketConsumer):\n    async def connect(self):\n        # Get room name from URL route\n        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]\n        self.room_group_name = f"chat_{self.room_name}"\n\n        # Join the room group\n        await self.channel_layer.____(\n            self.room_group_name,\n            self.channel_name,\n        )\n\n        # Accept the WebSocket connection\n        await self.____()\n\n    async def disconnect(self, close_code):\n        # Leave the room group\n        await self.channel_layer.____(\n            self.room_group_name,\n            self.channel_name,\n        )\n\n    async def receive(self, text_data):\n        # Parse incoming message\n        data = json.loads(text_data)\n        message = data["message"]\n\n        # Broadcast to room group\n        await self.channel_layer.____(\n            self.room_group_name,\n            {\n                "type": "chat.message",\n                "message": message,\n            },\n        )\n\n    async def chat_message(self, event):\n        # Send message to WebSocket client\n        await self.send(text_data=json.dumps({\n            "message": event["message"],\n        }))',
      },
      hints: [
        'self.scope["url_route"]["kwargs"] gives URL parameters like views',
        'group_send "type" maps to a method: "chat.message" → chat_message()',
        'self.channel_name is unique per connection - assigned by Channels',
      ],
      tags: ['channels', 'websocket', 'consumer', 'chat', 'async'],
      concepts: ['py-async-coroutines', 'dj-channels-realtime'],
    },
  {
      id: 'be-infra-channels-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'What is the channel layer (the `CHANNEL_LAYERS` setting), and what does its Redis backend add?',
      options: [
        { id: 'a', text: 'The channel layer is Django\'s database connection pool, and Redis stores the pooled connections between requests', isCorrect: false },
        { id: 'b', text: 'Redis only accelerates caching — group messaging across multiple Daphne workers works fine on the in-memory layer', isCorrect: false },
        { id: 'c', text: 'A message-passing system between consumers — the Redis backend routes group messages across processes, where the in-memory layer cannot', isCorrect: true },
        { id: 'd', text: 'Channel layers supersede Django signals, and Redis persists every dispatched signal for replay after a crash', isCorrect: false },
      ],
      explanation: 'When you call `group_send()`, the event has to reach every consumer in the group, even ones whose sockets are held by a different server process. The channel layer is that transport: it remembers which channels are in which group and carries events between consumers. `InMemoryChannelLayer` keeps all of that inside one process, which is fine for development and tests, but under two or more ASGI workers a user on process 1 never hears from a user on process 2. `RedisChannelLayer` (from channels_redis) keeps the groups and the queued messages in Redis, which every process and server can reach, so group messages get through wherever each socket lives. It is not a database pool or a cache, and it has nothing to do with Django signals.',
      tags: ['channels', 'channel-layer', 'redis', 'message-passing'],
      concepts: ['dj-channels-realtime', 'dj-caching'],
    },
  {
      id: 'be-infra-channels-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CHANNELS,
      course: Course.BACKEND,
      question: 'Besides WebSockets, two older techniques let a server push updates to a browser over plain HTTP: Server-Sent Events (SSE) and long polling. Which statement compares the three correctly?',
      options: [
        { id: 'a', text: 'All three are wire-identical — browsers simply expose the same underlying TCP stream under three different JavaScript APIs', isCorrect: false },
        { id: 'b', text: 'Long polling replaced WebSockets once HTTP/2 arrived, and SSE is just long polling with a shorter timeout on each request', isCorrect: false },
        { id: 'c', text: 'SSE beats WebSocket in every case by skipping the upgrade handshake; long polling only serves browsers without JavaScript', isCorrect: false },
        { id: 'd', text: 'WebSocket is full-duplex; SSE streams server-to-client only with auto-reconnect; long polling holds an HTTP request open until data arrives', isCorrect: true },
      ],
      explanation: 'A WebSocket upgrades one HTTP request into a connection that stays open, and both sides can send on it at any time (full-duplex), which suits chat, games and collaborative editing. SSE keeps one ordinary HTTP response open and the server streams events down it; the browser\'s `EventSource` reconnects on its own, but the client cannot send on that connection, so it suits feeds, notifications and tickers. Long polling is the oldest: the client sends a request, the server holds it until there is news, answers, and the client asks again at once; it works everywhere but costs a new request per update. They are different protocols, none has replaced the others, and none is fastest in every case.',
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
  {
    id: 'dj-channels-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_CHANNELS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete this consumer\'s `connect` so it joins the `global_notifications` group and then accepts the connection. Blank 1 is the channel-layer method that joins a group, blank 2 is the attribute naming this connection, and blank 3 is the method that accepts the handshake.',
    template: `from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "global_notifications"
        await self.channel_layer.___(
            self.group_name,
            self.___
        )
        await self.___()`,
    blanks: ['group_add', 'channel_name', 'accept'],
    solution: `from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "global_notifications"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()`,
    explanation: 'Every consumer gets a unique `self.channel_name` from Channels, the address the channel layer delivers to. `self.channel_layer.group_add(group, self.channel_name)` adds that address to the named group, so later `group_send` calls to the group reach this socket; `group_discard` with the same arguments takes it out on disconnect. `await self.accept()` completes the WebSocket handshake; a consumer that never accepts (or calls `self.close()`) refuses the connection.',
    hints: [
      'The method is the opposite of the group_discard you call on disconnect.',
      'Channels gives every consumer a unique address on the layer; the attribute holding it is named after the channel.',
      'A consumer either accepts the handshake or closes it.',
    ],
    tags: ['channels', 'websocket', 'consumer', 'async', 'cloze'],
    concepts: ['dj-channels-realtime'],
  },
  {
    id: 'dj-channels-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DJ_CHANNELS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'This consumer is routed at `ws/rooms/<room>/` with the Redis channel layer. Ann and Ben open `ws/rooms/lobby/`, Cal opens `ws/rooms/kitchen/`, and then Ann sends the text `hi`. What does each client receive? The answer is three lines, one per client in the order Ann, Ben, Cal: the name, a colon, a space, then the text that client receives, or the word `nothing`.',
    code: `from channels.generic.websocket import AsyncWebsocketConsumer

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group = "room_" + self.scope["url_route"]["kwargs"]["room"]
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        await self.channel_layer.group_send(
            self.group, {"type": "room.post", "text": text_data})

    async def room_post(self, event):
        await self.send(text_data=event["text"].upper())`,
    expectedOutput: `Ann: HI
Ben: HI
Cal: nothing`,
    explanation: 'Each socket gets its own consumer, and `connect` adds that consumer\'s `channel_name` to the group for its room, so Ann and Ben are in `room_lobby` and Cal is in `room_kitchen`. `group_send` delivers the event to every member of the group, the sender included, so Ann gets her own message back as well as Ben. Channels turns the event\'s `"type"` of `room.post` into a call to `room_post` on each member, which uppercases the text and sends it down that member\'s socket. Cal\'s group never sees the event. A chat that should not echo to the sender has to skip it in the handler, for example by putting the sender\'s `channel_name` in the event and comparing.',
    hints: ['group_send reaches every channel in the group, including the one that sent it.', 'The "type" value with dots turned into underscores names the handler each member runs.'],
    tags: ['channels', 'websocket', 'group_send', 'groups', 'predict'],
    concepts: ['dj-channels-realtime'],
  },
];
