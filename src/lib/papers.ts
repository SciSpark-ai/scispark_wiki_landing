// Public bibliographic records verified against the linked arXiv pages.
// Preview summaries, connections, and questions are authored examples, not quotes.
export const papers = {
  attention: { author: "Vaswani et al.", year: "2017", url: "https://arxiv.org/abs/1706.03762", originalTitle: "Attention Is All You Need" },
  rag: { author: "Lewis et al.", year: "2020", url: "https://arxiv.org/abs/2005.11401", originalTitle: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" },
  graphcast: { author: "Lam et al.", year: "2023", url: "https://arxiv.org/abs/2212.12794", originalTitle: "GraphCast: Learning skillful medium-range global weather forecasting" },
  pangu: { author: "Bi et al.", year: "2022", url: "https://arxiv.org/abs/2211.02556", originalTitle: "Pangu-Weather: A 3D High-Resolution Model for Fast and Accurate Global Weather Forecast" },
  learning: { author: "Lake et al.", year: "2016", url: "https://arxiv.org/abs/1604.00289", originalTitle: "Building Machines That Learn and Think Like People" },
  mind: { author: "Rabinowitz et al.", year: "2018", url: "https://arxiv.org/abs/1802.07740", originalTitle: "Machine Theory of Mind" },
} as const;
export type PaperId = keyof typeof papers;
export const interests = ["ai", "climate", "mind"] as const;
export type Interest = (typeof interests)[number];
export const topicPapers: Record<Interest, readonly PaperId[]> = {
  ai: ["attention", "rag"],
  climate: ["graphcast", "pangu"],
  mind: ["learning", "mind"],
};
export const stages = ["feed", "chat", "trending", "wiki", "graph", "projects", "idea", "history"] as const;
export type Stage = (typeof stages)[number] | "reader";

export type DemoState = { interest: Interest; stage: Stage; paper: PaperId; concept: number; saved: PaperId[] };
export const initialDemo: DemoState = { interest: "ai", stage: "feed", paper: "attention", concept: 0, saved: [] };
export type DemoAction =
  | { type: "interest"; interest: Interest }
  | { type: "stage"; stage: Stage }
  | { type: "paper"; paper: PaperId }
  | { type: "concept"; concept: number }
  | { type: "save"; paper?: PaperId; stay?: boolean }
  | { type: "remove"; paper: PaperId }
  | { type: "reset" };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "interest": return { ...state, interest: action.interest, paper: topicPapers[action.interest][0], stage: "feed", concept: 0 };
    case "stage": return { ...state, stage: action.stage };
    case "paper": return { ...state, paper: action.paper, stage: "reader" };
    case "concept": return { ...state, concept: action.concept };
    case "save": { const id = action.paper ?? state.paper; return { ...state, saved: state.saved.includes(id) ? state.saved : [...state.saved, id], stage: action.stay ? state.stage : "wiki" }; }
    case "remove": return { ...state, saved: state.saved.filter(id => id !== action.paper) };
    case "reset": return initialDemo;
  }
}

export function parseDemoState(raw: string | null): DemoState | undefined {
  if (!raw) return;
  try {
    const value = JSON.parse(raw) as DemoState;
    if (!interests.includes(value.interest) || ![...stages, "reader"].includes(value.stage) ||
      !topicPapers[value.interest].includes(value.paper) || ![0, 1, 2, 3].includes(value.concept) ||
      !Array.isArray(value.saved) || !value.saved.every(id => Object.hasOwn(papers, id))) return;
    return { ...value, saved: [...new Set(value.saved)] };
  } catch { return; }
}
