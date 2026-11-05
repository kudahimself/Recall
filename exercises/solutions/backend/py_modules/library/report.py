"""The daily report: reference solution."""
from library.fees import late_fee

LOANS = {"Dune": 3, "Emma": 0, "Ubik": 1}


def summary(loans):
    late = 0
    fees = 0
    for days in loans.values():
        if days > 0:
            late += 1
        fees += late_fee(days)
    return f"{len(loans)} loans, {late} late, fees {fees}"


if __name__ == "__main__":
    print("Library report")
    print(summary(LOANS))
