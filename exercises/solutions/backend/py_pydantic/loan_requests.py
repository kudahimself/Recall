"""Pydantic Data Validation: reference solution."""
from dataclasses import InitVar, asdict, dataclass, field

MAX_DAYS = 28


class ValidationError(Exception):
    """Every problem found in one piece of input, like pydantic's ValidationError."""

    def __init__(self, problems):
        super().__init__(f"{len(problems)} validation error(s)")
        self.problems = problems

    def errors(self):
        return list(self.problems)


@dataclass
class LoanRequest:
    member: str
    isbn: str
    days: int = 14
    tags: list[str] = field(default_factory=list)
    strict: InitVar[bool] = False

    def __post_init__(self, strict):
        problems = []

        def problem(where, message):
            problems.append({"field": where, "message": message})

        if "@" not in self.member:
            problem("member", "member must be an email address")
        if not (len(self.isbn) == 13 and self.isbn.isdigit()):
            problem("isbn", "isbn must be 13 digits")

        days = self.days
        if isinstance(days, str):
            if strict:
                problem("days", "days must be an int, not str")
                days = None
            else:
                try:
                    days = int(days.strip())
                except ValueError:
                    problem("days", "days must be a whole number")
                    days = None
        if days is not None:
            if not 1 <= days <= MAX_DAYS:
                problem("days", f"days must be between 1 and {MAX_DAYS}")
            else:
                self.days = days

        if problems:
            raise ValidationError(problems)

    @classmethod
    def from_dict(cls, data, strict=False):
        missing = [
            {"field": key, "message": "field required"}
            for key in ("member", "isbn") if key not in data
        ]
        if missing:
            raise ValidationError(missing)
        known = {key: data[key] for key in ("member", "isbn", "days", "tags") if key in data}
        return cls(**known, strict=strict)

    def to_dict(self):
        return asdict(self)
