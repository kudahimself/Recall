"""CLI tools and config: reference solution."""
import argparse
import os

DEFAULT_API = "http://localhost:8000"


def build_parser():
    parser = argparse.ArgumentParser(description="Lend a book")
    parser.add_argument("title")
    parser.add_argument("--days", type=int, default=14)
    parser.add_argument("-v", "--verbose", action="store_true")
    return parser


def api_url():
    return os.environ.get("LIBRARY_API", DEFAULT_API)


def main(argv=None):
    args = build_parser().parse_args(argv)
    message = f"Lent {args.title} for {args.days} days"
    if args.verbose:
        message += f" via {api_url()}"
    return message


def load_env_file(path):
    loaded = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key, value = key.strip(), value.strip()
            if key not in os.environ:
                os.environ[key] = value
                loaded[key] = value
    return loaded


if __name__ == "__main__":
    print(main())
