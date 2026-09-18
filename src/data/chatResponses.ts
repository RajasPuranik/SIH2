import type { ChatMessage, SearchResult } from '../types';
import { standards } from './standards';

// ── Canned chat responses ──────────────────────────────────────────

interface CannedResponse {
  keywords: string[];
  content: string;
  citations: ChatMessage['citations'];
  toolCalls: ChatMessage['toolCalls'];
  suggestedQuestions: string[];
  inlineStandardIds?: string[];
}

export const cannedResponses: CannedResponse[] = [
  {
    keywords: ['cement', 'concrete', 'bridge', 'ppc', 'opc', 'pozzolana'],
    content: `For bridge construction works, **Portland Pozzolana Cement (PPC)** conforming to **IS 1489 (Part 1): 2015** is widely specified. PPC offers superior resistance to sulphate attack and alkali-silica reaction, making it ideal for structures exposed to aggressive environments [1].

However, if early-age strength is critical (e.g. precast segments or cold-weather concreting), **OPC 43 Grade** per **IS 8112: 2013** may be more appropriate [2].

Key points to note in your tender specification:
- Both IS 1489 and IS 8112 are under **Quality Control Order (QCO)**, meaning only BIS-licensed manufacturers may supply [3]
- The **ISI Mark** is mandatory on all cement bags
- Concrete mix design should conform to **IS 456: 2000**, which references both cement standards normatively [4]
- Aggregate quality must meet **IS 383: 2016** requirements

> **Important:** IS 456 Amendment 2 (2013) revised minimum cement content for different exposure conditions. Ensure your tender references the latest amended version.`,
    citations: [
      { index: 1, documentName: 'IS 1489 (Part 1): 2015', clauseNumber: 'Clause 1 — Scope', snippet: 'This standard covers Portland pozzolana cement manufactured by blending Portland cement clinker, gypsum, and fly ash conforming to Grade 1 of IS 3812 (Part 1).', standardId: 'is-1489' },
      { index: 2, documentName: 'IS 8112: 2013', clauseNumber: 'Clause 3 — Requirements', snippet: 'The 3-day compressive strength shall not be less than 23 MPa and 7-day strength not less than 33 MPa for 43 Grade OPC.', standardId: 'is-8112' },
      { index: 3, documentName: 'QCO Notification S.O. 5765(E)', clauseNumber: 'Schedule II', snippet: 'Portland Pozzolana Cement conforming to IS 1489 Part 1 and OPC conforming to IS 8112 are included under Quality Control Orders.' },
      { index: 4, documentName: 'IS 456: 2000', clauseNumber: 'Clause 5.1 — Cement', snippet: 'The cement used shall conform to the requirements of IS 269, IS 1489 (Parts 1 and 2), IS 3466, IS 6452, IS 8041, IS 8043, or IS 8112.', standardId: 'is-456' },
    ],
    toolCalls: [
      { name: 'search_standards', description: 'Searched BIS catalog for cement standards applicable to bridge works', durationMs: 1200, documentsSearched: 4 },
      { name: 'check_qco', description: 'Verified Quality Control Order applicability', durationMs: 340, documentsSearched: 1 },
    ],
    suggestedQuestions: [
      'What are the minimum cement content requirements for different exposure conditions in IS 456?',
      'Can I use OPC 53 Grade instead of 43 Grade for bridge piers?',
      'What are the testing requirements for cement at the project site?',
      'Which IS standard covers the design of RCC bridge superstructures?',
    ],
    inlineStandardIds: ['is-1489', 'is-8112', 'is-456'],
  },
  {
    keywords: ['led', 'street', 'lighting', 'luminaire', 'lamp', 'road'],
    content: `For **LED street lighting luminaires**, the primary applicable standard is **IS 10322 (Part 5/Sec 3): 2012** which covers specific requirements for street and road lighting luminaires [1].

Additionally, the LED lamp/module itself must conform to **IS 16104: 2018** for performance requirements including luminous efficacy, colour rendering, and lumen maintenance [2].

**Mandatory compliance requirements:**
- **ISI Mark** is mandatory for luminaires under IS 10322 [1]
- **BIS CRS registration** is required for LED products sold in India
- Post Amendment 2 (2021), minimum efficacy is **120 lm/W** for LED street lights
- IP66 rating is typically specified for outdoor luminaires (as per your spec)

**Wiring and cabling** within the luminaire assembly must use cables conforming to **IS 694: 2010** for voltages up to 1100V [3].

> **Tip:** Ensure your tender specifies the colour temperature (typically 4000K–5700K for street lighting) and the photometric distribution class (Type II or Type III per CIE classification) in addition to the wattage and IP rating.`,
    citations: [
      { index: 1, documentName: 'IS 10322 (Part 5/Sec 3): 2012', clauseNumber: 'Clause 4.2 — IP Rating', snippet: 'Street lighting luminaires shall have a minimum ingress protection rating of IP65. For coastal and industrial areas, IP66 is recommended.', standardId: 'is-10322-5-3' },
      { index: 2, documentName: 'IS 16104: 2018', clauseNumber: 'Clause 4.1 — Luminous Flux', snippet: 'The initial luminous flux of the LED lamp shall not be less than 90% of the rated luminous flux. Lumen maintenance at 6000 hours shall be ≥ 80%.', standardId: 'is-16104' },
      { index: 3, documentName: 'IS 694: 2010', clauseNumber: 'Clause 3 — Construction', snippet: 'Cables shall be manufactured from electrolytic grade copper or aluminium conductors with PVC insulation rated for continuous operation up to 70°C.', standardId: 'is-694' },
    ],
    toolCalls: [
      { name: 'search_standards', description: 'Searched for LED and luminaire standards', durationMs: 890, documentsSearched: 3 },
      { name: 'check_certification', description: 'Verified ISI Mark and CRS requirements for LED products', durationMs: 450, documentsSearched: 2 },
    ],
    suggestedQuestions: [
      'What are the photometric testing requirements for street lighting as per IS 10322?',
      'Is BIS CRS registration required for imported LED drivers used in street lights?',
      'What colour temperature is recommended for different road classifications?',
      'How do I specify surge protection requirements for outdoor LED luminaires?',
    ],
    inlineStandardIds: ['is-10322-5-3', 'is-16104', 'is-694'],
  },
  {
    keywords: ['pcb', 'circuit', 'board', 'electronics', 'defence', 'defense', 'multilayer'],
    content: `For **multilayer PCB assemblies** in defence electronics, the applicable standard is **IS 15890 (Part 1): 2010** [1].

**Key specification points for defence-grade PCBs:**
- Base material class should be specified (FR-4 for commercial, polyimide for high-reliability defence applications)
- Amendment 1 (2016) added **HDI (High Density Interconnect)** requirements for fine-pitch BGAs [1]
- Impedance-controlled designs require layer stackup documentation per Clause 4.2

**Environmental testing** should reference standard test methods. Note that IS 9000 has been **withdrawn** — you should reference specific IEC 60068 test procedures instead [2].

**Cabling and interconnection** standards within the assembly should reference **IS 694: 2010** for wire ratings [3].

> **Defence procurement note:** JSG (Joint Services Guide) and JSS (Joint Services Specifications) may impose additional requirements beyond BIS standards. Coordinate with DGQA for applicable JSS overlay specifications.`,
    citations: [
      { index: 1, documentName: 'IS 15890 (Part 1): 2010', clauseNumber: 'Clause 4.1 — Layer Stackup', snippet: 'Multilayer PCBs shall have a documented layer stackup showing signal, ground, and power plane assignments. Symmetrical stackup is preferred to minimize warpage.', standardId: 'is-15890' },
      { index: 2, documentName: 'IS 9000: 2001 (Withdrawn)', clauseNumber: 'Notice', snippet: 'This standard has been withdrawn. Users are directed to refer to relevant parts of IEC 60068 series for environmental testing of electronic equipment.', standardId: 'is-9000' },
      { index: 3, documentName: 'IS 694: 2010', clauseNumber: 'Clause 5 — Insulation', snippet: 'PVC insulation shall withstand the specified test voltage without breakdown as per the voltage rating of the cable.', standardId: 'is-694' },
    ],
    toolCalls: [
      { name: 'search_standards', description: 'Searched for PCB and electronic assembly standards', durationMs: 1100, documentsSearched: 5 },
      { name: 'check_status', description: 'Verified IS 9000 withdrawn status', durationMs: 280, documentsSearched: 1 },
    ],
    suggestedQuestions: [
      'What are the IPC equivalents for IS 15890 PCB classifications?',
      'Which environmental screening tests are required for defence-grade PCBs?',
      'How should I specify conformal coating requirements for PCB assemblies?',
      'What is the latest status of IS 15890 Part 2 for rigid-flex PCBs?',
    ],
    inlineStandardIds: ['is-15890', 'is-9000'],
  },
  {
    keywords: ['water', 'drinking', 'packaged', 'purification', 'mineral'],
    content: `For **drinking water** procurement, two primary standards apply:

1. **IS 10500: 2012** — Drinking Water Specification [1]. This is the baseline quality standard referenced in most government tenders for municipal water supply and treatment plants.

2. **IS 14543: 2016** — Packaged Drinking Water [2]. This applies specifically to packaged/bottled water other than natural mineral water.

**Mandatory compliance:**
- IS 14543 is under **QCO** — only BIS-licensed packaged water plants may supply
- **ISI Mark** is mandatory on every sealed package
- **FSSAI license** is additionally required for all packaged food/water products
- IS 14543 references IS 10500 normatively for chemical parameters [2]

**Key parameters to specify in tender:**
- TDS (Total Dissolved Solids): 500 mg/L desirable, 2000 mg/L permissible
- pH range: 6.5 to 8.5
- Bacteriological: 0 coliform per 100 mL
- Residual chlorine: 0.2 mg/L minimum at consumer end

> **Amendment alert:** IS 10500 Amendment 2 (2021) introduced limits for **microplastics** — ensure your specifications reference the latest amended version.`,
    citations: [
      { index: 1, documentName: 'IS 10500: 2012', clauseNumber: 'Clause 3.3 — Chemical Requirements', snippet: 'The chemical requirements specify acceptable and cause-for-rejection limits for 31 parameters including fluoride (1.0/1.5 mg/L), iron (0.3 mg/L), and total hardness (200/600 mg/L).', standardId: 'is-10500' },
      { index: 2, documentName: 'IS 14543: 2016', clauseNumber: 'Clause 3.3 — Quality Parameters', snippet: 'Packaged drinking water shall conform to the chemical and bacteriological requirements of IS 10500, with additional requirements for ozone treatment residuals and packaging material migration limits.', standardId: 'is-14543' },
    ],
    toolCalls: [
      { name: 'search_standards', description: 'Searched for water quality and packaged drinking water standards', durationMs: 670, documentsSearched: 2 },
      { name: 'check_qco', description: 'Verified QCO and FSSAI requirements', durationMs: 310, documentsSearched: 1 },
    ],
    suggestedQuestions: [
      'What are the differences between IS 10500 and IS 14543 in terms of quality parameters?',
      'How do I specify water quality monitoring frequency in a municipal supply tender?',
      'What testing lab accreditation is required for drinking water testing under QCO?',
      'What are the packaging material requirements under IS 14543 for PET bottles?',
    ],
    inlineStandardIds: ['is-10500', 'is-14543'],
  },
  {
    keywords: ['textile', 'fabric', 'cotton', 'uniform', 'polyester', 'cloth'],
    content: `For **government textile procurement**, the applicable standards depend on the fabric type:

**Cotton fabrics:** **IS 1521 (Part 1): 1991** covers grey cotton fabrics for government purposes [1]. Sampling methods must follow **IS 1969: 2017** [2].

**Polyester-cotton blends:** **IS 3468: 2003** covers poly-cotton blended fabrics commonly used for uniforms [3]. Amendment 2 (2019) updated pilling resistance requirements.

**Key quality parameters to specify:**
- Thread count (ends and picks per cm)
- Weight per unit area (GSM)
- Breaking strength (warp and weft)
- Colour fastness to washing, light, and rubbing
- Dimensional stability after washing

**Formaldehyde content** testing per **IS 15370: 2005** should be specified for fabrics in contact with skin, particularly for uniform fabrics [4].

> **Note:** IS 11871 for knitted fabric testing has been **superseded**. If your tender involves knitted fabrics, check for the replacement standard.`,
    citations: [
      { index: 1, documentName: 'IS 1521 (Part 1): 1991', clauseNumber: 'Clause 3 — Requirements', snippet: 'Grey cotton fabrics shall have a minimum breaking strength of 350N in warp direction and 200N in weft direction for Type A fabrics.', standardId: 'is-1521' },
      { index: 2, documentName: 'IS 1969: 2017', clauseNumber: 'Clause 3 — Sampling', snippet: 'For lot sizes up to 500 bales, the number of bales to be selected for sampling shall be the square root of the lot size, rounded up.', standardId: 'is-1969' },
      { index: 3, documentName: 'IS 3468: 2003', clauseNumber: 'Clause 4.2 — Colour Fastness', snippet: 'Colour fastness to washing shall be Grade 4 minimum, and colour fastness to light shall be Grade 4 minimum on the grey scale.', standardId: 'is-3468' },
      { index: 4, documentName: 'IS 15370: 2005', clauseNumber: 'Clause 4 — Procedure', snippet: 'Free formaldehyde content shall not exceed 75 mg/kg for fabrics with direct skin contact and 300 mg/kg for other textiles.', standardId: 'is-15370' },
    ],
    toolCalls: [
      { name: 'search_standards', description: 'Searched for textile and fabric standards', durationMs: 780, documentsSearched: 5 },
    ],
    suggestedQuestions: [
      'What are the BIS standards for dyeing and printing of cotton fabrics?',
      'Is ISI Mark mandatory for uniform fabrics supplied to government?',
      'What testing equipment is needed for colour fastness testing per IS 3468?',
      'How should I specify wash durability for poly-cotton blend uniforms?',
    ],
    inlineStandardIds: ['is-1521', 'is-3468', 'is-15370'],
  },
];

// ── Helper to find matching response ────────────────────────────────

export function findCannedResponse(query: string): CannedResponse | null {
  const lower = query.toLowerCase();
  let bestMatch: CannedResponse | null = null;
  let bestScore = 0;

  for (const response of cannedResponses) {
    const score = response.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  }

  return bestMatch;
}

// ── Build inline search results from a canned response ──────────────

export function buildInlineResults(standardIds: string[]): SearchResult[] {
  return standardIds
    .map(id => {
      const std = standards.find(s => s.id === id);
      if (!std) return null;
      return {
        standard: std,
        matchScore: 0.75 + Math.random() * 0.2,
        matchReason: `Referenced in assistant response as relevant standard`,
        highlightedPhrases: [std.title.split('—')[0].trim()],
      } satisfies SearchResult;
    })
    .filter((r): r is SearchResult => r !== null);
}

// Default fallback response
export const fallbackResponse: Omit<CannedResponse, 'keywords'> = {
  content: `I can help you find the right Indian Standards for your procurement needs. Based on your query, I'd recommend searching our standards database for specific matches.

You can:
1. **Paste a tender specification** in the search box to get ranked standard recommendations
2. **Ask specific questions** about BIS standards, QCO requirements, or certification needs
3. **Browse by sector** using the filters on the results page

Try asking about specific product categories like cement, LED lighting, drinking water, textiles, or electronic components for detailed guidance.`,
  citations: [],
  toolCalls: [
    { name: 'search_standards', description: 'Searched BIS catalog', durationMs: 450, documentsSearched: 26 },
  ],
  suggestedQuestions: [
    'Which standards apply to LED street lighting luminaires?',
    'What cement standard should I specify for bridge construction?',
    'Is ISI Mark mandatory for packaged drinking water?',
    'What are the quality requirements for polyester-cotton uniform fabrics?',
  ],
};
