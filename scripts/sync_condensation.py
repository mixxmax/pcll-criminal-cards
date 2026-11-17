#!/usr/bin/env python3
import os
import re
from pathlib import Path

SOURCE_ROOT = Path('/Users/xiezhijie/Desktop/pcll课程/Criminal Litigation (PCLL8050)/03 Condensation')
TARGET_ROOT = Path('/Users/xiezhijie/pcll-criminal-starlight/src/content/docs')

MAP = {
    '00 Master/00 Master Overview.md': ('master/co00-master-overview.md', '全景总括与刑事诉讼全局流程', '香港大学 PCLL8050 Criminal Litigation 全景总纲：五个底层问题、六个状态变量、八段程序主干、九组程序耦合与逆向决策路线。'),
    '00 Master/01 Deadlines and Time Limits.md': ('master/co01-deadlines-and-time-limits.md', '刑事诉讼刚性时效与法定日历', 'PCLL8050 刑事诉讼时限总表：侦查羁押、检控时效、交付审判、审前程序、证据定型、量刑及三条上诉路径的日期与起算点。'),
    '00 Master/02 Procedural Flowcharts.md': ('master/co02-procedural-flowcharts.md', '核心程序流程图索引', 'PCLL8050 刑事诉讼程序地图：检控分类、裁判法院到原讼庭、保释、交付审判、审前准备、证据定型、量刑与上诉流程。'),
    '00 Master/03 Past Paper Matrix and Analysis.md': ('master/co03-past-paper-matrix.md', '历年试题考点矩阵与出题模型', 'PCLL8050 刑事诉讼历年试题分析：题型、考点频次、RPE 与 memo 写作形态、复习优先级及 LG19–LGS14 回流材料。'),
    '00 Master/04 Cross-Set Comparison and SG Progression.md': ('master/co04-sg-progression.md', 'SG 研习进度与跨组对比', 'PCLL8050 三人笔记横向比较与 SG01–SG08 进阶脉络：同题分歧、作业演进、SG 任务链及课堂使用方法。'),
    '00 Master/Structure Map.md': ('master/co00-structure-map.md', '凝结层宏观知识拓扑结构', 'PCLL8050 凝结层与讲义、SG 的双向结构地图：五维坐标、W1–5 课表、LG 逆向表、主题槽与维护入口。'),
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
}


def clean_obsidian_uri(text: str) -> str:
    text = re.sub(r'\[([^\]]*)\]\((?:obsidian|file)://[^)]*\)', lambda m: m.group(1), text)
    text = re.sub(r'\[([^\]]*)\]\((?!https?://|mailto:)([^)#\s]+)(#[^)\s]+)?\)', lambda m: m.group(1), text)
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
