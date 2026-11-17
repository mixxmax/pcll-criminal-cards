---
title: "核心程序流程图索引"
description: "PCLL8050 刑事诉讼程序地图：检控分类、裁判法院到原讼庭、保释、交付审判、审前准备、证据定型、量刑与上诉流程。"
---

# 刑事诉讼程序流程图 Criminal Procedure Flowcharts

> 依据：往届讲义正文（现 `04 Base Lectures/[LG01]–[LG99]`，2025 年版）；2026-09-27 复审已对照本届讲义（`04 Base Lectures/00 This Year Moodle 2026-27/` 的 LGS 1–8，含新入库的本届 LGS 3）修订。本届 LGS 9/10 尚未发布，国安与上诉部分仍依往届 LG09/LG10。
> 术语：transfer（裁判法院 → 区院）= **移交**；committal（裁判法院 → 原讼庭）= **交付**。
> Mermaid 图在 Obsidian 内直接渲染。节点上的天数与 01 Deadlines and Time Limits 一致。
> 与民诉最大的不同：**刑诉没有单一主干**。案件走哪条路，由"罪行分类 + 检方选择 + 被告选择"三者决定，所以第一张图是**分流图**，不是流程图。

---

## 一、总分流：一个案件可能走的三条路

```mermaid
flowchart TD
 A["侦查 Investigation<br/>逮捕 → 48 小时内带见裁判官<br/>LG02"] --> B["检控决定 Charge<br/>检方选择罪名与法院<br/>LG03"]
 B --> C{"罪行分类<br/>Classification"}

 C -->|"Summary offence<br/>纯简易程序罪"| MC["裁判法院 Magistracy<br/>通常在此审理<br/>时效：一般 6 个月<br/>s.26 MO<br/>例外：随可公诉罪一并移交区院 s.88(1)(b) MO<br/>涉儿童 / 精神上无行为能力者 s.79F CPO 交付原讼庭"]
 C -->|"Indictable offence<br/>可公诉罪"| D{"检方决定在哪审"}
 C -->|"Dual offence / triable either way<br/>双重罪 / 两可罪"| E["检方选择以简易或公诉方式起诉<br/>选择直接决定量刑上限<br/>例：s.4(3) DDO<br/>LG01"]

 D -->|"留在裁判法院<br/>简易审理"| MC2["Magistrate 简易审理<br/>s.14A(5) CPO<br/>量刑上限 2 年 / $500,000<br/>s.92 MO"]
 D -->|"移交区域法院"| DC["区域法院 District Court<br/>Transfer s.88 MO<br/>无陪审团<br/>量刑上限 7 年"]
 D -->|"交付原讼法庭"| CFI["原讼法庭 CFI<br/>Committal s.80A / s.80C MO<br/>有陪审团<br/>量刑上限终身"]

 E --> MC2
 E --> DC
 E --> CFI
 MC -.->|"例外路径"| DC
 MC -.->|"例外路径"| CFI

 MC --> V["审理 → 裁决<br/>LG05 / LG07"]
 MC2 --> V
 DC --> V
 CFI --> V
 V --> S["量刑 Sentencing<br/>LG08"]
 S --> AP["上诉 Appeals<br/>路径取决于原审法院<br/>LG10"]

 style C fill:#ffe0b2
 style E fill:#fff9c4
```

> **第一性问题**：读到任何刑诉题，先问"这是什么罪、在哪个法院"。这两个答案决定了后面全部程序、时限和上诉路径。分类错了，后面全错。

---

## 二、法院层级与量刑权限

```mermaid
flowchart TD
 subgraph MC["裁判法院 Magistrates' Courts"]
 SM["特别裁判官 Special Magistrate<br/>s.91 MO<br/>上限 6 个月 / $50,000<br/>不能审第二附表所列可公诉罪"]
 PM["常任裁判官 Permanent Magistrate<br/>s.92 MO<br/>单一罪行上限 2 年<br/>ss.92 & 92A MO<br/>两罪以上连续执行可至 3 年<br/>s.57 MO"]
 end
 subgraph DC["区域法院 District Court"]
 DCJ["区院法官<br/>一次最多 7 年<br/>即使多罪连续执行亦同<br/>但可与正在服的刑期连续执行"]
 end
 subgraph CFI["原讼法庭 Court of First Instance"]
 CFIJ["原讼法庭法官 + 陪审团<br/>最高终身监禁<br/>酌情终身须定最低刑期 s.67B CPO<br/>其后由覆核委员会定期覆核 LGS 8 2026"]
 end

 SM -.->|"超出权限则<br/>移交或交付"| DCJ
 PM -.-> DCJ
 DCJ -.-> CFIJ

 style PM fill:#e1f5fe
 style DCJ fill:#e8f5e9
 style CFIJ fill:#fce4ec
```

**两个容易考的陷阱**

裁判官有权审理某可公诉罪，**不等于**可以判该罪的法定最高刑。s.92 MO 的但书明确限制在 2 年 / $500,000。讲义特意用双感叹号标注了这一点。典型例子是盗窃条例 s.10（抢劫），公诉定罪可判终身，但在裁判法院简易定罪只能判 2 年。

区院法官可以采用**高于 7 年的量刑起点**，只要扣减后的最终刑期不超过 7 年（*HKSAR v Li Yan* [1998] 4 HKC 12，LGS 1 2026；此时仍须给予有意义的认罪扣减）。这是"起点"与"最终刑期"的区分。（*Ngo Van Nam* 是认罪扣减阶梯与区院 Plea Day 的判例，不是本点的出处。）

---

## 三、侦查到首次出庭（LG02）

```mermaid
flowchart TD
 A["逮捕 Arrest"] --> B["立即送交警署主管<br/>delivered forthwith<br/>s.51 PFO"]
 B --> C{"警方查询能否<br/>forthwith 完成？"}
 C -->|"能"| D["决定起诉或释放"]
 C -->|"不能"| E["警方保释<br/>bail on recognisance<br/>可附担保人<br/>着令日后回警署报到"]
 D --> F["落案起诉 Charged<br/>此后除例外情形<br/>不得再问话"]
 F --> G["48 小时内带见裁判官<br/>递解出境案 72 小时<br/>s.52 PFO"]
 G --> H{"裁判官是否准予保释？"}
 H -->|"准"| I["法院保释<br/>可附条件"]
 H -->|"不准"| J["还押 Remand<br/>每次不超过 8 整天<br/>s.79 MO 原文 8 clear days<br/>讲义写 8 days<br/>除双方同意"]
 J -.->|"每次出庭<br/>均须重新考虑保释"| H

 NSL["国安案件例外<br/>裁判官可批准<br/>不起诉羁押延至 14 天<br/>并可限制会见律师<br/>首 48 小时<br/>LG09"]

 style G fill:#ffcdd2
 style NSL fill:#f8bbd0
```

**保释的横向要点**：s.9G(11) CPO 规定被告每次出庭法院都须重新考虑保释——所以被拒一次不是终局。但已两次提出论据后，第三次须证明**情况有实质改变**。谋杀案裁判官与区院法官均无权批准保释（s.9G(10)）。

---

## 四、移交与交付：两条不同的路（LG03 / LGS 3 2026）

```mermaid
flowchart TD
 A["可公诉罪<br/>检方决定不在裁判法院审"] --> B{"去区院还是高院？"}

 B -->|"区域法院"| C["移交 Transfer<br/>s.88(1)(a) MO<br/>裁判官不得拒绝"]
 C --> C1["检方另备控罪书<br/>DCO 附表 1 格式 s.77 DCO<br/>移交后 14 天内提交 s.75(3) DCO<br/>逾期可被撤销 = 无罪 s.75(4) DCO"]
 C1 --> C2["可将简易程序罪<br/>一并移交<br/>s.88(1)(b) MO"]
 C2 --> C3["但量刑受该罪<br/>法定上限约束"]

 B -->|"原讼法庭"| D["交付 Committal<br/>s.80A / s.80C MO"]
 D --> E{"被告是否要求<br/>初步侦讯？"}
 E -->|"不要求（常态）"| F["书面交付 Paper Committal<br/>不审查是否有表面证据<br/>s.80C(4) MO"]
 E -->|"要求"| G["初步侦讯 Preliminary Inquiry<br/>检方举证门槛低<br/>仅需 prima facie case"]

 F --> H["提交公诉书 Indictment<br/>书面交付后 7 天内<br/>经 PI 者：收到案件文件时"]
 G --> I{"是否有足够证据<br/>将被告交付审判？"}
 I -->|"有"| H
 I -->|"不足"| J["撤销控罪 Discharge<br/>s.85 MO"]

 H -->|"书面交付者"| S16{"公诉书后、答辩前<br/>一次性申请 s.16 CPO 撤销？<br/>通知不少于 14 天 Cap. 221G<br/>国安案件不适用"}
 H -->|"经 PI 交付者"| T["答辩 Arraignment → 审讯"]
 S16 -->|"获准：证据不足以<br/>成立 prima facie case"| K["s.16 撤销 = 无罪<br/>终局，除非律政司<br/>依 s.81E CPO 上诉"]
 S16 -->|"不申请或被驳回"| T
 J -.->|"初步侦讯后的撤销<br/>不构成无罪裁决<br/>检方可就同一事实<br/>再次起诉"| L["非终局"]

 style E fill:#ffe0b2
 style S16 fill:#ffe0b2
 style K fill:#c8e6c9
 style L fill:#ffcdd2
```

**这是刑诉最重要的一处逆向知识**：被告要求初步侦讯，看似多一次机会，实则风险不对称——检方门槛只是表面证据，多数被告仍会被交付审判；而即使成功获撤销，**也不构成无罪裁决，检方可以再来一次**（s.85 MO）。相反，书面交付时裁判官不审查表面证据、也不作撤销；被告交付后可**一次性**向原讼庭法官申请 **s.16 CPO 撤销**（公诉书提交后、答辩前；通知不少于 14 日），s.16 撤销等同无罪，除律政司依 s.81E CPO 上诉外是终局的。所以"要不要求 PI"是一个需要权衡的战术决定，不是默认动作。（原稿写"文件移交后的撤销是终局的"，像是裁判官在书面交付时作撤销，已按本届 LGS 3 2026 更正。）

另一处易忽略的不对称：移交区院时可以把简易程序罪**一并**带过去（s.88(1)(b) MO），但交付高院时 s.80A / s.80C **没有对应条文**。所以被告同时面对简易罪与可公诉罪、而案件要上高院时，简易罪会留在裁判法院——程序上被拆成两处。唯一例外是 s.79F CPO（易受伤害证人的快速交付，简易罪亦适用）。

---

## 五、审前时间表（CFI，PD 9.3 / LG05）

```mermaid
flowchart TD
 A["交付 Committal"] --> B["提交公诉书 Indictment<br/>书面交付后 7 天内"]
 B --> C["公诉书后 14 天内<br/>送达已编页交付文件册<br/>Paginated Committal Bundle<br/>PD 9.3 §4.1.1"]
 C --> D["辩方 14 天内<br/>通知法院答辩意向<br/>及是否需排期审讯"]
 C --> E["律政司 21 天内<br/>通知列入定期表<br/>还是速审表"]
 E --> FX["定期表 Fixture List<br/>PD 9.3 附录 D1"]
 E --> EX["速审表 Expedited List<br/>PD 9.3 附录 D2"]

 FX --> FX1["文件册后 42 天内<br/>提交案件管理问卷 CMQ"]
 FX --> FX4["文件册后 42 天内<br/>检方提交并送达专家报告"]
 FX1 --> FX2["案件管理听证 CMH<br/>不早于 CMQ 后 14 天"]
 FX2 --> FX3["CMH 后 28 天内<br/>协议事实 Admitted Facts<br/>及检方 s.65B 证人名单"]
 FX3 --> FX5["完成全部步骤后 7 天内<br/>准备就绪证明书<br/>Certificate of Readiness"]
 FX5 --> L["审前复核 PTR<br/>如有，通常开审前 6–8 周"]

 EX --> EX1["公诉书后 35 天内<br/>检方提交并送达专家报告"]
 EX --> EX2["公诉书后 70 天内<br/>协议事实、s.65B 证人名单<br/>及辩方专家报告"]
 EX --> EX3["CMH 前 7 天<br/>提交案件管理问卷 CMQ"]
 EX3 --> EX4["案件管理听证 CMH<br/>不早于文件册后 6 周"]
 EX4 --> EX5["CMH 后 7 天内<br/>准备就绪证明书<br/>PD 9.3 §6.3.1"]

 L --> M["开审 Trial"]
 EX5 --> M

 N["反对供词可采性的理由<br/>Grounds of Objection<br/>两表同：开审前<br/>不少于 14 天提交"] -.-> M
 O["不在犯罪现场通知<br/>Alibi Notice<br/>开审前不少于 10 天 s.65D"] -.-> M
 P["定期表辩方专家报告<br/>开审前不少于 45 天"] -.-> M
 Q["永久中止诉讼申请通知<br/>开审前不少于 21 天<br/>PD 9.7"] -.-> M

 style N fill:#ffcdd2
 style O fill:#ffcdd2
 style FX fill:#e1f5fe
 style EX fill:#fff9c4
```

> 注意两表的起算点不同：**定期表**——协议事实与 s.65B 证人名单从 **CMH** 起算（28 天）、准备就绪证明书从**完成全部步骤**起算（7 天）、检方专家报告从**提交文件册**起算（42 天）；**速审表**——协议事实、s.65B 证人名单与辩方专家报告从**提交公诉书**起算（70 天），检方专家报告从**提交公诉书**起算（35 天），准备就绪证明书从 **CMH** 起算（7 天）。原图把两表数字混成一条线（并称"全部从 CMH 起算"），已按 PD 9.3 附录 D1/D2 拆开。

---

## 六、证据与通知的双向时限（LG06）

```mermaid
flowchart TD
 subgraph P["检方须先动作"]
 P1["s.65B 书面陈述<br/>送达辩方"]
 P2["PD 保护措施<br/>屏障 / 专用通道 / 支援人员<br/>CFI：CMH 前不迟于 10 天<br/>DC / MC：PTR 或提及聆讯前 10 天<br/>无此聆讯则开审前 21 天"]
 P3["s.79B 电视直播作证<br/>须法院许可或法院主动命令<br/>讲义未列通知日数<br/>与 PD 保护措施是两套机制"]
 end
 subgraph D["辩方的应对窗口"]
 D1["⚠️ s.65B 反对期 材料冲突<br/>14 天：s.65B(2)、LGS 6 / 7 2026<br/>21 天：PD 9.3 §5.3.7(2) 原讼庭<br/>讲义：逾期不反对即获接纳<br/>时限可经双方协议豁免"]
 D2["收到保护措施通知后<br/>7 天内反对"]
 D3["不在犯罪现场通知<br/>开审前不少于 10 天<br/>主动提出"]
 end
 subgraph BOTH["双方共同义务"]
 B1["承认事实通知<br/>Notice to Admit Facts<br/>收到后 21 天内<br/>取得指示并答复"]
 B2["专家证据<br/>as soon as practicable<br/>迟延可致法院不准采用"]
 end

 P1 --> D1
 P2 --> D2

 style D1 fill:#ffcdd2
 style D2 fill:#ffcdd2
```

**这是刑诉里最容易失分的一组时限**：讲义明言 s.65B 陈述若在期限内不反对即获接纳为证据（LGS 6 2026），辩方随之可能失去盘问陈述人的机会（陈述人仍可依 s.65B(4) 经许可或由法院主动传召）。但时限并非绝对：双方可协议豁免送达要求及时限（s.65B(2) 但书），PD 9.3 期限亦写明"or such time as may be allowed by the court"。⚠️ 反对期本身有冲突——s.65B(2) 与本届 LGS 6 / 7 讲义写 14 天，原讼庭 PD 9.3 §5.3.7(2) 写 21 天——两者并列，考前回条文确认。讲义里有案例（Defendants 未 as soon as practicable 委任专家并提交报告）因迟延而被拒绝采用专家证据。

---

## 七、审判中的供词争议（voir dire，LG06 / LG07）

```mermaid
flowchart TD
 A["辩方拟质疑供词可采性"] --> C{"在哪个法院？"}
 C -->|"CFI 有陪审团"| B["原讼庭 PD 9.3：开审前不少于 14 天<br/>提交反对理由<br/>Grounds of Objection"]
 B --> D{"辩方选择<br/>voir dire 是否<br/>在陪审团面前进行？"}
 C -->|"裁判法院 / 区院<br/>无陪审团"| E["法官同时是<br/>事实裁断者<br/>须自我隔离心证<br/>通常以 Alternative Procedure 处理：<br/>控方证人同时就一般争点与可采性作证<br/>可采性证据须在控方案情结束前听完<br/>控方无供词即无案时可先开 voir dire"]
 D -->|"不在陪审团面前<br/>常规做法"| F["陪审团退庭<br/>就可采性单独审理"]
 D -->|"在陪审团面前"| G["被告若要就可采性作证<br/>应作为辩方案情的一部分<br/>而非在此阶段单独作证"]
 F --> H{"裁定可采？"}
 G --> H
 E --> H
 H -->|"可采"| I["供词进入证据"]
 H -->|"不可采"| J["排除"]

 style B fill:#ffcdd2
 style G fill:#fff9c4
```

---

## 八、量刑（LG08）

```mermaid
flowchart TD
 A["定罪 Conviction"] --> B{"是否需要报告？"}
 B -->|"需要"| C["索取报告<br/>Reports"]
 C --> C1["感化报告 PSR<br/>约 2–3 周"]
 C --> C2["更生中心 RC 适合性报告<br/>至少 2 周"]
 C --> C3["s.109A CPO<br/>16–21 岁被告<br/>须先索取报告"]
 B -->|"不需要"| D["直接量刑"]
 C1 --> D
 C2 --> D
 C3 --> D

 D --> E["确定量刑起点<br/>Starting Point<br/>参照 tariff 判例"]
 E --> F["扣减 Discounts<br/>认罪通常 1/3"]
 F --> G["最终刑期"]
 G --> H{"是否有<br/>加重条款？"}
 H -->|"是"| I["例：s.27 OSCO Cap. 455<br/>区院或原讼庭的指明罪行<br/>控方须于最后答辩前发出通知"]
 H -->|"是"| I2["例：s.56A DDO Cap. 134<br/>成年犯招募未成年人参与<br/>可判 15 年或以上的指明罪行"]
 H -->|"否"| J["宣判"]
 I --> J
 I2 --> J

 K["并罚方式<br/>concurrent 同时执行<br/>consecutive 连续执行<br/>影响总刑期与法院权限"] -.-> G

 style E fill:#e1f5fe
 style F fill:#e8f5e9
```

> 量刑题的固定结构：**先定起点（引 tariff 判例）→ 再谈扣减 → 再看是否超出该法院权限**。讲义给了大量 tariff：贩运海洛英／可卡因不超过 10 克审后起点 2–5 年（*HKSAR v Huang Ruifang (No. 3)* [2025] 2 HKLRD 138 已修订 *R v Lau Tak Ming* 的量刑表，LGS 8 2026）、持械抢劫展示刀具起点 5 年（*Mo Kwong-sang v R* [1981] HKCA 62，LG08 / LGS 8 2026）、未经许可受雇 after plea tariff 15 个月（*HKSAR v Usman Butt* [2010] 5 HKLRD 452，出自往届 LG13）。

---

## 九、上诉路径（LG10）— 起算点各不相同

```mermaid
flowchart TD
 subgraph MCA["裁判法院上诉"]
 A1["定罪 / 命令 / 裁定"] --> A2["14 天内提交上诉通知<br/>上诉权 s.113 MO；期限 s.114 MO<br/>自定罪日起算"]
 A2 --> A3["裁判官 15 天内<br/>备妥裁决理由陈述"]
 A3 --> A4["上诉至原讼法庭"]
 A5["复核申请 Review<br/>裁判官自己复核<br/>14 clear days 内<br/>s.104 MO<br/>无须等定罪或无罪"] -.-> A4
 A6["案件呈述 Case Stated<br/>s.105 MO 控辩任一方<br/>仅限法律错误或越权<br/>14 clear days 内书面申请<br/>不可延期"] -.-> A4
 end

 subgraph HCA["区院 / CFI 上诉"]
 B1["定罪 / 判刑"] --> B2["28 天内上诉至上诉法庭<br/>s.83Q CPO<br/>检辩双方同"]
 B2 --> B3{"是否需要许可？"}
 B3 -->|"许可被拒"| B4["14 天内向<br/>上诉法庭全庭申请"]
 B2 -.-> B5["上诉法庭决定后 28 天内<br/>向终审法院申请许可<br/>s.33(1) HKCFAO"]
 end

 subgraph SJ["检方特别途径"]
 C1["仅限国安案件：原讼庭 3 名法官判无罪<br/>律政司就法律问题以案件呈述上诉<br/>由上诉法庭审理<br/>理由记录后 14 clear days 内向原讼庭申请<br/>s.81DA(3)-(4) CPO"]
 C2["NCTA 裁定<br/>须 as soon as practicable<br/>s.81AA CPO"]
 C3["区院判无罪<br/>s.84 DCO 案件呈述至上诉法庭<br/>仅控方、仅法律问题<br/>7 clear days 内"]
 C4["律政司申请复核刑期<br/>s.81A CPO 须许可<br/>判刑后 21 天内"]
 C5["s.16 / s.79G 撤销后<br/>律政司上诉至上诉法庭<br/>s.81E CPO"]
 end

 D["讼费命令上诉<br/>21 天内以动议通知提出<br/>s.19 CCCO"]

 style A2 fill:#ffcdd2
 style B2 fill:#ffcdd2
 style A5 fill:#fff9c4
```

**三个必须分清的数字**：裁判法院 **14 天**（s.113 / s.114 MO）、区院与 CFI **28 天**（s.83Q CPO）、讼费 **21 天**（s.19 CCCO）。另：终审法院许可 **28 天**（s.33(1) HKCFAO）；律政司复核刑期 **21 天**（s.81A CPO）；案件呈述——裁判法院 **14 clear days**（s.105 MO）、区院 **7 clear days**（s.84 DCO，仅控方）；s.81DA 只适用于国安三法官案。

一处特殊规则：若**判刑日距定罪日超过 7 天**，则针对定罪或判刑的上诉通知可自判刑日起算——这解决了定罪后长时间等待量刑报告的情形。

s.104 MO 的复核值得单独记：它是向**原裁判官**申请，14 clear days 内，且**无须等到定罪或无罪裁决**。讲义提到一宗案例，因申请在 14 clear days 内提出，裁判官在判刑后仍非 functus，可以处理改变答辩的申请。这是一条容易被忽略的救济路径。

---

## 十、把流程图和课程进度对起来

前五周（8/31–10/3）刑诉现场只上了 LG01（法院与检方角色）与 LG02（侦查、起诉、时效、保释），第 4 周有一次 SG1（侦查阶段）。也就是上面图三那一段。LG03（律师义务、罪行分类、起草控罪、移交与交付）与 LG04（与检方谈判、审讯概览）是**预录**，须在指定现场课前看完；第 5 周另有 LG7 预录（Practical Litigation Issues，在 LG6 之后看）。

这个安排有个后果：**图一那张分流图对应的 LG03 是录播**，而它恰恰是全科的地基。前五周如果只跟现场课，会缺掉最关键的分类与路由知识。建议早看 LG03 录播。

---

## 相关

- 时限逐条查阅 → 01 Deadlines and Time Limits
- 历年考点分布 → 03 Past Paper Matrix and Analysis
- 三人笔记对比 → 04 Cross-Set Comparison and SG Progression
- 原始讲义 → 04 Base Lectures（本届 `00 This Year Moodle 2026-27/`；往届 `[LG01]–[LG99]`）

---

2026-09-27 复审修订（依据 PCLL Audit 2026-09-27 附录 I）：
- 图四：标题"移交与转介"改为"移交与交付"（transfer=移交，committal=交付，全文统一）；删去"文件移交后的撤销是终局的"错误分支（像是裁判官在书面交付时作撤销），补 s.16 CPO 节点（公诉书后、答辩前，一次，通知 14 天，s.16 撤销除 s.81E 上诉外终局）；补 s.75(3)/(4)、s.77 DCO。
- 图五：PD 9.3 定期表（附录 D1）/ 速审表（附录 D2）分两路；删去"全部从 CMH 起算"的错误说法；补文件册 14 天、辩方专家报告、永久中止 21 天。
- 图六：s.65B 反对期 14 / 21 天并列标 ⚠️（不裁断），删去"失权型""自动成为证据"绝对化表述；s.79B 电视直播与 PD 保护措施分开；补 DC/MC 21 天。
- 图七：14 天反对理由移到原讼庭分支；裁判法院/区院分支补 Alternative Procedure。
- 图八：RC 改"更生中心"、报告"至少 2 周"；"s.27 … 可判 15 年以上"拆为 s.27 OSCO（答辩前通知）与 s.56A DDO（招募未成年人，15 年门槛）；Lau Tak Ming 改注已被 *Huang Ruifang (No. 3)* [2025] 修订；Usman Butt 出处改 LG13。
- 图九：28 天改 s.83Q CPO、14 天期限 s.114 MO；补 s.105 MO、s.84 DCO、s.81A CPO、s.81E CPO、s.33 HKCFAO；s.81DA 标"仅限国安三法官案、由上诉法庭审理"。
- 图一：两可罪连到原讼庭；删"唯一选项"，补 s.88(1)(b) MO、s.79F CPO 例外。图二：3 年上限改 s.57 MO；删"服刑 20 年后覆核"。图三：还押改"8 整天（s.79 MO 原文 8 clear days，库外·已外部核实；讲义写 8 days）"。区院起点判例改 *Li Yan*。
- 文件头与"相关"的过期路径 `01 Lectures (LG)` 已更新。


## 2026-10-06 实质内容入口

本轮在以下主题稿的0A节新增具体规则、条件、证据、程序选择、后果和演练示例。此页原有正文及引注保留；同一细节从下列入口阅读，避免另复制一份。

- 0A. 从截查到警署探访：逐个权力与证据节点
- 0A. 控罪内容、合并与最终审讯路线
- 0A. 答辩选择、谈判记录与案件终结效果（2026-10-10 [09] 并入 [06] 主卡后改指）
- 0A. 披露、供认争议与半程裁决的实质路径
- 0A. 把卷宗转成大律师能执行的指示与审讯文件
- 0A. 量刑选择、计算步骤与可执行请求
- 0A. 保释申请的法律决定链与条件设计（2026-10-10 [16] 并入 [05] 主卡后改指）

**留痕**：2026-10-06新增本入口；未将导航页/清单改造成另一份重复主题稿。
