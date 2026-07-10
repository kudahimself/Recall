/**
 * Topic.DJ_NGINX — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_nginx_questions: Question[] = [
  {
      id: 'be-infra-nginx-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a complete Nginx configuration for a Django application. Include: an upstream block pointing to Gunicorn, a server block with proxy_pass, static file serving with alias, and an HTTP-to-HTTPS redirect. Show the full nginx.conf.',
      starterCode: `# /etc/nginx/sites-available/myproject
# Write the full Nginx configuration
`,
      testCases: [
        {
          input: 'Nginx config for Django',
          expectedOutput: 'upstream, server blocks, proxy_pass, static alias, SSL redirect',
          description: 'Should define a complete Nginx config for Django + Gunicorn',
        },
      ],
      solution: `# /etc/nginx/sites-available/myproject

# Upstream: where Gunicorn is listening
upstream gunicorn_backend {
    server unix:/run/gunicorn.sock;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    client_max_body_size 10M;

    # Static files — served directly by Nginx, not Django
    location /static/ {
        alias /var/www/myproject/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files — user uploads
    location /media/ {
        alias /var/www/myproject/media/;
        expires 7d;
    }

    # Everything else goes to Gunicorn/Django
    location / {
        proxy_pass http://gunicorn_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}`,
      explanation: 'Nginx sits in front of Gunicorn because it excels at tasks Python should not handle. Static files are served directly from disk — Nginx handles this orders of magnitude faster than Django. The HTTP-to-HTTPS redirect ensures all traffic is encrypted. proxy_set_header X-Forwarded-For passes the real client IP to Django (otherwise every request appears to come from 127.0.0.1). The Unix socket connection to Gunicorn avoids TCP overhead. Cache headers on static files reduce repeat requests.',
      hints: [
        'upstream defines the backend — Gunicorn socket or host:port',
        'alias vs root: alias replaces the entire location path',
        'proxy_set_header X-Forwarded-For passes real client IPs',
        'client_max_body_size limits upload size at the Nginx level',
      ],
      tags: ['nginx', 'gunicorn', 'deployment', 'ssl', 'proxy'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'be-infra-nginx-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      question: 'Why do you need Nginx in front of Gunicorn for a Django application?',
      options: [
        { id: 'a', text: 'Gunicorn cannot speak HTTP on its own — without a proxy in front it only accepts WSGI byte streams', isCorrect: false },
        { id: 'b', text: 'A reverse proxy only becomes necessary once traffic passes roughly a million requests per day', isCorrect: false },
        { id: 'c', text: 'The WSGI specification requires a dedicated web server like Nginx in front of any Python application', isCorrect: false },
        { id: 'd', text: 'Nginx handles static files, SSL termination, slow-client buffering, and rate limiting — Gunicorn just runs the Python app', isCorrect: true },
      ],
      explanation: 'Gunicorn has a fixed number of worker processes. A slow client downloading a 5MB image would occupy one worker for seconds — wasting it on a task that does not need Python. Nginx buffers the entire response and streams it to the client slowly, freeing the Gunicorn worker instantly. Nginx also excels at serving static files from disk (thousands per second), terminating SSL (offloading crypto from Python), and rate limiting abusive clients before they reach your application.',
      tags: ['nginx', 'gunicorn', 'architecture', 'deployment'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'be-infra-nginx-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      question: 'What is the request flow for a Django application in production?',
      options: [
        { id: 'a', text: 'Client → Django directly — the framework listens on port 443 itself and delegates work to Nginx as needed', isCorrect: false },
        { id: 'b', text: 'Client → Gunicorn, which serves dynamic pages itself and forwards static file requests over to Nginx', isCorrect: false },
        { id: 'c', text: 'Client → Nginx (SSL, static files, buffering) → Gunicorn (worker processes) → Django (application code)', isCorrect: true },
        { id: 'd', text: 'Client → Django (URL routing) → Gunicorn (rendering) → Nginx (compression) → back out to the client', isCorrect: false },
      ],
      explanation: 'The request flows inward: the client hits Nginx first, which handles SSL decryption and checks if it is a static file request (served immediately from disk). Dynamic requests are proxied to Gunicorn, which manages a pool of worker processes. Each worker runs your Django application. The response flows back out: Django returns it to Gunicorn, Gunicorn to Nginx, Nginx to the client. This layered architecture lets each component do what it does best.',
      tags: ['nginx', 'gunicorn', 'django', 'architecture', 'request-flow'],
      concepts: ['dj-deployment-cicd'],
    },
];
