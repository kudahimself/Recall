# Member sign-in

Topic: Authentication & Permissions (Backend, Django).
Time: about 25 minutes.

## Task

Members sign in to see their loans, and only librarians may renew one.
The URLconf (`members/urls.py`) is written for you.

In `members/models.py`, give `Loan` a `borrower`: a foreign key to the project's user model, named through `settings.AUTH_USER_MODEL`, that deletes a user's loans with the user and is followed back as `user.member_loans`.

In `members/views.py`:

- `register(username, password)` creates and returns a user whose password is stored hashed.
- `make_librarian(user)` puts the user in a `Librarians` group that holds the `members.change_loan` permission, creating the group the first time only.
  Look the permission up by its codename and its app, `content_type__app_label="members"`.
- `sign_in` reads the POSTed `username` and `password`.
  Wrong ones answer `"Wrong username or password."` with status 401; right ones sign the user in for the session and redirect to `my-loans`.
- `sign_out` signs the user out and redirects to `sign-in`.
- `my_loans` answers JSON `{"user": ..., "titles": [...]}` with the signed-in user's loans in title order, and sends anyone not signed in to the login page.
- `renew_loan` (POST) adds one to a loan's `renewals` and answers JSON `{"title": ..., "renewals": ...}`.
  It too needs a signed-in user, and one without `members.change_loan` gets 403.

## Examples

```text
POST /login/  username=ann password=wrong        401  Wrong username or password.
POST /login/  username=ann password=s3cret-pass  302  Location: /loans/
GET  /loans/  (signed in as ann)                 200  {"user": "ann", "titles": ["Dune", "Emma"]}
GET  /loans/  (not signed in)                    302  Location: /login/?next=/loans/
POST /loans/3/renew/  (ann, not a librarian)     403
POST /loans/3/renew/  (after make_librarian)     200  {"title": "Ubik", "renewals": 1}
```

Watch for the lesson's pitfall: `authenticate()` alone signs nobody in, it only returns the matching user or `None`.
Test the result for `None`, then call `login(request, user)`.

## Run the tests

```bash
cd exercises/backend/dj_auth
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Every test fails until you write the model field and the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
