#!/usr/bin/env python3
"""
build_pm_resume.py — spec-driven resume builder + linter.

Renders a resume SPEC (JSON) into the original Word template's exact formatting,
then enforces the RESUME-BUILD-PROTOCOL:
  - Principle 2: every experience bullet must fill ~2 full lines at Arial 10
    (no 1-liners, no orphan tails, no 3-line overflow).
  - Principle 4: ATS-clean body text (ASCII only, no special glyphs/tabs in bullets).

Usage:
  python3 build_pm_resume.py <spec.json> <out.docx>     # render + validate
  python3 build_pm_resume.py --lint <resume.docx>        # validate an existing docx

Spec JSON:
{
  "template": "/abs/path/template.docx",          # optional; defaults below
  "page": "letter",
  "name": "...", "contact": "a | b | c",
  "overview": "...",
  "skills": [{"cat": "Project & Delivery", "items": "..."}],
  "experience": [{"title","date","company","loc","bullets":[...]}],
  "education": {"certs": "...", "schools": [{"org","detail","meta"}]}
}
Job titles live in the spec (Principle 3 — the AI sets them after asking the user).
"""
import copy
import json
import math
import sys

from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_TAB_ALIGNMENT, WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.opc.constants import RELATIONSHIP_TYPE as RT

DEFAULT_TEMPLATE = "/Users/mac/Desktop/DE_Lydia _Liu_Milliman.docx"

# ---- Arial advance widths (units / 1000 em), for the 2-line estimator ----
_AW = {
    ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
    '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
    ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015,
    '[': 278, '\\': 278, ']': 278, '^': 469, '_': 556, '`': 333,
    '{': 334, '|': 260, '}': 334, '~': 584,
    'A': 667, 'B': 667, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778, 'H': 722,
    'I': 278, 'J': 500, 'K': 667, 'L': 556, 'M': 833, 'N': 722, 'O': 778, 'P': 667,
    'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944, 'X': 667,
    'Y': 667, 'Z': 611,
    'a': 556, 'b': 556, 'c': 500, 'd': 556, 'e': 556, 'f': 278, 'g': 556, 'h': 556,
    'i': 222, 'j': 222, 'k': 500, 'l': 222, 'm': 833, 'n': 556, 'o': 556, 'p': 556,
    'q': 556, 'r': 333, 's': 500, 't': 278, 'u': 556, 'v': 500, 'w': 722, 'x': 500,
    'y': 500, 'z': 500,
}
for d in "0123456789":
    _AW[d] = 556

FONT_PT = 10.0
# Bullet text column (letter, 0.7in margins → 7.1in; minus ~0.3in bullet indent ≈ 6.8in).
BULLET_COL_PT = 480.0


def text_width_pt(s, pt=FONT_PT):
    return sum(_AW.get(ch, 556) for ch in s) / 1000.0 * pt


def bullet_status(text, col=BULLET_COL_PT):
    """Return (status, lines, second_line_fill) per the 2-line rule."""
    w = text_width_pt(text)
    if w <= col * 1.02:
        return ("SHORT", 1, 0.0)
    if w <= col * 2.0:
        frac = (w - col) / col
        return (("ORPHAN" if frac < 0.5 else "OK"), 2, round(frac, 2))
    return ("OVERFLOW", math.ceil(w / col), round((w / col) - 2, 2))


_BAD_CHARS = {'—': 'em-dash', '–': 'en-dash', '‘': 'smart-quote',
              '’': 'smart-quote', '“': 'smart-quote', '”': 'smart-quote',
              '…': 'ellipsis', '•': 'bullet-glyph', '\t': 'tab'}


def ats_flags(text):
    flags = []
    for ch, name in _BAD_CHARS.items():
        if ch in text:
            flags.append(name)
    non_ascii = sorted({c for c in text if ord(c) > 127} - set(_BAD_CHARS))
    if non_ascii:
        flags.append("non-ascii:" + "".join(non_ascii))
    return flags


# ---------- docx rendering helpers ----------
def font_of(p):
    for r in p.runs:
        return r.font.name, r.font.size
    return None, None


def set_simple(p, text):
    runs = p.runs
    if not runs:
        p.add_run(text)
        return
    runs[0].text = text
    for r in runs[1:]:
        r._element.getparent().remove(r._element)


def clear_tabs(p):
    pPr = p._p.pPr
    if pPr is not None:
        for t in pPr.findall(qn("w:tabs")):
            pPr.remove(t)


def tabbed(p, left, right, usable, left_bold=True, right_italic=False, before=None):
    name, size = font_of(p)
    p.clear()
    clear_tabs(p)
    if before is not None:
        p.paragraph_format.space_before = before
    p.paragraph_format.tab_stops.add_tab_stop(Inches(usable), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p.add_run(left); r1.bold = left_bold
    if name: r1.font.name = name
    if size: r1.font.size = size
    if right:
        r2 = p.add_run("\t" + right); r2.italic = right_italic
        if name: r2.font.name = name
        if size: r2.font.size = size


def add_hyperlink(paragraph, url, text, font_name=None, font_size=None):
    """Append a real clickable hyperlink run (blue, underlined) to a paragraph."""
    r_id = paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True)
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), r_id)
    run = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")
    if font_name:
        rFonts = OxmlElement("w:rFonts")
        rFonts.set(qn("w:ascii"), font_name)
        rFonts.set(qn("w:hAnsi"), font_name)
        rPr.append(rFonts)
    if font_size is not None:
        sz = OxmlElement("w:sz")
        sz.set(qn("w:val"), str(int(font_size.pt * 2)))
        rPr.append(sz)
    color = OxmlElement("w:color"); color.set(qn("w:val"), "0563C1"); rPr.append(color)
    u = OxmlElement("w:u"); u.set(qn("w:val"), "single"); rPr.append(u)
    run.append(rPr)
    t = OxmlElement("w:t"); t.set(qn("xml:space"), "preserve"); t.text = text
    run.append(t)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)
    return hyperlink


def set_contact(p, text, portfolio=None):
    """Render the contact line; if it begins with the portfolio label, link it."""
    name, size = font_of(p)
    p.clear(); clear_tabs(p)
    if portfolio and text.startswith(portfolio["label"]):
        add_hyperlink(p, portfolio["url"], portfolio["label"], name, size)
        rest = text[len(portfolio["label"]):]
    else:
        rest = text
    r = p.add_run(rest)
    if name: r.font.name = name
    if size: r.font.size = size


def skill_line(p, label, items):
    name, size = font_of(p)
    p.clear(); clear_tabs(p)
    r1 = p.add_run(label.rstrip(":") + ": "); r1.bold = True
    if name: r1.font.name = name
    if size: r1.font.size = size
    r2 = p.add_run(items); r2.bold = False
    if name: r2.font.name = name
    if size: r2.font.size = size


def delete(p):
    p._element.getparent().remove(p._element)


def add_bottom_border(p):
    """Add a horizontal divider line under a paragraph (section header rule)."""
    pPr = p._p.get_or_add_pPr()
    for b in pPr.findall(qn("w:pBdr")):
        pPr.remove(b)
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "2")
    bottom.set(qn("w:color"), "000000")
    pBdr.append(bottom)
    pPr.append(pBdr)


def find_header(paras, key):
    for p in paras:
        if p.text.strip().upper().startswith(key):
            return p
    raise ValueError(f"header not found: {key}")


def section_paras(paras, start_hdr, end_hdr):
    """Content paragraphs strictly between two header paragraphs."""
    out, collecting = [], False
    for p in paras:
        if p is start_hdr:
            collecting = True; continue
        if end_hdr is not None and p is end_hdr:
            break
        if collecting:
            out.append(p)
    return out


class Cursor:
    """Inserts cloned stencils sequentially after an anchor element."""
    def __init__(self, anchor_para, parent):
        self.el = anchor_para._p
        self.parent = parent

    def add(self, stencil_para):
        from docx.text.paragraph import Paragraph
        new = copy.deepcopy(stencil_para._p)
        self.el.addnext(new)
        self.el = new
        return Paragraph(new, self.parent)


def render(spec, outpath):
    tmpl = spec.get("template", DEFAULT_TEMPLATE)
    d = Document(tmpl)
    sec = d.sections[0]
    if spec.get("page") == "a4":
        sec.page_width, sec.page_height = Inches(8.27), Inches(11.69)
    usable = sec.page_width.inches - sec.left_margin.inches - sec.right_margin.inches
    paras = list(d.paragraphs)

    h_over = find_header(paras, "OVERVIEW")
    h_skill = find_header(paras, "CORE SKILLS")
    h_exp = find_header(paras, "EXPERIENCE")
    h_edu = find_header(paras, "CERTIFICATION")

    # ---- capture styling stencils up front (cloned via deepcopy, survive deletion) ----
    over_stencil = next(p for p in section_paras(paras, h_over, h_skill) if p.text.strip())
    skill_stencil = next(p for p in section_paras(paras, h_skill, h_exp) if p.text.strip())
    exp0 = [p for p in section_paras(paras, h_exp, h_edu) if p.text.strip()]
    title_stencil = next(p for p in exp0 if "\t" in p.text)
    bullet_stencil = next(p for p in exp0 if "\t" not in p.text)
    edu0 = [p for p in section_paras(paras, h_edu, None) if p.text.strip()]
    cert_stencil = next(p for p in edu0 if "\t" not in p.text)
    row_stencil = next((p for p in edu0 if "\t" in p.text), cert_stencil)
    blank_stencil = next((p for p in paras if not p.text.strip()), skill_stencil)

    def blank(cur):
        p = cur.add(blank_stencil)
        for r in list(p.runs):
            r._element.getparent().remove(r._element)
        clear_tabs(p)
        pf = p.paragraph_format
        pf.space_before = Pt(0); pf.space_after = Pt(0); pf.line_spacing = 1.0
        return p

    def sb(p, pts):
        p.paragraph_format.space_before = Pt(pts)
        p.paragraph_format.space_after = Pt(0)

    # ---- section headers: divider line + tight, even spacing ----
    for h in (h_over, h_skill, h_exp, h_edu):
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        add_bottom_border(h)

    # ---- header: name (centered) + contact (centered) ----
    pre = [p for p in paras if p.text.strip() and paras.index(p) < paras.index(h_over)]
    set_simple(pre[0], spec["name"]); pre[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_contact(pre[1], spec["contact"], spec.get("portfolio")); pre[1].alignment = WD_ALIGN_PARAGRAPH.CENTER

    # ---- overview (header → blank → text) ----
    for p in section_paras(paras, h_over, h_skill):
        delete(p)
    cur = Cursor(h_over, d)
    ov = cur.add(over_stencil); set_simple(ov, spec["overview"]); sb(ov, 0)

    # ---- core skills (header → blank → lines) ----
    for p in section_paras(paras, h_skill, h_exp):
        delete(p)
    cur = Cursor(h_skill, d)
    for it in spec["skills"]:
        sp = cur.add(skill_stencil); skill_line(sp, it["cat"], it["items"]); sb(sp, 0)

    # ---- experience (header → blank → jobs; blank between jobs; only 1st bullet gets a gap) ----
    for p in section_paras(paras, h_exp, h_edu):
        delete(p)
    cur = Cursor(h_exp, d)
    for i, job in enumerate(spec["experience"]):
        if i:
            blank(cur)
        tp = cur.add(title_stencil); tabbed(tp, job["title"], job.get("date", ""), usable); sb(tp, 0)
        cp = cur.add(title_stencil); tabbed(cp, job["company"], job.get("loc", ""), usable, right_italic=True); sb(cp, 0)
        for j, b in enumerate(job["bullets"]):
            bp = cur.add(bullet_stencil); set_simple(bp, b); sb(bp, 4 if j == 0 else 0)

    # ---- education (header → blank → certs → blank → school pairs) ----
    for p in section_paras(paras, h_edu, None):
        delete(p)
    cur = Cursor(h_edu, d)
    if spec["education"].get("certs"):
        cp = cur.add(cert_stencil); set_simple(cp, spec["education"]["certs"]); sb(cp, 0)
    for s in spec["education"]["schools"]:
        blank(cur)
        rp = cur.add(row_stencil); tabbed(rp, s["org"], s.get("loc", ""), usable, right_italic=True); sb(rp, 0)
        dp = cur.add(row_stencil); tabbed(dp, s.get("detail", ""), s.get("meta", ""), usable, left_bold=False, right_italic=True); sb(dp, 0)

    # strip inherited paragraph borders from content; keep the divider rule on headers only
    header_ids = {id(h._p) for h in (h_over, h_skill, h_exp, h_edu)}
    for p in d.paragraphs:
        if id(p._p) in header_ids:
            continue
        pPr = p._p.find(qn("w:pPr"))
        if pPr is not None:
            for b in pPr.findall(qn("w:pBdr")):
                pPr.remove(b)

    d.save(outpath)
    return spec


# ---------- validation ----------
def report(spec):
    print("=== Bullet 2-line check (Arial 10) ===")
    ok = True
    for job in spec["experience"]:
        print(f"  [{job['title']} @ {job['company']}]")
        for b in job["bullets"]:
            st, lines, fill = bullet_status(b)
            af = ats_flags(b)
            mark = "OK " if st == "OK" and not af else "!! "
            if st != "OK" or af:
                ok = False
            extra = f" lines={lines} 2nd-fill={fill}"
            atsmsg = (" ATS:" + ",".join(af)) if af else ""
            print(f"    {mark}{st:8}{extra}{atsmsg}  | {b[:60]}...")
    print(f"\n{'🟢 ALL OK' if ok else '🔴 FIX flagged bullets before delivery'}")
    return ok


def lint_docx(path):
    d = Document(path)
    # bullets = non-tab paragraphs between EXPERIENCE and CERTIFICATION headers
    paras = list(d.paragraphs)
    try:
        h_exp = find_header(paras, "EXPERIENCE"); h_edu = find_header(paras, "CERTIFICATION")
    except ValueError:
        print("Could not locate EXPERIENCE/CERTIFICATION headers."); return
    bullets = [p.text for p in section_paras(paras, h_exp, h_edu)
               if p.text.strip() and "\t" not in p.text]
    print(f"=== Lint {path}: {len(bullets)} bullets ===")
    ok = True
    for b in bullets:
        st, lines, fill = bullet_status(b); af = ats_flags(b)
        if st != "OK" or af: ok = False
        print(f"  {'OK ' if st=='OK' and not af else '!! '}{st:8} lines={lines} 2nd-fill={fill}"
              f"{(' ATS:'+','.join(af)) if af else ''} | {b[:55]}...")
    print("🟢 ALL OK" if ok else "🔴 issues found")


def main():
    if len(sys.argv) >= 3 and sys.argv[1] == "--lint":
        lint_docx(sys.argv[2]); return
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    with open(sys.argv[1], encoding="utf-8") as f:
        spec = json.load(f)
    render(spec, sys.argv[2])
    print(f"OK wrote {sys.argv[2]}\n")
    report(spec)


if __name__ == "__main__":
    main()
