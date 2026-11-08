"""Reference solution for loan_joins.py: look only after your own tests pass."""


def loaned_titles_sql() -> str:
    return """SELECT b.title, m.member_name
              FROM loans l
              JOIN books b ON l.book_id = b.book_id
              JOIN members m ON l.member_id = m.member_id"""


def all_books_with_loans_sql() -> str:
    return """SELECT b.title, l.loan_id
              FROM books b LEFT JOIN loans l ON b.book_id = l.book_id"""


def never_loaned_sql() -> str:
    return """SELECT b.title
              FROM books b LEFT ANTI JOIN loans l ON b.book_id = l.book_id"""


def referrals_sql() -> str:
    return """SELECT m.member_name, r.member_name AS referrer
              FROM members m JOIN members r ON m.referred_by = r.member_id"""


def member_branch_pairs_sql() -> str:
    return "SELECT m.member_name, br.branch FROM members m CROSS JOIN branches br"
