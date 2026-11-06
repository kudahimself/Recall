# Bookshop proxy

Topic: Nginx & Reverse Proxy (Backend, Production Infrastructure).
Time: about 20 minutes.

## Task

The bookshop's Django site runs under Gunicorn, listening on `127.0.0.1:8000`, and Nginx stands in front of it.
`bookshop.conf` in this folder is a first try at the Nginx site: it serves everything over plain HTTP, and it reads the static files from the wrong place.
Fix the file so it does this, for the host `books.example.org`:

- An `upstream` block names Gunicorn's address, `127.0.0.1:8000`, and every `proxy_pass` uses that name.
- A server block on port 80 answers every request with a permanent redirect to the same host and path on `https://`, and serves nothing itself.
- A server block on port 443 speaks HTTPS (`listen 443 ssl;`) with the certificate `/etc/letsencrypt/live/books.example.org/fullchain.pem` and its key `/etc/letsencrypt/live/books.example.org/privkey.pem`.
- In the HTTPS server, `/static/` is read from the folder `collectstatic` fills, `/srv/bookshop/collected/`: `/static/css/site.css` is the file `/srv/bookshop/collected/css/site.css`.
- `/media/` is read from the uploads folder, `/srv/bookshop/media/`: `/media/covers/42.jpg` is the file `/srv/bookshop/media/covers/42.jpg`.
- Every other path goes to Gunicorn, with the original `Host`, the client's address in `X-Forwarded-For` and the scheme in `X-Forwarded-Proto`.
  That includes `/statistics/` and `/mediakit/`, which only look like the file folders.

## Examples

```text
http://books.example.org/cart/            -> 301 to https://books.example.org/cart/
https://books.example.org/static/app.js   -> file /srv/bookshop/collected/app.js
https://books.example.org/media/covers/42.jpg -> file /srv/bookshop/media/covers/42.jpg
https://books.example.org/cart/           -> Gunicorn, Host books.example.org, X-Forwarded-Proto https
https://books.example.org/statistics/     -> Gunicorn, not a file
```

Watch for the lesson's pitfall: `root` adds the whole path, prefix included, to its folder, while `alias` swaps the prefix for its folder.
Under `location /static/`, `root /srv/bookshop/collected;` looks for `/srv/bookshop/collected/static/app.js`, and every static file is a 404.
End both the location and the alias with `/`.

## Run the tests

```bash
cd exercises/backend/dj_nginx
pytest
```

The tests read `bookshop.conf` as text and parse it into its blocks and directives, then work out where each request would go: the server block for the port, the location with the longest matching prefix, and its `alias`, `root` or `proxy_pass`.
Nothing starts Nginx, so you do not need it installed; any correct way of writing the config passes.
On the Django side, the scheme header only counts once `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` is set, which the settings exercise (`dj_settings`) does.
When they all pass, tick the exercise done in Recall under Progress, Topics.
