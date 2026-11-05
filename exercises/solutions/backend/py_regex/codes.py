"""Regex: reference solution."""
import re


def find_isbns(text):
    return re.findall(r"\b97[89]\d{10}\b", text)


def parse_call_number(text):
    m = re.search(r"\b(?P<section>[A-Z]{3})-(?P<author>[A-Z]{3})-(?P<year>\d{4})\b", text)
    if m is None:
        return None
    return {"section": m.group("section"), "author": m.group("author"), "year": int(m.group("year"))}


def is_member_id(text):
    return re.fullmatch(r"M-\d{5}", text) is not None


def first_year(text):
    m = re.search(r"\b\d{4}\b", text)
    return int(m.group()) if m else None


def tidy_spaces(text):
    return re.sub(r"\s+", " ", text).strip()


def strip_tags(html):
    return re.sub(r"<.+?>", "", html)
