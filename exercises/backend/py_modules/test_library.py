import importlib
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent


def test_fees_module():
    from library import fees
    assert fees.late_fee(3) == 60
    assert fees.boxes_needed(130, 40) == 4
    assert fees.boxes_needed(120, 40) == 3
    assert fees.boxes_needed(1, 40) == 1


def test_package_exports_the_fee_functions():
    import library
    assert library.late_fee(3) == 60
    assert library.boxes_needed(130, 40) == 4


def test_importing_the_report_prints_nothing(capsys):
    import library.report
    capsys.readouterr()
    importlib.reload(library.report)  # run its top-level code again, as a first import would
    assert capsys.readouterr().out == ""


def test_summary():
    from library.report import summary
    assert summary({"Dune": 3, "Emma": 0, "Ubik": 1}) == "3 loans, 2 late, fees 80"
    assert summary({}) == "0 loans, 0 late, fees 0"


def test_running_the_report_as_a_script():
    result = subprocess.run(
        [sys.executable, "-m", "library.report"],
        cwd=HERE, capture_output=True, text=True, timeout=30,
    )
    assert result.returncode == 0, result.stderr
    assert result.stdout == "Library report\n3 loans, 2 late, fees 80\n"
