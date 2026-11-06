"""Pydantic Data Validation: practise validating at the edge, converting input and collecting errors.

pydantic does this work for you; here you write its core by hand, with a dataclass,
so nothing needs installing.
Fill in each part so the tests in test_loan_requests.py pass.
Run them from this folder with: pytest
"""
from dataclasses import InitVar, asdict, dataclass, field

MAX_DAYS = 28


class ValidationError(Exception):
    """Every problem found in one piece of input, like pydantic's ValidationError."""

    def __init__(self, problems):
        super().__init__(f"{len(problems)} validation error(s)")
        self.problems = problems

    def errors(self):
        """One dict per problem: {"field": ..., "message": ...}, in field order."""
        return list(self.problems)


@dataclass
class LoanRequest:
    member: str
    isbn: str
    days: int = 14
    tags: list[str] = field(default_factory=list)
    strict: InitVar[bool] = False

    def __post_init__(self, strict):
        """Check every field, converting where allowed; raise ValidationError listing ALL problems.

        member: must contain "@" -> "member must be an email address"
        isbn: must be exactly 13 digits -> "isbn must be 13 digits"
        days: whole number text such as "21" becomes 21, unless strict, where text is refused
              with "days must be an int, not str"; text that is not a number gives
              "days must be a whole number"; out of range gives "days must be between 1 and 28".
        """
        # TODO
        raise NotImplementedError

    @classmethod
    def from_dict(cls, data, strict=False):
        """Build a LoanRequest from a dict, like pydantic's model_validate.

        A missing "member" or "isbn" is a problem too: {"field": ..., "message": "field required"}.
        Keys the class does not know are ignored.
        """
        # TODO
        raise NotImplementedError

    def to_dict(self):
        """The fields as a plain dict, like pydantic's model_dump."""
        # TODO
        raise NotImplementedError
