// Public bibliographic records verified against the linked arXiv pages.
// Preview summaries, connections, and questions are authored examples, not quotes.
export const papers = {
  attention: { author: "Vaswani et al.", year: "2017", url: "https://arxiv.org/abs/1706.03762", originalTitle: "Attention Is All You Need" },
  rag: { author: "Lewis et al.", year: "2020", url: "https://arxiv.org/abs/2005.11401", originalTitle: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" },
  graphcast: { author: "Lam et al.", year: "2023", url: "https://arxiv.org/abs/2212.12794", originalTitle: "GraphCast: Learning skillful medium-range global weather forecasting" },
  pangu: { author: "Bi et al.", year: "2022", url: "https://arxiv.org/abs/2211.02556", originalTitle: "Pangu-Weather: A 3D High-Resolution Model for Fast and Accurate Global Weather Forecast" },
  learning: { author: "Lake et al.", year: "2016", url: "https://arxiv.org/abs/1604.00289", originalTitle: "Building Machines That Learn and Think Like People" },
  mind: { author: "Rabinowitz et al.", year: "2018", url: "https://arxiv.org/abs/1802.07740", originalTitle: "Machine Theory of Mind" },
  qwen3: { author: "Yang et al.", year: "2025", url: "https://arxiv.org/abs/2505.09388", originalTitle: "Qwen3 Technical Report" },
  deepseekr1: { author: "DeepSeek-AI et al.", year: "2025", url: "https://arxiv.org/abs/2501.12948", originalTitle: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning" },
  s1: { author: "Muennighoff et al.", year: "2025", url: "https://arxiv.org/abs/2501.19393", originalTitle: "s1: Simple test-time scaling" },
  deepseekv3: { author: "DeepSeek-AI et al.", year: "2024", url: "https://arxiv.org/abs/2412.19437", originalTitle: "DeepSeek-V3 Technical Report" },
  olmo2: { author: "Team OLMo et al.", year: "2024", url: "https://arxiv.org/abs/2501.00656", originalTitle: "2 OLMo 2 Furious" },
  llama3: { author: "Grattafiori et al.", year: "2024", url: "https://arxiv.org/abs/2407.21783", originalTitle: "The Llama 3 Herd of Models" },
  regionalweather: { author: "Adamov et al.", year: "2025", url: "https://arxiv.org/abs/2504.09340", originalTitle: "Building Machine Learning Limited Area Models: Kilometer-Scale Weather Forecasting in Realistic Settings" },
  seasonalweather: { author: "Kent et al.", year: "2025", url: "https://arxiv.org/abs/2503.23953", originalTitle: "Skilful global seasonal predictions from a machine learning weather model trained on reanalysis data" },
  efficientweather: { author: "Valencia et al.", year: "2025", url: "https://arxiv.org/abs/2509.11047", originalTitle: "Data-Efficient Ensemble Weather Forecasting with Diffusion Models" },
  aurora: { author: "Bodnar et al.", year: "2024", url: "https://arxiv.org/abs/2405.13063", originalTitle: "A Foundation Model for the Earth System" },
  ace2: { author: "Watt-Meyer et al.", year: "2024", url: "https://arxiv.org/abs/2411.11268", originalTitle: "ACE2: Accurately learning subseasonal to decadal atmospheric variability and forced responses" },
  continuousweather: { author: "Andrae et al.", year: "2024", url: "https://arxiv.org/abs/2410.05431", originalTitle: "Continuous Ensemble Weather Forecasting with Diffusion models" },
  behaviorprediction: { author: "Liu et al.", year: "2025", url: "https://arxiv.org/abs/2504.00839", originalTitle: "Context-Aware Human Behavior Prediction Using Multimodal Large Language Models: Challenges and Insights" },
  cognitionai: { author: "Singh et al.", year: "2025", url: "https://arxiv.org/abs/2502.12447", originalTitle: "Protecting Human Cognition in the Age of AI" },
  multihuman: { author: "Panchal et al.", year: "2025", url: "https://arxiv.org/abs/2512.15957", originalTitle: "Seeing is Believing (and Predicting): Context-Aware Multi-Human Behavior Prediction with Vision Language Models" },
  socialsimulation: { author: "Bian et al.", year: "2025", url: "https://arxiv.org/abs/2510.21180", originalTitle: "Social Simulations with Large Language Model Risk Utopian Illusion" },
  centaur: { author: "Binz et al.", year: "2024", url: "https://arxiv.org/abs/2410.20268", originalTitle: "Centaur: a foundation model of human cognition" },
  generativepeople: { author: "Park et al.", year: "2024", url: "https://arxiv.org/abs/2411.10109v1", originalTitle: "Generative Agent Simulations of 1,000 People" },
} as const;
export type PaperId = keyof typeof papers;
export const interests = ["ai", "climate", "mind"] as const;
export type Interest = (typeof interests)[number];
export const topicPapers: Record<Interest, readonly PaperId[]> = {
  ai: ["attention", "rag"],
  climate: ["graphcast", "pangu"],
  mind: ["learning", "mind"],
};
// Recent discovery cards are separate from the foundational wiki/graph sources.
export const feedPapers: Record<Interest, readonly PaperId[]> = {
  ai: ["qwen3", "deepseekr1", "s1", "deepseekv3", "olmo2", "llama3"],
  climate: ["regionalweather", "seasonalweather", "efficientweather", "aurora", "ace2", "continuousweather"],
  mind: ["behaviorprediction", "cognitionai", "multihuman", "socialsimulation", "centaur", "generativepeople"],
};
export function paperInterest(id: PaperId): Interest {
  return interests.find(interest => topicPapers[interest].includes(id) || feedPapers[interest].includes(id))!;
}
export const stages = ["feed", "chat", "trending", "wiki", "graph", "projects", "idea", "history"] as const;
export type Stage = (typeof stages)[number] | "reader";

export type DemoState = { interest: Interest; stage: Stage; paper: PaperId; concept: number; saved: PaperId[] };
export const initialDemo: DemoState = { interest: "ai", stage: "feed", paper: feedPapers.ai[0], concept: 0, saved: [] };
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
    case "interest": return { ...state, interest: action.interest, paper: feedPapers[action.interest][0], stage: "feed", concept: 0 };
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
      (!topicPapers[value.interest].includes(value.paper) && !feedPapers[value.interest].includes(value.paper)) || ![0, 1, 2, 3].includes(value.concept) ||
      !Array.isArray(value.saved) || !value.saved.every(id => Object.hasOwn(papers, id))) return;
    return { ...value, saved: [...new Set(value.saved)] };
  } catch { return; }
}
