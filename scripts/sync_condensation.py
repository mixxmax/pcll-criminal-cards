#!/usr/bin/env python3
import os
import re
from pathlib import Path

COURSE_ROOT = Path('/Users/xiezhijie/Desktop/pcll课程/Criminal Litigation (PCLL8050)')
SOURCE_ROOT = COURSE_ROOT / '03 Condensation'
TARGET_ROOT = Path('/Users/xiezhijie/pcll-criminal-starlight/src/content/docs')
ASSETS_DIR = Path('/Users/xiezhijie/pcll-criminal-starlight/public/files/documents')
SITE_BASE = '/pcll-criminal-cards'

# Files published for download. Key: path relative to COURSE_ROOT. Value: public filename.
ASSET_MAP = {
    '01 SG/SG02 Research, Letter of Advice, O.N.E. Bind/05 Exercise 2(a)(ii) - Letter of Advice - Jeff Sham.docx': 'sg02-letter-of-advice.docx',
    '01 SG/SG02 Research, Letter of Advice, O.N.E. Bind/06 Exercise 3 - Post-interview ONE Letter - Willy Ma.docx': 'sg02-one-bind-over-letter.docx',
    '01 SG/SG04 Aspects of Trial Process & Drafting a Br/04 Litigation Exercise 1 - Model Brief to Counsel - Willy Ma.docx': 'sg04-model-brief.docx',
    '01 SG/SG04 Aspects of Trial Process & Drafting a Br/04 Litigation Exercise 1 - Model Brief to Counsel - Willy Ma - EXPERIMENT 5 Pages.docx': 'sg04-model-brief-5pages.docx',
    '01 SG/SG05 Case Preparation: s.65B Statements and s/04 Exercise 3 - Revised Admitted Facts and Explanation.docx': 'sg05-revised-admitted-facts.docx',
    '01 SG/SG05 Case Preparation: s.65B Statements and s/PRECEDENT ADMITTED FACTS s. 65 C.docx': 'precedent-admitted-facts-65c.docx',
    '01 SG/SG05 Case Preparation: s.65B Statements and s/Prosecution Draft Admitted Facts (1 September 20XX).pdf': 'prosecution-draft-admitted-facts.pdf',
    '01 SG/SG06 Pre-Trial and Trial Issues (Objection to/05 Exercise 4 - John Lace - Practice Draft Notice.docx': 'sg06-practice-draft-notice.docx',
    '01 SG/SG08 Appeals: Review Against Conviction & Sen/03 Exercise 2 - Jeff Sham Appeal Letter.docx': 'sg08-appeal-letter.docx',
    '01 SG/SG08 Appeals: Review Against Conviction & Sen/05 Exercise 4 - John Lace Research Chart.docx': 'sg08-lace-research-chart.docx',
    '01 SG/SG08 Appeals: Review Against Conviction & Sen/06 Exercise 4 - John Lace Memorandum.docx': 'sg08-memorandum.docx',
    '05 Base Prior-year SG/[SG02] Research, Letter of Advice, O.N.E. Bind Over/00 Official/8050 SG2 ONEBO Instructions.docx': 'prior-onebo-instructions.docx',
    '05 Base Prior-year SG/[SG02] Research, Letter of Advice, O.N.E. Bind Over/00 Official/Precedent Bind Over 2.pdf': 'prior-precedent-bind-over-2.pdf',
    '05 Base Prior-year SG/[SG02] Research, Letter of Advice, O.N.E. Bind Over/Set 1/1_Letter of Advice.docx': 'prior-loa-set1.docx',
    '05 Base Prior-year SG/[SG02] Research, Letter of Advice, O.N.E. Bind Over/Set 1/2_O.N.E. Bind Over Letter.docx': 'prior-onebo-set1.docx',
    '05 Base Prior-year SG/[SG04] Aspects of Trial Process & Drafting a Brief to Counsel/00 Official/Precedent Brief to Counsel A.pdf': 'prior-precedent-brief-a.pdf',
    '05 Base Prior-year SG/[SG04] Aspects of Trial Process & Drafting a Brief to Counsel/00 Official/crim.pro.guidelines.brief.counsel.2025.docx': 'prior-guidelines-brief-2025.docx',
    '05 Base Prior-year SG/[SG05] Case Preparation: s.65B Statements and s.65C Admitted Facts/00 Official/PRECEDENT ADMITTED FACTS s. 65 C.docx': 'prior-precedent-admitted-facts.docx',
    '05 Base Prior-year SG/[SG06] Pre-Trial and Trial Issues (Objection to Confession)/00 Official/Precedent Notice of Objection to Admissibility SGS 6.docx': 'prior-precedent-notice-sgs6.docx',
    '05 Base Prior-year SG/[SG06] Pre-Trial and Trial Issues (Objection to Confession)/00 Official/Guidelines for Drafting a Notice of Objection to the Admissibility of a Confession REVISED (Set 1).docx': 'prior-guidelines-notice-set1.docx',
    '05 Base Prior-year SG/[SG06] Pre-Trial and Trial Issues (Objection to Confession)/00 Official/Guidelines for Drafting a Notice of Objection to the Admissibility of a Confession REVISED (Set 3).docx': 'prior-guidelines-notice-set3.docx',
    '05 Base Prior-year SG/[SG06] Pre-Trial and Trial Issues (Objection to Confession)/00 Official/SG6 - Objection to Admissibility (SAMPLE).pdf': 'prior-sample-objection.pdf',
    '05 Base Prior-year SG/[SG08] Appeals: Review Against Conviction & Sentence/00 Official/UK School of Law on Drafting Grounds of Appeal for SGS 8.pdf': 'prior-uk-grounds-of-appeal.pdf',
    '06 Base Exam Notes/00 This Year Marksheets 2026/Guidelines for Drafting a Notice of Objection to the Admissibility of a Confession 2026.docx': 'guidelines-notice-objection-2026.docx',
    '06 Base Exam Notes/00 This Year Marksheets 2026/crim.pro.guidelines.ONE.BO.letter.2026.docx': 'guidelines-one-bo-letter-2026.docx',
    '06 Base Exam Notes/00 This Year Marksheets 2026/crim.pro.guidelines.brief.counsel.2026.docx': 'guidelines-brief-counsel-2026.docx',
    '06 Base Exam Notes/00 This Year Marksheets 2026/crim.pro.guidelines.client.letter.2026.docx': 'guidelines-client-letter-2026.docx',
}

MAP = {
    '01 Institutions/05 Institution - Bail.md': ('institutions/05-institution-bail.md', '05 · 保释制度体系（Bail）', 'PCLL8050 保释制度全景：s.9D 推定与 s.9G 拒保、警署及法庭保释、8 日上限、担保人、条件设计、违令与五阶段程序联动。'),
    '01 Institutions/06 Institution - Plea Advice and ONE Bind Over.md': ('institutions/06-institution-plea-bind-over.md', '06 · 答辩建议与准守行为制度（Plea & ONE）', 'PCLL8050 答辩意见、较轻替代认罪、O.N.E. bind over、Prosecution Code 10.6/10.7、Ngo Van Nam 与 Lam Kai Man 认罪折扣实务。'),
    '01 Institutions/07 Institution - Investigation Rights and Defence.md': ('institutions/07-institution-investigation-rights.md', '07 · 调查取证、羁押权利与辩方应对', 'PCLL8050 侦查阶段辩方权利：截停搜查、无令拘捕、法律代表、讯问记录、供词、48 小时提堂与警署会见策略。'),
    '01 Institutions/08 Institution - Charges and Trial Route.md': ('institutions/08-institution-charges-trial-route.md', '08 · 控罪起草、公诉分流与审讯管辖', 'PCLL8050 控罪起草与审讯路线：元素与 duplicity、可公诉／简易／两可罪、DC transfer、CFI committal、PI 与答辩时点。'),
    '01 Institutions/10 Framework - Criminal Courts, Jurisdiction & Legal Representation.md': ('institutions/10-framework-courts-jurisdiction.md', '10 · 刑事法院层级、管辖权与辩护代理', 'PCLL8050 刑事法院层级、管辖权、量刑权限、陪审团、DLS 与法律援助双轨及答辩地点规则。'),
    '01 Institutions/11 Framework - Police Powers & Search Rules.md': ('institutions/11-framework-police-powers-search.md', '11 · 警权行使、截停搜查与羁押规例', 'PCLL8050 警方权力与搜查规则：可疑及犯罪截查、无令拘捕、公民拘捕、处所破门、手机及数码设备搜查。'),
    '01 Institutions/12 Framework - Prosecution, Commencement & 1992 R&Ds.md': ('institutions/12-framework-prosecution-rules.md', '12 · 刑事检控、程序启动与 1992 规例', 'PCLL8050 检控决策、私人检控、控罪修订、五大启动路径、6 个月时效及 1992 Rules and Directions 下供词排除。'),
    '01 Institutions/13 Institution - Criminal Evidence Disputes.md': ('institutions/13-institution-criminal-evidence.md', '13 · 刑事证据争议（自白、案中案与免受侵扰）', 'PCLL8050 刑事证据争议：控方披露、辩方 alibi 通知、供认挑战、voir dire、Turnbull 识别证据与剩余酌情权。'),
    '01 Institutions/14 Institution - Trial Preparation and Documents.md': ('institutions/14-institution-trial-preparation.md', '14 · 备审准备、s.65B陈述书与审讯卷宗', 'PCLL8050 审讯准备与文书：案卷分析、Brief to Counsel、proof of evidence、s.65B/s.65C、披露、PTR/CMH 与审讯文件。'),
    '01 Institutions/15 Institution - Sentencing System.md': ('institutions/15-institution-sentencing-system.md', '15 · 量刑体系、求情指引与刑罚种类', 'PCLL8050 量刑体系：刑罚目的、起点法、认罪折扣、协助执法、s.27 OSCO、s.56A DDO、并串刑、附加命令、讼费与上诉互动。'),
    '01 Institutions/16 Institution - Criminal Appeals, Review & Case Stated.md': ('institutions/16-institution-criminal-appeals.md', '16 · 刑事上诉与判后复核体系', 'PCLL8050 刑事上诉与判后复核：裁判法院三轨救济、区院/原讼庭上诉庭许可、律政司刑期复核、案件呈述与终审法院上诉。'),
    '02 Documents/01 Document - Letter of Advice.md': ('documents/01-letter-of-advice.md', 'D01 · Letter of Advice 答辩建议信', '教授对答辩建议信的全部起草口径：语气四戒、Sch.3 自查、折扣阶梯、s.51 替代控罪与批改反馈。'),
    '02 Documents/02 Document - ONE Bind Over Letter.md': ('documents/02-one-bind-over-letter.md', 'D02 · O.N.E. Bind Over 申请信', '教授对 bind over 申请信的全部起草口径：WP 性质、措辞红线、赔偿 sweetener 与四条批改红线。'),
    '02 Documents/03 Document - Brief to Counsel.md': ('documents/03-brief-to-counsel.md', 'D03 · Brief to Counsel 指示大律师书', '教授（阅卷人）对 Brief 的全部起草口径：事务律师自分析、materiality 测试、谦逊句式与形式细节。'),
    '02 Documents/04 Document - Revised Admitted Facts.md': ('documents/04-revised-admitted-facts.md', 'D04 · Revised Admitted Facts 承认事实反建议稿', '教授对 s.65C 承认事实修订稿的全部起草口径：逐字核对、措辞陷阱、净稿操作与主动纳入。'),
    '02 Documents/05 Document - Notice of Objection to Confession.md': ('documents/05-notice-of-objection.md', 'D05 · Notice of Objection 供认反对通知书', '教授对供认可采性反对通知书的全部起草口径：结论先行、逐句定性、PIA/自愿性/剩余裁量构件。'),
    '02 Documents/06 Document - Appeal Letter to Client.md': ('documents/06-appeal-letter-to-client.md', 'D06 · Appeal Letter to Client 上诉前景信', '教授对判后客户上诉建议信的全部起草口径：reasonable grounds 门槛、强弱评级、刑期现实与保释操作。'),
    '02 Documents/07 Document - Memorandum to Partner.md': ('documents/07-memorandum-to-partner.md', 'D07 · Memorandum to Partner 内部上诉备忘录', '教授对判后内部备忘录的全部起草口径：理由评级、表格死线、归属判断与建议纪律。'),
}


def copy_assets() -> None:
    import shutil
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    for rel, public_name in ASSET_MAP.items():
        src = COURSE_ROOT / rel
        if not src.exists():
            raise SystemExit(f'Missing asset source: {src}')
        shutil.copy2(src, ASSETS_DIR / public_name)
    print(f'copied {len(ASSET_MAP)} asset files -> {ASSETS_DIR}')


def rewrite_asset_links(text: str, source_dir: Path) -> str:
    """Rewrite markdown links that resolve to ASSET_MAP files into site download URLs."""
    from urllib.parse import unquote
    def repl(m: 're.Match') -> str:
        label, target = m.group(1), m.group(2)
        raw = target.strip()
        if raw.startswith('<') and raw.endswith('>'):
            raw = raw[1:-1]
        resolved = (source_dir / unquote(raw)).resolve()
        try:
            rel = resolved.relative_to(COURSE_ROOT)
        except ValueError:
            return m.group(0)
        if str(rel) in ASSET_MAP:
            return f'[{label}]({SITE_BASE}/files/documents/{ASSET_MAP[str(rel)]})'
        return m.group(0)
    return re.sub(r'\[([^\]]+)\]\((<[^>]+>|[^)\s]+)\)', repl, text)


def clean_obsidian_uri(text: str) -> str:
    text = re.sub(r'\[([^\]]*)\]\((?:obsidian|file)://[^)]*\)', lambda m: m.group(1), text)
    # Keep http(s), mailto and root-relative site links (e.g. /pcll-criminal-cards/files/...).
    text = re.sub(r'\[([^\]]*)\]\((?!https?://|mailto:|/)(<[^>]+>|[^)#\s]+)(#[^)\s]+)?\)', lambda m: m.group(1), text)
    text = re.sub(r'obsidian://[^\s)\]]+', '', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text


def clean_frontmatter(frontmatter: str) -> str:
    lines = frontmatter.splitlines()
    out = []
    skip_indent = False
    for line in lines:
        key_match = re.match(r'^([A-Za-z_\u4e00-\u9fff][\w\u4e00-\u9fff-]*)\s*:', line)
        if key_match:
            key = key_match.group(1)
            skip_indent = key in {'title', 'description', 'description_en', 'url'}
            if skip_indent:
                continue
        elif line.strip() == '' or line.startswith((' ', '\t', '- ')):
            if skip_indent:
                continue
        else:
            skip_indent = False
        out.append(clean_obsidian_uri(line))
    return '\n'.join(out).strip()


def main() -> None:
    copy_assets()
    missing = []
    for source_rel, (target_rel, title, description) in MAP.items():
        source = SOURCE_ROOT / source_rel
        target = TARGET_ROOT / target_rel
        if not source.exists():
            missing.append(str(source))
            continue
        raw = source.read_text(encoding='utf-8')
        if raw.startswith('---\n'):
            parts = raw.split('---\n', 2)
            if len(parts) == 3:
                frontmatter, body = parts[1], parts[2]
            else:
                frontmatter, body = '', raw
        else:
            frontmatter, body = '', raw
        frontmatter = clean_frontmatter(frontmatter)
        body = rewrite_asset_links(body, source.parent)
        body = clean_obsidian_uri(body)
        fm = f'title: "{title}"\ndescription: "{description}"'
        if frontmatter:
            fm += '\n' + frontmatter
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(f'---\n{fm}\n---\n\n{body.lstrip()}', encoding='utf-8')
        print(f'synced {source_rel} -> {target_rel}')
    if missing:
        raise SystemExit('Missing source files:\n' + '\n'.join(missing))

if __name__ == '__main__':
    main()
