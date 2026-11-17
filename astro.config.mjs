// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://mixxmax.github.io',
	base: '/pcll-criminal-cards',
	integrations: [
		starlight({
			title: 'PCLL Criminal Litigation',
			description: '香港刑事诉讼制度凝结层与实务辩护在线系统',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mixxmax/pcll-criminal-cards' }
			],
			customCss: [
				'./src/styles/custom.css',
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap',
					},
				},
				{
					tag: 'script',
					attrs: {
						type: 'module',
					},
					content: `
						import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
						const isDark = document.documentElement.dataset.theme === 'dark';
						mermaid.initialize({
							startOnLoad: false,
							theme: isDark ? 'dark' : 'neutral',
							securityLevel: 'loose',
							fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
						});

						const decodeEntities = (str) => {
							const textarea = document.createElement('textarea');
							textarea.innerHTML = str;
							return textarea.value;
						};

						// Post-process SVG styles for dark mode contrast and HUD aesthetic
						const postProcessMermaid = () => {
							const isDark = document.documentElement.dataset.theme === 'dark';
							document.querySelectorAll('.mermaid svg').forEach((svg) => {
								svg.querySelectorAll('.warnnode').forEach((node) => {
									const shape = node.querySelector('polygon, rect, circle, path');
									if (shape) {
										if (isDark) {
											shape.style.setProperty('fill', 'rgba(220, 38, 38, 0.22)', 'important');
											shape.style.setProperty('stroke', '#ef4444', 'important');
										} else {
											shape.style.setProperty('fill', '#fff0f0', 'important');
											shape.style.setProperty('stroke', '#d9534f', 'important');
										}
									}
									const textNodes = node.querySelectorAll('p, span, div, text');
									textNodes.forEach((t) => {
										if (isDark) {
											t.style.setProperty('color', '#fee2e2', 'important');
											t.style.setProperty('fill', '#fee2e2', 'important');
										} else {
											t.style.setProperty('color', '#991b1b', 'important');
											t.style.setProperty('fill', '#991b1b', 'important');
										}
									});
								});
							});
						};

						// 1. Mermaid Flowchart Renderer
						const renderMermaid = async () => {
							const pres = document.querySelectorAll('pre[data-language="mermaid"]');
							if (pres.length === 0) return;

							pres.forEach((pre) => {
								const lines = pre.querySelectorAll('.ec-line');
								let rawText = '';
								if (lines.length > 0) {
									rawText = Array.from(lines).map(l => l.textContent).join('\\n');
								} else {
									rawText = pre.textContent || '';
								}
								rawText = decodeEntities(rawText);

								const container = pre.closest('.expressive-code') || pre;
								const div = document.createElement('div');
								div.className = 'mermaid';
								div.textContent = rawText;
								container.parentElement.replaceChild(div, container);
							});

							try {
								await mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
								postProcessMermaid();
							} catch (err) {
								console.error('Mermaid render error:', err);
							}
						};

						// 2. Obsidian Callouts Renderer (transform blockquotes starting with [!type] into interactive <details>)
						const renderCallouts = () => {
							const blockquotes = document.querySelectorAll('.sl-markdown-content blockquote');
							blockquotes.forEach((bq) => {
								const firstP = bq.querySelector('p');
								if (!firstP) return;
								const text = firstP.textContent || '';
								const match = text.match(/^\\s*\\[!([a-zA-Z0-9_-]+)\\]([+-]?)\\s*(.*)$/);
								if (!match) return;

								const type = match[1].toLowerCase();
								const foldSign = match[2];
								const title = match[3].trim() || type.toUpperCase();

								const icons = {
									info: 'ℹ️',
									abstract: '📋',
									note: '📝',
									tip: '💡',
									warning: '⚠️',
									danger: '🚨',
								};
								const icon = icons[type] || '📌';

								// Remove the callout marker line from the first paragraph
								firstP.innerHTML = firstP.innerHTML.replace(/^\\s*\\[![a-zA-Z0-9_-]+\\][+-]?\\s*.*?(<br\\s*\\/?>|\\n|$)/i, '').trim();
								if (!firstP.textContent.trim() && firstP.children.length === 0) {
									firstP.remove();
								}

								const details = document.createElement('details');
								details.className = 'obsidian-callout callout-' + type;
								if (foldSign !== '-') {
									details.open = true;
								}

								const summary = document.createElement('summary');
								summary.className = 'callout-summary';
								summary.innerHTML = '<span class="callout-icon">' + icon + '</span> <span class="callout-title">' + title + '</span>';
								details.appendChild(summary);

								const body = document.createElement('div');
								body.className = 'callout-body';
								while (bq.firstChild) {
									body.appendChild(bq.firstChild);
								}
								details.appendChild(body);

								bq.parentElement?.replaceChild(details, bq);
							});
						};

						// 3. Interactive Collapsible Sections with Auto-Collapse for §6+
						const initCollapsibleSections = () => {
							if (document.querySelector('.hero')) return;
							const content = document.querySelector('.sl-markdown-content');
							if (!content || content.dataset.collapsibleInit === 'true') return;
							content.dataset.collapsibleInit = 'true';

							const headings = Array.from(content.querySelectorAll('.sl-heading-wrapper.level-h2'));
							if (headings.length === 0) return;

							// Add Quick Actions Toolbar at top
							const toolbar = document.createElement('div');
							toolbar.className = 'section-action-toolbar not-content';
							toolbar.innerHTML = \`
								<span class="toolbar-label">章节快速折叠：</span>
								<button type="button" class="action-btn" id="btn-expand-all">全部展开</button>
								<button type="button" class="action-btn" id="btn-collapse-all">全部折叠</button>
								<button type="button" class="action-btn is-active" id="btn-collapse-audit">仅保留核心正文 (§1–§6)</button>
							\`;
							content.insertBefore(toolbar, content.firstChild);

							let passedSix = false;

							headings.forEach((headingWrapper) => {
								const h2 = headingWrapper.querySelector('h2');
								const text = h2 ? h2.textContent.trim() : '';

								// Check if section is part of §6+ audit/history/log
								if (
									text.startsWith('0. 辐射范围') ||
									text.startsWith('7.') ||
									text.startsWith('0L.') ||
									text.startsWith('8.') ||
									text.includes('留痕') ||
									text.includes('记录') ||
									text.includes('更新') ||
									text.includes('校核')
								) {
									passedSix = true;
								}

								const shouldCollapse = passedSix;

								// Collect siblings until next H2 wrapper or end
								const bodyNodes = [];
								let next = headingWrapper.nextSibling;
								while (next && !(next.nodeType === 1 && next.classList.contains('level-h2') && next.classList.contains('sl-heading-wrapper'))) {
									const current = next;
									next = next.nextSibling;
									bodyNodes.push(current);
								}

								// Create collapsible container
								const sectionBody = document.createElement('div');
								sectionBody.className = 'collapsible-section-body';
								if (shouldCollapse) {
									sectionBody.style.display = 'none';
								}

								headingWrapper.parentNode.insertBefore(sectionBody, next);
								bodyNodes.forEach(node => sectionBody.appendChild(node));

								// Mark heading as interactive
								headingWrapper.classList.add('collapsible-heading');
								headingWrapper.setAttribute('aria-expanded', shouldCollapse ? 'false' : 'true');

								const chevron = document.createElement('span');
								chevron.className = 'section-chevron';
								chevron.textContent = shouldCollapse ? '▶' : '▼';
								headingWrapper.insertBefore(chevron, headingWrapper.firstChild);

								// Toggle on click
								headingWrapper.addEventListener('click', (e) => {
									if (e.target.closest('.sl-anchor-link')) return;
									const isExpanded = headingWrapper.getAttribute('aria-expanded') === 'true';
									if (isExpanded) {
										sectionBody.style.display = 'none';
										headingWrapper.setAttribute('aria-expanded', 'false');
										chevron.textContent = '▶';
									} else {
										sectionBody.style.display = 'block';
										headingWrapper.setAttribute('aria-expanded', 'true');
										chevron.textContent = '▼';
									}
								});
							});

							// Quick Action Handlers
							toolbar.querySelector('#btn-expand-all')?.addEventListener('click', () => {
								headings.forEach((hw) => {
									hw.setAttribute('aria-expanded', 'true');
									const ch = hw.querySelector('.section-chevron');
									if (ch) ch.textContent = '▼';
									const body = hw.nextElementSibling;
									if (body && body.classList.contains('collapsible-section-body')) {
										body.style.display = 'block';
									}
								});
							});

							toolbar.querySelector('#btn-collapse-all')?.addEventListener('click', () => {
								headings.forEach((hw) => {
									hw.setAttribute('aria-expanded', 'false');
									const ch = hw.querySelector('.section-chevron');
									if (ch) ch.textContent = '▶';
									const body = hw.nextElementSibling;
									if (body && body.classList.contains('collapsible-section-body')) {
										body.style.display = 'none';
									}
								});
							});

							toolbar.querySelector('#btn-collapse-audit')?.addEventListener('click', () => {
								let pSix = false;
								headings.forEach((hw) => {
									const text = hw.querySelector('h2')?.textContent.trim() || '';
									if (
										text.startsWith('0. 辐射范围') ||
										text.startsWith('7.') ||
										text.startsWith('0L.') ||
										text.startsWith('8.') ||
										text.includes('留痕') ||
										text.includes('记录') ||
										text.includes('更新') ||
										text.includes('校核')
									) {
										pSix = true;
									}
									const exp = !pSix;
									hw.setAttribute('aria-expanded', exp ? 'true' : 'false');
									const ch = hw.querySelector('.section-chevron');
									if (ch) ch.textContent = exp ? '▼' : '▶';
									const body = hw.nextElementSibling;
									if (body && body.classList.contains('collapsible-section-body')) {
										body.style.display = exp ? 'block' : 'none';
									}
								});
							});

							// Auto-expand targeted section when clicking Right Sidebar TOC
							const expandTarget = (targetId) => {
								if (!targetId) return;
								const targetEl = document.getElementById(targetId);
								if (!targetEl) return;
								const parentBody = targetEl.closest('.collapsible-section-body');
								if (parentBody) {
									parentBody.style.display = 'block';
									const prevHeading = parentBody.previousElementSibling;
									if (prevHeading && prevHeading.classList.contains('collapsible-heading')) {
										prevHeading.setAttribute('aria-expanded', 'true');
										const chev = prevHeading.querySelector('.section-chevron');
										if (chev) chev.textContent = '▼';
									}
								}
							};
							window.expandTarget = expandTarget;

							document.querySelectorAll('starlight-toc a').forEach((a) => {
								a.addEventListener('click', () => {
									const hash = a.getAttribute('href')?.replace(/^#/, '');
									if (hash) expandTarget(decodeURIComponent(hash));
								});
							});

							window.addEventListener('hashchange', () => {
								const hash = window.location.hash.slice(1);
								if (hash) expandTarget(decodeURIComponent(hash));
							});

							// Initial hash check
							if (window.location.hash) {
								expandTarget(decodeURIComponent(window.location.hash.slice(1)));
							}
						};

						// 4. Precision HUD Checklist Widget for Right Sidebar (Dynamic per Card)
						const initHudChecklist = () => {
							const toc = document.querySelector('starlight-toc');
							if (!toc || !toc.parentElement || document.querySelector('.hud-checklist-card')) return;

							const pathname = window.location.pathname;
							const CHECKLISTS = {
								'cr00-overview-flowcharts': {
									title: '总览与流程图清单', badge: '4项核心',
									items: [
										{ label: '全流程白话导引', en: 'Plain-Language Guide', href: '#模块-1全流程一段话白话总导引' },
										{ label: '三维生态位总表', en: 'Three-Dimension Map', href: '#模块-2刑诉全科卡片三维生态位总表' },
										{ label: '纵向状态机图', en: 'State Machine Diagrams', href: '#模块-3全流程纵向状态机图' },
										{ label: '五大易混制度对比', en: 'Comparison Matrix', href: '#模块-4五大高频易混制度横向对比矩阵' },
									]
								},
								'cr00-deadlines-case-matrix': {
									title: '时限与判例矩阵清单', badge: '3项核心',
									items: [
										{ label: '全流程死线联动大表', en: 'Deadline Master Table', href: '#模块-1全流程死线联动大表' },
										{ label: '条例连号解码', en: 'Ordinance Decoder', href: '#模块-2四大核心条例连号解码' },
										{ label: '核心判例微故事矩阵', en: 'Case Story Matrix', href: '#模块-3核心判例微故事矩阵' },
									]
								},
								'cr00-exam-sg-router': {
									title: '考场路由与 SG 清单', badge: '3项核心',
									items: [
										{ label: '题眼信号路由器', en: 'Fact-Signal Router', href: '#模块-1考场逆向题眼信号--制度--攻防动作路由器' },
										{ label: 'SG01–SG08 任务红线', en: 'SG Task Map', href: '#模块-2sg01sg08-任务与红线总表' },
										{ label: '跨章复合大题套路', en: 'Cross-Chapter Playbooks', href: '#模块-3五大跨章复合大题标准答题套路' },
									]
								},
								'co00-master-overview': {
									title: '全景总纲核验清单', badge: '6项核心',
									items: [
										{ label: '五个底层问题', en: 'Five Foundational Questions', href: '#第一部分第一性原理--刑事程序只解决五个底层问题' },
										{ label: '六状态七闸门控制论', en: 'State Variables & Gates', href: '#第二部分控制论视角--案件是一个受约束的动态系统' },
										{ label: '八段程序主干', en: 'Eight-Stage Mainline', href: '#第三部分竖向--一宗案件的八段主干' },
										{ label: '九组横向耦合', en: 'Nine Cross-Couplings', href: '#第四部分横向--程序之间真正会互相牵动的地方' },
										{ label: '逆向决策路线', en: 'Reverse-Engineering Strategy', href: '#第五部分逆向--从客户目的反推程序工具' },
										{ label: '一页速记', en: 'One-Page Revision', href: '#第六部分一页速记' },
									]
								},
								'co01-deadlines-and-time-limits': {
									title: '刑事时效与日历清单', badge: '7项核心',
									items: [
										{ label: '拘捕与羁押时限', en: 'Custody & Remand', href: '#1-拘捕羁押与法律代表' },
										{ label: '检控限制期', en: 'Limitation Periods', href: '#2-检控限制期与时效' },
										{ label: '移交交付答辩', en: 'Transfer / Committal / Plea', href: '#3-移交交付答辩' },
										{ label: '审前披露', en: 'Pre-trial Disclosure', href: '#4-审前与证据披露' },
										{ label: '审讯判刑与上诉', en: 'Trial / Sentence / Appeal', href: '#5-审讯判刑与上诉' },
										{ label: '费用与保释', en: 'Costs & Bail', href: '#6-费用与保释' },
										{ label: '时限地图速查', en: 'Deadline Map', href: '#7-时限地图速查' },
									]
								},
								'co02-procedural-flowcharts': {
									title: '程序路径图清单', badge: '8条路径',
									items: [
										{ label: '侦查到首次出庭', en: 'Investigation to First Appearance', href: '#1-侦查到首次出庭' },
										{ label: '保释到交付', en: 'Bail to Committal', href: '#2-保释到交付' },
										{ label: '移交与交付审判', en: 'Transfer & Committal', href: '#3-移交与交付审判' },
										{ label: '审前准备', en: 'Pre-trial Preparation', href: '#4-审前准备' },
										{ label: '审讯流程', en: 'Trial Flow', href: '#5-审讯流程' },
										{ label: '量刑流程', en: 'Sentencing Flow', href: '#6-量刑流程' },
										{ label: '上诉复核', en: 'Appeal & Review', href: '#7-上诉复核' },
										{ label: '图例', en: 'Legend', href: '#8-图例' },
									]
								},
								'co03-past-paper-matrix': {
									title: '试题考点矩阵清单', badge: '5项核心',
									items: [
										{ label: '考点总览与题型分布', en: 'Question Bank Overview', href: '#1-考点总览与题型分布' },
										{ label: '五组历年试卷', en: 'Five Past Paper Sets', href: '#2-五组历年试卷与分章考点' },
										{ label: '高频知识点与主干机制', en: 'High-Frequency Rules', href: '#3-高频知识点与主干机制' },
										{ label: '出题规律与应试建议', en: 'Exam Patterns', href: '#4-出题规律与应试建议' },
										{ label: '内课复习顺序', en: 'Revision Order', href: '#5-内课复习顺序建议' },
									]
								},
								'co04-sg-progression': {
									title: 'SG 进阶对比清单', badge: '6项核心',
									items: [
										{ label: '三人笔记总览', en: 'Three-Set Overview', href: '#1-三人笔记总览' },
										{ label: '同课多组对比', en: 'Same-Lecture Compare', href: '#2-同一课次的多组对比' },
										{ label: '按主题的对比矩阵', en: 'Topic Comparison Matrix', href: '#3-按主题的对比矩阵' },
										{ label: 'SG01–SG08 进阶', en: 'SG01–SG08 Progression', href: '#4-sg01sg08-进阶能力链' },
										{ label: '考前核心口径', en: 'Exam Core Positions', href: '#5-考前必须统一的核心口径' },
										{ label: '冲突裁决与同步', en: 'Conflict & Sync', href: '#6-冲突裁决与同步建议' },
									]
								},
								'co00-structure-map': {
									title: '知识拓扑结构清单', badge: '6项结构',
									items: [
										{ label: '三层知识塔', en: 'Knowledge Pyramid', href: '#1-三层知识塔' },
										{ label: '层一：知识掌握', en: 'Layer 1 Mastery', href: '#层一知识掌握sg01sg08' },
										{ label: '层二：学习方法', en: 'Layer 2 Methods', href: '#层二学习方法' },
										{ label: '层三：执行动作', en: 'Layer 3 Actions', href: '#层三执行动作' },
										{ label: 'LG 与 SG 映射', en: 'LG & SG Mapping', href: '#4-lg-与-sg-的映射' },
										{ label: '建议顺序', en: 'Recommended Order', href: '#5-建议顺序' },
									]
								},
								'16-institution-criminal-appeals': {
									title: '刑事上诉与判后复核核验清单', badge: '7项核心',
									items: [
										{ label: 'MC 14日三轨选择', en: 'MC Three Tracks', href: '#0b-裁判法院mc判后救济三轨道s104-复核s113-原讼庭上诉与-s105-案件呈述14日死线与互斥选择' },
										{ label: 'CA 28日许可与 Renew', en: 'CA Leave & Renew', href: '#0c-区院dc与原讼庭cfi向上诉庭ca上诉程序28日死线许可要求单一法官初审与合议庭重提renew' },
										{ label: 's.83W 损失时间与 Form VII', en: 'Loss of Time & Form VII', href: '#0d-滥用上诉的上诉风险与退出加刑s83w-损失时间令loss-of-time与-form-vii-放弃上诉' },
										{ label: 's.83(1) 定罪上诉与 Proviso', en: 'Conviction Appeal & Proviso', href: '#0e-对定罪上诉appeal-against-convictions831-三大法定理由proviso-但书条款与-s83v-新证据准入ladd-v-marshall' },
										{ label: 's.83V 新证据 Ladd v Marshall', en: 'Fresh Evidence', href: '#0e6-二审采纳新证据之极高门槛cpo-s83v-与-ladd-v-marshall-三步门槛' },
										{ label: '律政司 s.81A 与 s.84 DCO', en: 'SJ Review & Case Stated', href: '#0g-控方律政司司长-sj的判后救济途径s81a-刑期复核明显过轻无罪案件呈述上诉s84-dco--s81e-cpo与法律问题转介' },
										{ label: 'CFA s.32 双闸口与 Lau Man Kin', en: 'CFA Gates & Bail', href: '#0h-终审法院cfa终审上诉双闸口hkcfao-s32上诉待决保释接口lau-man-kin与上诉讼费' },
									]
								},
								'05-institution-bail': {
									title: '保释制度核验清单', badge: '7项核心',
									items: [
										{ label: 's.9D 保释推定', en: 'Presumption of Bail', href: '#0b1-s9d-获保推定法庭权限与推定的边界' },
										{ label: 's.9G 拒保理由与因素', en: 's.9G Grounds & Factors', href: '#0b2-s9g-拒保理由与评估因素攻防' },
										{ label: '保释条件库', en: 'Condition Catalogue', href: '#0b3-保释条件库红线' },
										{ label: '上诉待决保释', en: 'Bail Pending Appeal', href: '#0c5-上诉待决保释轨道与门槛' },
										{ label: '拒保后救济', en: 'Post-Refusal Remedies', href: '#0e1-拒保后救济族' },
										{ label: '违令与潜逃', en: 'Breach & Absconding', href: '#0d3-违令潜逃与没收的执行力' },
										{ label: '总结与雷区', en: 'Summary & Traps', href: '#0j-总结与高危雷区' },
									]
								},
								'06-institution-plea-bind-over': {
									title: '答辩建议核验清单', badge: '4项规矩',
									items: [
										{ label: '即时不答辩的时机', en: 'Timing of No Plea', href: '#0a1-即时不答辩与先答辩的取舍' },
										{ label: '书面答辩建议', en: 'Written Plea Advice', href: '#0a3-书面答辩建议四大规矩' },
										{ label: '认罪协商与折扣', en: 'Plea Negotiation & Discount', href: '#0a4-认罪协商与折扣时点' },
										{ label: 'ONE bind over', en: 'O.N.E. Bind Over', href: '#0a6-one-bind-over' },
										{ label: '定罪与终局效果', en: 'Finality & Consequences', href: '#0a7-定罪终局性与程序后果' },
									]
								},
								'07-institution-investigation-rights': {
									title: '侦查权利核验清单', badge: '7项核心',
									items: [
										{ label: '截查与拘捕程序', en: 'Stop & Arrest', href: '#1-截查与拘捕' },
										{ label: '带往警署与寄存物', en: 'Custody & Property', href: '#2-带往警署与物品寄存' },
										{ label: '公平讯问规例', en: '1992 R&Ds', href: '#3-公平讯问规例1992-rds' },
										{ label: '羁押期权利', en: 'Custody Rights', href: '#4-羁押期间权利' },
										{ label: '供词与证据争议', en: 'Confessions & Evidence', href: '#5-供词与证据争议' },
										{ label: '辩方应对', en: 'Defence Response', href: '#6-辩方应对' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#7-高危雷区' },
									]
								},
								'08-institution-charges-trial-route': {
									title: '控罪与审讯路线核验清单', badge: '7项核心',
									items: [
										{ label: '控罪起草与合并', en: 'Drafting & Joinder', href: '#1-控罪起草与合并' },
										{ label: '罪行分类', en: 'Offence Classification', href: '#2-罪行分类' },
										{ label: '公诉分流', en: 'Prosecution Routes', href: '#3-公诉分流' },
										{ label: '移交与交付', en: 'Transfer & Committal', href: '#4-移交与交付' },
										{ label: '审讯管辖', en: 'Trial Jurisdiction', href: '#5-审讯管辖' },
										{ label: '答辩与程序选择', en: 'Plea & Procedure', href: '#6-答辩与程序选择' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#7-高危雷区' },
									]
								},
								'10-framework-courts-jurisdiction': {
									title: '法院管辖核验清单', badge: '6项核心',
									items: [
										{ label: '刑事法院层级', en: 'Court Hierarchy', href: '#1-刑事法院层级' },
										{ label: '原讼庭管辖', en: 'CFI Jurisdiction', href: '#2-原讼庭管辖' },
										{ label: '区域法院管辖', en: 'DC Jurisdiction', href: '#3-区域法院管辖' },
										{ label: '裁判法院管辖', en: 'MC Jurisdiction', href: '#4-裁判法院管辖' },
										{ label: '法律代表规则', en: 'Legal Representation', href: '#5-法律代表规则' },
										{ label: '特别管辖与移送', en: 'Special Jurisdiction', href: '#6-特别管辖与移送' },
									]
								},
								'11-framework-police-powers-search': {
									title: '警权与搜查核验清单', badge: '6项核心',
									items: [
										{ label: '截停与搜查权力', en: 'Stop & Search', href: '#1-截停与搜查权力' },
										{ label: '进入与搜查处所', en: 'Entry & Premises', href: '#2-进入与搜查处所' },
										{ label: '扣留与扣押', en: 'Detention & Seizure', href: '#3-扣留与扣押' },
										{ label: '羁押规例', en: 'Custody Rules', href: '#4-羁押规例' },
										{ label: '辩方救济', en: 'Defence Remedies', href: '#5-辩方救济' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#6-高危雷区' },
									]
								},
								'12-framework-prosecution-rules': {
									title: '检控与启动核验清单', badge: '6项核心',
									items: [
										{ label: '刑事检控原则', en: 'Prosecution Principles', href: '#1-刑事检控原则' },
										{ label: '程序启动方式', en: 'Commencement Methods', href: '#2-程序启动方式' },
										{ label: '1992 R&Ds', en: '1992 Rules & Directions', href: '#3-1992-rds' },
										{ label: '控罪与传票', en: 'Charges & Summons', href: '#4-控罪与传票' },
										{ label: '披露与答辩', en: 'Disclosure & Plea', href: '#5-披露与答辩' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#6-高危雷区' },
									]
								},
								'13-institution-criminal-evidence': {
									title: '刑事证据争议核验清单', badge: '7项核心',
									items: [
										{ label: '可采性总框架', en: 'Admissibility Framework', href: '#1-可采性总框架' },
										{ label: '自白与供词', en: 'Confessions', href: '#2-自白与供词' },
										{ label: 'voir dire 三步测试', en: 'Voir Dire Test', href: '#3-voir-dire-三步测试' },
										{ label: '案中案程序', en: 'Trial within a Trial', href: '#4-案中案程序' },
										{ label: '免受侵扰权利', en: 'Right to Silence', href: '#5-免受侵扰权利' },
										{ label: '辨认与实物证据', en: 'Identification & Real Evidence', href: '#6-辨认与实物证据' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#7-高危雷区' },
									]
								},
								'14-institution-trial-preparation': {
									title: '备审准备核验清单', badge: '6项核心',
									items: [
										{ label: '卷宗与指示', en: 'Brief & Instructions', href: '#1-卷宗与指示' },
										{ label: 's.65B 陈述书', en: 's.65B Statements', href: '#2-s65b-陈述书' },
										{ label: 's.65C 承认事实', en: 's.65C Admissions', href: '#3-s65c-承认事实' },
										{ label: '证人与专家准备', en: 'Witness & Expert Prep', href: '#4-证人与专家准备' },
										{ label: '审讯文件与排期', en: 'Trial Bundles & Listing', href: '#5-审讯文件与排期' },
										{ label: '高危雷区', en: 'High-Risk Traps', href: '#6-高危雷区' },
									]
								},
								'15-institution-sentencing-system': {
									title: '量刑核验清单', badge: '7项核心',
									items: [
										{ label: '量刑起点与指引', en: 'Starting Point & Guidelines', href: '#0c-启动点法与量刑指引' },
										{ label: '认罪与协助折扣', en: 'Plea & Assistance Discounts', href: '#0d-认罪折扣分档时机与基数' },
										{ label: '四原则与加减因素', en: 'Four Principles', href: '#0b4-四原则与艺术而非科学' },
										{ label: '非监禁与设施选项', en: 'Non-Custodial & Facilities', href: '#0h-非监禁与设施类选择' },
										{ label: '附加命令与讼费', en: 'Ancillary Orders & Costs', href: '#0j-附加命令住院充公没收赔偿归还取消资格与-cbo' },
										{ label: '上诉量刑互动', en: 'Sentence Appeal', href: '#0l-上诉量刑互动从判刑理由倒推' },
										{ label: '实务暗礁清单', en: 'Practical Traps', href: '#0m-实务暗礁与核对清单' },
									]
								},
							};

							let currentCard = null;
							for (const key of Object.keys(CHECKLISTS)) {
								if (pathname.includes(key)) { currentCard = key; break; }
							}
							if (!currentCard) return;
							const config = CHECKLISTS[currentCard];
							if (!config) return;

							const widget = document.createElement('div');
							widget.className = 'hud-checklist-card not-content';
							const itemsHtml = config.items.map(function(it) {
								return '<a href="' + it.href + '" class="hud-check-item"><span class="hud-check-icon">✓</span><span class="hud-check-label">' + it.label + ' <span class="hud-en">' + it.en + '</span></span></a>';
							}).join('');
							widget.innerHTML = '<div class="hud-checklist-header"><div class="hud-header-title"><span class="hud-pulse-dot"></span><span class="hud-title-text">' + config.title + '</span></div><span class="hud-badge-count">' + config.badge + '</span></div><div class="hud-checklist-items">' + itemsHtml + '</div>';
							toc.parentElement.insertBefore(widget, toc);
							widget.querySelectorAll('.hud-check-item').forEach((a) => {
								a.addEventListener('click', () => {
									const hash = a.getAttribute('href')?.replace(/^#/, '');
									if (hash && window.expandTarget) window.expandTarget(decodeURIComponent(hash));
								});
							});
						};

						const setup = () => {
							renderMermaid();
							renderCallouts();
							initCollapsibleSections();
							initHudChecklist();
						};

						if (!window.__themeObserverSet) {
							window.__themeObserverSet = true;
							const themeObserver = new MutationObserver((mutations) => {
								for (const m of mutations) {
									if (m.attributeName === 'data-theme') postProcessMermaid();
								}
							});
							themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
						}

						if (document.readyState === 'loading') {
							document.addEventListener('DOMContentLoaded', setup);
						} else {
							setup();
						}
						document.addEventListener('astro:page-load', setup);
					`
				}
			],
			sidebar: [
				{
					label: '🧭 全景总括与时钟体系 (Master & Tools)',
					items: [
						{ label: 'CO00 · 全景总纲与刑事流程', slug: 'master/co00-master-overview' },
						{ label: 'CO00 · 宏观知识拓扑结构', slug: 'master/co00-structure-map' },
						{ label: 'CO01 · 刑事诉讼时效与法定日历', slug: 'master/co01-deadlines-and-time-limits' },
						{ label: 'CO02 · 核心程序流程图索引', slug: 'master/co02-procedural-flowcharts' },
						{ label: 'CO03 · 历年试题考点矩阵', slug: 'master/co03-past-paper-matrix' },
						{ label: 'CO04 · SG 研习进度与跨组对比', slug: 'master/co04-sg-progression' },
						{ label: 'CR00 · 刑事诉讼全科总览与程序图谱', slug: 'master/cr00-overview-flowcharts' },
						{ label: 'CR00 · 刑诉法定时限与判例矩阵', slug: 'master/cr00-deadlines-case-matrix' },
						{ label: 'CR00 · 刑诉考场路由与 SG 战法', slug: 'master/cr00-exam-sg-router' },
					],
				},
				{
					label: '🏛️ 刑事制度凝结层 (Institutions 05–15)',
					items: [
						{ label: '05 · 保释制度体系（Bail）', slug: 'institutions/05-institution-bail' },
						{ label: '06 · 答辩建议与准守行为制度', slug: 'institutions/06-institution-plea-bind-over' },
						{ label: '07 · 调查取证、羁押权利与辩方应对', slug: 'institutions/07-institution-investigation-rights' },
						{ label: '08 · 控罪起草、公诉分流与审讯管辖', slug: 'institutions/08-institution-charges-trial-route' },
						{ label: '10 · 刑事法院层级、管辖权与辩护代理', slug: 'institutions/10-framework-courts-jurisdiction' },
						{ label: '11 · 警权行使、截停搜查与羁押规例', slug: 'institutions/11-framework-police-powers-search' },
						{ label: '12 · 刑事检控、程序启动与 1992 规例', slug: 'institutions/12-framework-prosecution-rules' },
						{ label: '13 · 刑事证据争议（自白、案中案与免受侵扰）', slug: 'institutions/13-institution-criminal-evidence' },
						{ label: '14 · 备审准备、s.65B陈述书与审讯卷宗', slug: 'institutions/14-institution-trial-preparation' },
						{ label: '15 · 量刑体系、求情指引与刑罚种类', slug: 'institutions/15-institution-sentencing-system' },
						{ label: '16 · 刑事上诉与判后复核体系', slug: 'institutions/16-institution-criminal-appeals' },
					],
				},
			],
		}),
	],
});
