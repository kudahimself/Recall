"""The daily report.

Run it as a script from the exercise folder with: python -m library.report
Importing it must only define things and print nothing.
"""
from library.fees import late_fee

# Days late for each book out on loan.
LOANS = {"Dune": 3, "Emma": 0, "Ubik": 1}


def summary(loans):
    """Return one line: "<n> loans, <late> late, fees <total>".

    summary({"Dune": 3, "Emma": 0, "Ubik": 1}) -> "3 loans, 2 late, fees 80"
    """
    # TODO
    raise NotImplementedError


# TODO: this runs on every import of the module, not only when the file is run as a script.
print("Library report")
print(summary(LOANS))
