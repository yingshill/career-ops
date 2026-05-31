#!/usr/bin/env python3
"""
generate-docx.py — render an editable .docx resume in the "Classic ATS" layout.

Emits MINIMAL, dependency-free OOXML (no python-docx). The output is small
(a few KB), which keeps it easy to upload through connectors and trivially
editable in Word / Google Docs.

Layout mirrors templates/cv-template.html (parsed from DE_Lydia_Liu_Milliman.docx):
  - Centered name + pipe-separated contact line
  - Bold UPPERCASE section headers with a bottom rule
  - OVERVIEW paragraph
  - CORE SKILLS: "Category: items" (bold category)
  - EXPERIENCE: "Title <tab> Dates" / "Company <tab> Location" + bullets
  - CERTIFICATION & EDUCATION: combined

Usage:
  python3 generate-docx.py <resume.json> <output.docx> [--format=letter|a4]

JSON schema: see the project's resume JSON (name, contact[], sections[]).
"""
import json
import sys
import zipfile
from xml.sax.saxutils import escape

# twips: 1 inch = 1440
PAGES = {
    "letter": (12240, 15840),
    "a4": (11906, 16838),
}
MARGIN = 1008  # 0.7 in

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

DOC_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>"""

STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
</w:styles>"""

SETTINGS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="720"/><w:compat/></w:settings>"""

CORE = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>career-ops</dc:creator><cp:lastModifiedBy>career-ops</cp:lastModifiedBy></cp:coreProperties>"""

APP = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>career-ops</Application></Properties>"""

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def run(text, size=21, bold=False, italic=False, tab_before=False):
    rpr = ""
    if bold:
        rpr += "<w:b/>"
    if italic:
        rpr += "<w:i/>"
    rpr += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
    pre = "<w:tab/>" if tab_before else ""
    return f'<w:r><w:rPr>{rpr}</w:rPr>{pre}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def para(runs, *, align=None, before=0, after=40, line=276, right_tab=None,
         border_bottom=False, ind_left=None, hanging=None):
    ppr = ""
    if border_bottom:
        ppr += '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="000000"/></w:pBdr>'
    if right_tab:
        ppr += f'<w:tabs><w:tab w:val="right" w:pos="{right_tab}"/></w:tabs>'
    if ind_left is not None:
        h = f' w:hanging="{hanging}"' if hanging else ""
        ppr += f'<w:ind w:left="{ind_left}"{h}/>'
    ppr += f'<w:spacing w:before="{before}" w:after="{after}" w:line="{line}" w:lineRule="auto"/>'
    if align:
        ppr += f'<w:jc w:val="{align}"/>'
    return f"<w:p><w:pPr>{ppr}</w:pPr>{''.join(runs)}</w:p>"


def build(data, outpath, page="letter"):
    pw, ph = PAGES.get(page, PAGES["letter"])
    usable = pw - 2 * MARGIN  # right-tab position
    body = []

    # Name + contact
    body.append(para([run(data["name"], size=36, bold=True)], align="center", after=20, line=240))
    body.append(para([run("  |  ".join(data.get("contact", [])), size=19)], align="center", after=120, line=240))

    for sec in data.get("sections", []):
        body.append(para([run(sec["title"].upper(), size=23, bold=True)],
                         before=80, after=60, line=240, border_bottom=True))
        t = sec.get("type")

        if t == "overview":
            body.append(para([run(sec["text"], size=21)], after=60, line=264))

        elif t == "skills":
            for it in sec.get("items", []):
                body.append(para(
                    [run(it["cat"].rstrip(":") + ": ", size=21, bold=True), run(it["val"], size=21)],
                    after=20, line=264))

        elif t == "experience":
            for j in sec.get("jobs", []):
                body.append(para(
                    [run(j["title"], size=22, bold=True), run(j.get("date", ""), size=20, tab_before=True)],
                    before=80, after=0, right_tab=usable, line=264))
                comp = [run(j["company"], size=21, bold=True)]
                if j.get("loc"):
                    comp.append(run(j["loc"], size=20, italic=True, tab_before=True))
                body.append(para(comp, after=20, right_tab=usable, line=264))
                for b in j.get("bullets", []):
                    body.append(para([run("•  " + b, size=21)],
                                     after=20, line=252, ind_left=288, hanging=216))

        elif t == "education":
            for line in sec.get("lines", []):
                body.append(para([run(line, size=21)], after=40, line=264))
            for r in sec.get("rows", []):
                runs = [run(r["org"], size=21, bold=True)]
                if r.get("detail"):
                    runs.append(run(" — " + r["detail"], size=21))
                if r.get("meta"):
                    runs.append(run(r["meta"], size=20, italic=True, tab_before=True))
                body.append(para(runs, after=20, right_tab=usable, line=264))

    sectpr = (f'<w:sectPr><w:pgSz w:w="{pw}" w:h="{ph}"/>'
              f'<w:pgMar w:top="{MARGIN}" w:right="{MARGIN}" w:bottom="{MARGIN}" w:left="{MARGIN}" '
              f'w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>')

    document = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                f'<w:document xmlns:w="{W}"><w:body>{"".join(body)}{sectpr}</w:body></w:document>')

    with zipfile.ZipFile(outpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS)
        z.writestr("docProps/core.xml", CORE)
        z.writestr("docProps/app.xml", APP)
        z.writestr("word/_rels/document.xml.rels", DOC_RELS)
        z.writestr("word/styles.xml", STYLES)
        z.writestr("word/settings.xml", SETTINGS)
        z.writestr("word/document.xml", document)
    print(f"OK wrote {outpath}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    page = "letter"
    for a in sys.argv[1:]:
        if a.startswith("--format="):
            page = a.split("=", 1)[1].lower()
    if len(args) < 2:
        print("Usage: python3 generate-docx.py <resume.json> <output.docx> [--format=letter|a4]")
        sys.exit(1)
    with open(args[0], encoding="utf-8") as f:
        data = json.load(f)
    build(data, args[1], page)


if __name__ == "__main__":
    main()
