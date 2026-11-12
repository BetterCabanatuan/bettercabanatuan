#!/usr/bin/env python3
"""Import Cabanatuan's 2023–2026 roster, excluding unverified phone values."""

import argparse
import json
import re
import zipfile
from pathlib import Path
from xml.etree.ElementTree import iterparse, fromstring

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
EXPECTED_HEADERS = [
    "TERM",
    "REGION",
    "PROVINCE",
    "CITY/MUNICIPALITY",
    "BARANGAY",
    "POSITION",
    "TERM IN PRESENT POSITION",
    "LASTNAME",
    "FIRSTNAME",
    "MIDDLENAME",
    "SUFFIX",
    "BARANGAY TEL NO.",
]
OUTPUT_FIELDS = {
    "A": "term",
    "B": "region",
    "C": "province",
    "D": "city",
    "E": "barangayName",
    "F": "position",
    "G": "termInPosition",
    "H": "lastName",
    "I": "firstName",
    "J": "middleName",
    "K": "suffix",
}


def column(cell_ref):
    return re.match(r"[A-Z]+", cell_ref).group()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--barangays", type=Path, default=Path("src/data/barangays.yaml"))
    parser.add_argument(
        "--output", type=Path, default=Path("src/data/officialBarangayRoster.json")
    )
    args = parser.parse_args()

    text = args.barangays.read_text(encoding="utf-8")
    canonical = dict(
        re.findall(r"^  - name: ['\"](.+?)['\"]\n    slug: ['\"](.+?)['\"]", text, re.M)
    )
    if len(canonical) != 89:
        raise SystemExit(f"Expected 89 canonical barangays, got {len(canonical)}")

    rows = []
    with zipfile.ZipFile(args.workbook) as workbook:
        shared = fromstring(workbook.read("xl/sharedStrings.xml"))
        shared_strings = ["".join(item.itertext()) for item in shared.findall(NS + "si")]
        for _, row in iterparse(workbook.open("xl/worksheets/sheet1.xml"), events=("end",)):
            if row.tag != NS + "row":
                continue
            values = {}
            for cell in row.findall(NS + "c"):
                value = cell.find(NS + "is")
                if value is not None:
                    text_value = "".join(value.itertext())
                else:
                    raw = cell.find(NS + "v")
                    text_value = raw.text if raw is not None and raw.text else ""
                    if cell.attrib.get("t") == "s" and text_value:
                        text_value = shared_strings[int(text_value)]
                values[column(cell.attrib["r"])] = text_value.strip()

            if row.attrib.get("r") == "1":
                headers = [values.get(chr(ord("A") + i), "") for i in range(12)]
                if headers != EXPECTED_HEADERS:
                    raise SystemExit(f"Unexpected workbook headers: {headers}")
            elif values.get("C") == "NUEVA ECIJA" and values.get("D") == "CITY OF CABANATUAN":
                name = values.get("E", "")
                if name not in canonical:
                    raise SystemExit(f"No exact canonical barangay match for {name!r}")
                record = {key: values.get(col, "") for col, key in OUTPUT_FIELDS.items()}
                record["barangaySlug"] = canonical[name]
                rows.append(record)
            row.clear()

    if len(rows) != 1750:
        raise SystemExit(f"Expected 1,750 matching records, got {len(rows)}")
    names = {row["barangayName"] for row in rows}
    if len(names) != 89 or names != set(canonical):
        raise SystemExit("Workbook names do not exactly cover the 89 canonical barangays")

    document = {
        "source": {
            "file": args.workbook.name,
            "province": "NUEVA ECIJA",
            "city": "CITY OF CABANATUAN",
            "term": "2023 - 2026",
            "recordCount": len(rows),
            "barangayCount": len(names),
            "phoneFieldsExcluded": True,
        },
        "records": [
            {key: row[key] for key in (
                "barangaySlug", "barangayName", "position", "termInPosition",
                "lastName", "firstName", "middleName", "suffix"
            )}
            for row in rows
        ],
    }
    args.output.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(rows)} records across {len(names)} exact canonical barangay matches")


if __name__ == "__main__":
    main()
