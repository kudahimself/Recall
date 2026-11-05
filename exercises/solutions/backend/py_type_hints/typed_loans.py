"""Type hints and dataclasses: reference solution."""
from dataclasses import asdict, dataclass, field


@dataclass
class Loan:
    title: str
    member: str
    days: int = 14
    renewals: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class ShelfMark:
    aisle: str
    shelf: int


def total_days(loans: list[Loan]) -> int:
    return sum(loan.days for loan in loans)


def find(loans: list[Loan], title: str) -> Loan | None:
    for loan in loans:
        if loan.title == title:
            return loan
    return None


def loan_from_form(form: dict[str, str]) -> Loan:
    text = form.get("days", "14").strip()
    if not text.isdigit():
        raise ValueError("days must be a whole number")
    days = int(text)
    if days < 1:
        raise ValueError("days must be at least 1")
    return Loan(form["title"], form["member"], days)


def to_rows(loans: list[Loan]) -> list[dict]:
    return [asdict(loan) for loan in loans]
