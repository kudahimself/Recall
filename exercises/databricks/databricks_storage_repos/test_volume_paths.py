import sys

import pytest

import volume_paths


@pytest.mark.parametrize(
    "path, expected",
    [
        ("/Volumes/main/library/landing/loans.csv", "volume"),
        ("dbfs:/FileStore/loans.csv", "dbfs"),
        ("/dbfs/FileStore/loans.csv", "dbfs"),
        ("/mnt/landing/loans.csv", "dbfs"),
        ("abfss://data@account.dfs.core.windows.net/loans", "cloud"),
        ("s3://bucket/loans", "cloud"),
        ("gs://bucket/loans", "cloud"),
        ("file:/tmp/loans.csv", "local"),
        ("/tmp/loans.csv", "local"),
    ],
)
def test_classify_path_names_the_storage_layer(path, expected):
    assert volume_paths.classify_path(path) == expected


def test_volume_path_joins_the_three_levels_and_the_file():
    assert volume_paths.volume_path("main", "library", "landing", "archive", "loans.csv") == (
        "/Volumes/main/library/landing/archive/loans.csv"
    )


def test_volume_path_without_parts_is_the_volume_root():
    assert volume_paths.volume_path("main", "library", "landing") == "/Volumes/main/library/landing"


def test_parse_volume_path_splits_off_the_relative_part():
    assert volume_paths.parse_volume_path("/Volumes/main/library/landing/archive/loans.csv") == (
        "main",
        "library",
        "landing",
        "archive/loans.csv",
    )
    assert volume_paths.parse_volume_path("/Volumes/main/library/landing") == ("main", "library", "landing", "")


@pytest.mark.parametrize("path", ["/mnt/landing/loans.csv", "/Volumes/main/library", "s3://bucket/x"])
def test_parse_volume_path_rejects_what_is_not_a_full_volume_path(path):
    with pytest.raises(ValueError):
        volume_paths.parse_volume_path(path)


def test_ls_names_marks_folders_with_a_slash(tmp_path):
    (tmp_path / "loans.csv").write_text("loan_id,title\n")
    (tmp_path / "archive").mkdir()
    (tmp_path / "archive" / "old.csv").write_text("x\n")
    assert volume_paths.ls_names(tmp_path) == ["archive/", "loans.csv"]


def test_count_csv_rows_reads_a_file_with_spark(spark, tmp_path):
    csv = tmp_path / "loans.csv"
    csv.write_text("loan_id,title\n1,Dune\n2,Emma\n3,Dune\n")
    assert volume_paths.count_csv_rows(spark, str(csv)) == 3


def test_count_csv_rows_reads_every_file_of_a_folder(spark, tmp_path):
    (tmp_path / "a.csv").write_text("loan_id,title\n1,Dune\n")
    (tmp_path / "b.csv").write_text("loan_id,title\n2,Emma\n3,Ubik\n")
    assert volume_paths.count_csv_rows(spark, str(tmp_path)) == 3


def test_import_from_repo_finds_a_module_under_the_repo_root(tmp_path):
    helpers = tmp_path / "recall_helpers_pkg"
    helpers.mkdir()
    (helpers / "__init__.py").write_text("")
    (helpers / "fines.py").write_text("def late_fee(days):\n    return days * 0.25\n")
    saved_path = list(sys.path)
    try:
        late_fee = volume_paths.import_from_repo(tmp_path, "recall_helpers_pkg.fines", "late_fee")
        assert late_fee(4) == 1.0
    finally:
        sys.path[:] = saved_path
        for key in [k for k in sys.modules if k.startswith("recall_helpers_pkg")]:
            del sys.modules[key]
