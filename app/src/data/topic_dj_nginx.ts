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
      id: 'dj-nginx-proxypass-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the two blanks: the directive that hands every request to the `gunicorn_backend` upstream, and the Nginx variable that fills `X-Forwarded-For` with the address of the client.',
      template: `upstream gunicorn_backend {
    server unix:/run/gunicorn.sock;
}

server {
    listen 80;
    server_name example.com;

    location / {
        ___ http://gunicorn_backend;
        proxy_set_header X-Forwarded-For $___;
    }
}`,
      blanks: ['proxy_pass', 'proxy_add_x_forwarded_for'],
      blankAlternates: [[], ['remote_addr']],
      solution: 'upstream gunicorn_backend {\n    server unix:/run/gunicorn.sock;\n}\n\nserver {\n    listen 80;\n    server_name example.com;\n\n    location / {\n        proxy_pass http://gunicorn_backend;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    }\n}',
      explanation: '`proxy_pass` sends the request on to the `gunicorn_backend` upstream, and so to Django. Behind the proxy, the connection Django sees comes from Nginx, so `REMOTE_ADDR` no longer holds the browser\'s address. `$proxy_add_x_forwarded_for` is the `X-Forwarded-For` the request arrived with, plus `$remote_addr`, the address that connected to Nginx, added at the end; Django reads it as `request.META["HTTP_X_FORWARDED_FOR"]`. `$remote_addr` on its own is also accepted: it sends only the connecting address and drops any list the request carried.',
      hints: ['The directive that passes a request to an upstream starts with proxy_.', 'The lesson sets X-Forwarded-For from a variable that adds the client address to any list already there.'],
      tags: ['nginx', 'gunicorn', 'proxy_pass', 'cloze'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'be-infra-nginx-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: `Write the Nginx configuration that puts a Django site at example.com behind Gunicorn. It needs three blocks:

- an \`upstream\` named \`gunicorn_backend\` for Gunicorn's socket \`unix:/run/gunicorn.sock\`
- a server block on port 80 that answers every request with a 301 redirect to the same host and path over HTTPS
- a server block on port 443 with \`ssl\`, using the certificate \`/etc/letsencrypt/live/example.com/fullchain.pem\` and the key \`/etc/letsencrypt/live/example.com/privkey.pem\`; it serves \`/static/\` from the directory \`/var/www/myproject/staticfiles/\` and passes every other request to the upstream with the \`Host\`, \`X-Forwarded-For\` and \`X-Forwarded-Proto\` headers set`,
      starterCode: `# /etc/nginx/sites-available/myproject
`,
      testCases: [
        {
          input: 'Nginx config for Django',
          expectedOutput: 'upstream, server blocks, proxy_pass, static alias, SSL redirect',
          description: 'Should define a complete Nginx config for Django + Gunicorn',
        },
      ],
      requires: [/\balias\s/, /\breturn\s+301\b/],
      solution: `# /etc/nginx/sites-available/myproject

upstream gunicorn_backend {
    server unix:/run/gunicorn.sock;
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com;
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location /static/ {
        alias /var/www/myproject/staticfiles/;
    }

    location / {
        proxy_pass http://gunicorn_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
      explanation: 'The `upstream` names Gunicorn\'s socket once, so `proxy_pass http://gunicorn_backend;` can send requests to it. The port 80 block only redirects, keeping the host and path, so no page is ever served over plain HTTP. In the HTTPS block, `alias` swaps `/static/` for the directory `collectstatic` filled, so Nginx reads those files from disk without taking a Gunicorn worker; `root` there would look for `/static/site.css` under `staticfiles/static/` and return 404. Every other path goes to Gunicorn with what Django would lose behind the proxy: the original `Host`, checked against `ALLOWED_HOSTS`, the client\'s address in `X-Forwarded-For`, and the scheme in `X-Forwarded-Proto`, which Django trusts once `SECURE_PROXY_SSL_HEADER` is set. A real site usually adds a `location /media/` for uploads and `client_max_body_size` to allow large ones.',
      hints: [
        'upstream gives Gunicorn\'s address a name for proxy_pass to use.',
        'return 301 with $host and $request_uri keeps the host and the path.',
        'alias swaps the matched /static/ prefix for the directory; root would add /static/ to it.',
        'The three headers carry the original host, the client address and the scheme.',
      ],
      tieredHints: {
        apiSignature: 'upstream name { server address; }  return 301 URL;  alias path;  proxy_pass URL;  proxy_set_header Field Value;',
        skeleton: '# /etc/nginx/sites-available/myproject\n\n____ gunicorn_backend {\n    server unix:/run/gunicorn.sock;\n}\n\nserver {\n    listen 80;\n    server_name example.com;\n    ____ 301 ____;\n}\n\nserver {\n    listen 443 ssl;\n    server_name example.com;\n    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;\n\n    location /static/ {\n        ____ /var/www/myproject/staticfiles/;\n    }\n\n    location / {\n        ____ http://gunicorn_backend;\n        proxy_set_header Host ____;\n        proxy_set_header X-Forwarded-For ____;\n        proxy_set_header X-Forwarded-Proto ____;\n    }\n}',
      },
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
  {
      id: 'dj-nginx-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_NGINX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Nginx runs this server block, and `gunicorn_backend` is an upstream pointing at Gunicorn. It receives three requests for shop.example.com, in this order: `/static/css/site.css`, `/media/covers/7.jpg` and `/orders/12/`. For each request, what does Nginx do? The answer is three lines, one per request in order: the full path of the file Nginx reads from disk, or the single word `gunicorn` when it passes the request on.',
      code: `server {
    listen 443 ssl;
    server_name shop.example.com;
    location /static/ { alias /srv/shop/collected/; }
    location /media/  { root /srv/shop; }
    location /        { proxy_pass http://gunicorn_backend; }
}`,
      expectedOutput: `/srv/shop/collected/css/site.css
/srv/shop/media/covers/7.jpg
gunicorn`,
      explanation: 'Nginx picks the location with the longest matching prefix. `alias` replaces the matched prefix with its path, so `/static/css/site.css` drops `/static/` and becomes `/srv/shop/collected/css/site.css`. `root` appends the whole request path to its directory, `/media/` included, so `/media/covers/7.jpg` becomes `/srv/shop/media/covers/7.jpg`. `/orders/12/` matches only `location /`, which hands it to Gunicorn and so to Django. Mixing up `alias` and `root` is the usual cause of a 404 on every static file.',
      hints: ['alias swaps the matched location prefix for its own path.', 'root adds the full request path, prefix included, after its directory.'],
      tags: ['nginx', 'alias', 'root', 'proxy_pass', 'predict'],
      concepts: ['dj-deployment-cicd'],
    },
];
