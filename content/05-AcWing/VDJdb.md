[VDJdb](https://vdjdb.com/)

VDJdb是一个经过人工整理和标准化的T细胞受体（TCR）抗原特异性数据库，主要收集已被实验验证的TCR序列及其对应的抗原表位（epitope）和MHC/HLA背景信息，用于研究T细胞受体的免疫识别关系。该数据库通过对不同文献和实验数据进行统一格式化、与生殖系V/J基因数据库比对校验，并引入置信度评分体系来评估每条TCR-抗原关联的可靠性，从而提高数据的一致性与可信度。同时，VDJdb还提供查询与样本分析功能，可用于检索特定TCR的抗原特异性或对免疫测序数据进行抗原富集分析，是研究T细胞免疫特异性的重要知识库。

![[Pasted image 20260410154006.png]]

数据下载入口：[Releases · antigenomics/vdjdb-db](https://github.com/antigenomics/vdjdb-db/releases)

![[Pasted image 20260410155409.png]]

![[Pasted image 20260410155427.png|381]]

这一堆 `.txt` 其实是**同一份VDJdb数据的不同版本 + 中间产物 + 修复/过滤结果**，不是每个都要用。

---

# 一、核心文件
## 1 vdjdb.txt（核心数据库）

👉 最重要！！！

包含：

- CDR3序列（alpha / beta）
- V gene / J gene
- epitope（抗原）
- MHC类型
- species（人/鼠）
- confidence score

📌 这是做分析的主文件

|字段名|含义|说明|
|---|---|---|
|`complex.id`|克隆/测序复合物ID|同一个TCR克隆的编号（用于区分不同测序记录）|
|`gene`|TCR链类型|TRA / TRB / TRG / TRD（α / β / γ / δ链）|
|`cdr3`|CDR3氨基酸序列|TCR最关键的抗原识别区域|
|`v.segm`|V基因片段|如 TRAV2S1（V gene segment）|
|`j.segm`|J基因片段|如 TRAJ29*01|
|`species`|物种|如 HomoSapiens（人）|
|`mhc.a`|MHC α链|MHC class I/II 的 α链|
|`mhc.b`|MHC β链或辅助蛋白|如 B2M（β2-microglobulin）|
|`mhc.class`|MHC类别|MHCI / MHCII|
|`antigen.epitope`|抗原表位|TCR识别的短肽（核心标签）|
|`antigen.gene`|抗原来源基因|如 EBNA3A|
|`antigen.species`|抗原来源物种|如 EBV（病毒）|
|`reference.id`|文献来源|PubMed ID|
|`vdjdb.score`|数据置信度评分|0–3，越高越可靠|
|`method`|实验验证方法|如 culture / tetramer / etc.|
|`meta`|样本/实验元信息|donor、组织来源等（JSON）|
|`cdr3fix`|修复后的CDR3信息|数据清洗/校正结果|
|`web.method`|网页分类方法|数据来源标记|
|`web.method.seq`|序列方法标记|是否测序验证|
|`web.cdr3fix.nc`|非编码修复标记|是否需要修复CDR3|
|`web.cdr3fix.unmp`|未匹配修复标记|是否无法匹配修复|
|`vdjdb.pgen.score`|生成概率评分|TCR生成概率相关评分|

---

## 2 vdjdb_full.txt

👉 最全数据

特点：

- 包含更多原始注释
- 信息更复杂
- 有些字段不统一

📌 用途：

> 做“深度生物信息分析”才用

|字段名|含义说明|
|---|---|
|cdr3.alpha|TCR α链 CDR3氨基酸序列|
|v.alpha|α链 V基因片段（TRAV）|
|j.alpha|α链 J基因片段（TRAJ）|
|cdr3.beta|TCR β链 CDR3氨基酸序列|
|v.beta|β链 V基因片段（TRBV）|
|d.beta|β链 D基因片段（TRBD，仅β链有）|
|j.beta|β链 J基因片段（TRBJ）|
|species|物种（如 HomoSapiens、MusMusculus）|
|mhc.a|MHC α链等位基因|
|mhc.b|MHC β链等位基因（HLA-B等）|
|mhc.class|MHC类别（I / II）|
|antigen.epitope|被识别的抗原表位（epitope序列）|
|antigen.gene|抗原来源基因名称|
|antigen.species|抗原来源物种|
|reference.id|文献/数据库来源ID|
|method.identification|TCR-抗原配对鉴定方法|
|method.frequency|是否基于频率/富集分析|
|method.singlecell|是否单细胞测序获得|
|method.sequencing|测序技术类型|
|method.verification|是否实验验证（如tetramer等）|
|meta.study.id|研究项目ID|
|meta.cell.subset|细胞亚群（如CD8+等）|
|meta.subject.cohort|受试者队列信息|
|meta.subject.id|受试者ID|
|meta.replica.id|技术/生物学重复编号|
|meta.clone.id|克隆ID|
|meta.epitope.id|表位唯一ID|
|meta.tissue|组织来源（血液、脾脏等）|
|meta.donor.MHC|供体MHC背景|
|meta.donor.MHC.method|MHC类型鉴定方法|
|meta.structure.id|PDB结构ID（如有结构数据）|
|cdr3fix.alpha|标准化修正后的α链CDR3|
|cdr3fix.beta|标准化修正后的β链CDR3|
|vdjdb.score|VDJdb置信评分（越高越可靠）|

---

## 3 vdjdb.slim.txt

👉 简化版：

- 只保留核心字段
- 适合机器学习 / 建模

| 字段名              | 含义说明                            |
| ---------------- | ------------------------------- |
| gene             | TCR链类型（TRA / TRB）               |
| cdr3             | CDR3氨基酸序列（核心特征）                 |
| species          | 物种（如 HomoSapiens）               |
| antigen.epitope  | 抗原表位序列（模型标签核心）                  |
| antigen.gene     | 抗原来源基因                          |
| antigen.species  | 抗原来源物种                          |
| complex.id       | TCR–pMHC复合体唯一ID                 |
| v.segm           | V基因片段（TRAV / TRBV）              |
| j.segm           | J基因片段（TRAJ / TRBJ）              |
| mhc.a            | MHC α链等位基因（如 HLA-A*02:01）       |
| mhc.b            | MHC β链（如 B2M）                   |
| mhc.class        | MHC类别（MHCI / MHCII）             |
| reference.id     | 文献或实验来源ID                       |
| vdjdb.score      | VDJdb置信评分（数据可靠性）                |
| vdjdb.pgen.score | 预测/生成相关评分（部分版本用于生成模型或概率评分）      |
| j.start          | CDR3在J基因中的起始位置（对齐信息）            |
| v.end            | CDR3在V基因中的结束位置（对齐信息，-1表示未知或未标注） |

---

# 二、meta 文件（不是数据！）

🧾 `vdjdb.meta.txt`

🧾 `vdjdb.slim.meta.txt`

👉 这两个是：

> 📌 字段说明书（schema）

内容类似：

- 每一列是什么意思
- 来源
- 解释规则

❗不是数据本身

![[Pasted image 20260410160756.png]]

![[Pasted image 20260410160816.png|532]]

---

# 三、motif / 聚类相关（高级分析）

🧬 `motif_pwms.txt`

👉 TCR motif（位置权重矩阵）

说明：

> 哪些氨基酸模式在识别同一抗原时更常见

![[Pasted image 20260410161058.png]]

==基础信息 + motif上下文：==

| 字段名             | 含义说明                     |
| --------------- | ------------------------ |
| species         | 物种（如 HomoSapiens）        |
| antigen.epitope | 抗原表位序列                   |
| gene            | TCR链类型（TRA / TRB）        |
| aa              | 当前位置的氨基酸残基（motif中心或扫描位点） |
| pos             | 在CDR3中的位置编号              |
| len             | CDR3序列长度                 |

==TCR基因与克隆信息：==

|字段名|含义说明|
|---|---|
|v.segm.repr|V基因代表型（TRAV21*01）|
|j.segm.repr|J基因代表型（TRAJ9*01）|
|cid|克隆/cluster ID（TCR motif cluster）|
|csz|cluster size（该motif包含的TCR数量）|

==motif统计计数信息：==

|字段名|含义说明|
|---|---|
|count|motif中该pattern出现次数|
|count.bg|背景数据中出现次数|
|total.bg|背景总样本数|
|count.bg.i|插补/修正后的背景计数|
|total.bg.i|插补后背景总数|
|need.impute|是否需要统计插补（TRUE/FALSE）|

==motif频率与富集强度：==

|字段名|含义说明|
|---|---|
|freq|当前motif频率|
|freq.bg|背景频率|
|I|motif富集强度（information / enrichment score）|
|I.norm|归一化富集强度|
|height.I|motif信号高度（peak strength）|
|height.I.norm|归一化信号高度|

==抗原 + MHC约束信息：==

| 字段名             | 含义说明                  |
| --------------- | --------------------- |
| antigen.gene    | 抗原来源基因（如 NS3）         |
| antigen.species | 抗原来源物种（如 HCV）         |
| mhc.a           | MHC α链（如 HLA-A*01:01） |
| mhc.b           | MHC β链（如 B2M）         |
| mhc.class       | MHC类别（MHCI / MHCII）   |

 它不是普通TCR数据，而是：

> 🧬 **TCR CDR3 motif 的 Position Weight Matrix（PWM）统计结果**

---

🧬 `cluster_members.txt`

👉 TCR聚类结果

说明：

> 哪些TCR被归为一类（识别相似抗原）

![[Pasted image 20260410161352.png]]

==基础免疫信息：==

|字段名|含义说明|
|---|---|
|species|物种（如 HomoSapiens）|
|antigen.epitope|抗原表位序列|
|antigen.gene|抗原来源基因（如 NS3）|
|antigen.species|抗原来源物种（如 HCV）|
|mhc.a|MHC α链（如 HLA-A*01:01）|
|mhc.b|MHC β链（如 B2M）|
|mhc.class|MHC类别（MHCI / MHCII）|

==TCR序列信息：==

|字段名|含义说明|
|---|---|
|gene|TCR链类型（TRA / TRB）|
|cdr3aa|TCR CDR3氨基酸序列（核心识别结构）|

==TCR基因片段信息：==

|字段名|含义说明|
|---|---|
|v.segm|V基因片段|
|j.segm|J基因片段|
|v.segm.repr|标准化V基因表示（更规范版本）|
|j.segm.repr|标准化J基因表示|
|v.end|V基因对齐终止位置|
|j.start|J基因对齐起始位置|

==聚类信息（核心）：==

|字段名|含义说明|
|---|---|
|cid|cluster ID（TCR聚类编号，同一抗原对应的TCR簇）|
|csz|cluster size（该cluster包含的TCR数量）|

==降维/可视化信息：==

|字段名|含义说明|
|---|---|
|x|降维坐标X（通常是UMAP / t-SNE）|
|y|降维坐标Y（用于可视化分布）|

![[Pasted image 20260410161519.png|324]]


---
# 四、broken / filtered

vdjdb_full_allele_broken.txt
vdjdb_full_cdr3aa_broken.txt
vdjdb_full_gene_broken.txt
vdjdb_full_filtered.txt

👉 本质是：

❌ 数据修复/异常处理版本

 举例：

- `_broken`  
    → 数据不规范 / 缺字段 / 修复前后对照
- `_filtered`  
    → 去掉低质量或不符合规则的数据

