// Site copy and structured content. Anything marked [TO CONFIRM] needs
// DataHustle's review before launch.

export const SITE = {
  name: 'DataHustle',
  url: 'https://datahustle.ai',
  email: 'hello@datahustle.ai',
  location: 'Athens, Greece',
  description:
    'DataHustle is an intelligence and innovation partner for decision-makers. We build the measurement, data and AI systems that show where a business should intervene.',
};

export const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/pulse', label: 'Pulse' },
  { href: '/contact', label: 'Contact' },
];

export const SERVICES = [
  {
    id: 'measurement',
    title: 'Data & measurement architecture',
    question: 'Can you trust the numbers you decide on?',
    summary:
      'We design how your business collects, joins and reports data, so that marketing, sales and finance work from one version of the truth.',
    deliverables: [
      'Tracking and consent architecture across web, app and CRM',
      'Attribution and incrementality measurement',
      'Data models and reporting built for leadership decisions',
    ],
    detail: [
      'Most measurement problems start upstream: events defined differently by each team, consent gaps, and reports that disagree. We audit the full chain from collection to dashboard, then rebuild it as a documented system.',
      'The result is a measurement layer your analysts can maintain and your board can rely on.',
    ],
  },
  {
    id: 'ai-data',
    title: 'AI & data solutions',
    question: 'Where can a model make a better decision than a rule?',
    summary:
      'We build forecasting, scoring and automation where the data supports it, and say so plainly where it does not.',
    deliverables: [
      'Forecasting for demand, revenue and budget',
      'Customer scoring and segmentation',
      'Automation of repeated analysis and reporting',
    ],
    detail: [
      'We start from the decision, not the technique. If a model will not change what someone does on Monday morning, we do not build it.',
      'Where it will, we build it to run inside your existing tools, with clear ownership and a measured baseline to judge it against.',
    ],
  },
  {
    id: 'performance-media',
    title: 'Performance media',
    question: 'Is every euro of spend earning its place?',
    summary:
      'We plan, buy and optimise paid media against measured return, not platform-reported metrics.',
    deliverables: [
      'Search, social and programmatic planning and buying',
      'Budget allocation driven by measured return',
      'Testing programmes with clear decision rules',
    ],
    detail: [
      'Platforms grade their own homework. We connect media to the measurement layer so that budget moves on evidence: what each channel adds, not what it claims.',
      'Every test has a hypothesis, a size and a decision rule agreed before it starts.',
    ],
  },
  {
    id: 'strategy',
    title: 'Strategy consulting',
    question: 'Which few moves matter most this year?',
    summary:
      'We help leadership teams size opportunities, set priorities and build the roadmap to act on them.',
    deliverables: [
      'Growth diagnostics and opportunity sizing',
      'Data and AI roadmaps',
      'KPI design and board-level reporting',
    ],
    detail: [
      'A good strategy is a short list. We map how the business makes money, quantify where it leaks, and rank the interventions by expected return and effort.',
      'The output is a plan leadership can defend, with owners, milestones and the metrics that will show whether it is working.',
    ],
  },
];

export const STEPS = [
  { title: 'Measure', text: 'Establish a baseline you can trust. Audit the data, fix what is broken, agree the metrics that matter.' },
  { title: 'Model', text: 'Describe how the business actually responds: to spend, price, channel and season.' },
  { title: 'Intervene', text: 'Act where the expected return is highest. One change at a time, measured.' },
  { title: 'Review', text: 'Compare the outcome with the expectation, update the model, take the next step.' },
];

// Order matters: the strongest reference for the audience comes first.
export const CLIENTS = [
  { name: 'Adecco', file: 'adecco' },
  { name: 'Koilakos Carpark', file: 'koilakos-carpark' },
  { name: 'Dreamstar Event Agency', file: 'dreamstar' },
  { name: 'All About Events', file: 'all-about-events' },
  { name: 'Easy Service Maragopoulos', file: 'easy-service-maragopoulos' },
  { name: 'OceanSouth', file: 'oceansouth' },
  { name: 'The Christmas Factory', file: 'the-christmas-factory' },
];

// Placeholders until real, anonymized case studies are supplied.
export const FINDINGS = [1, 2, 3].map((n) => ({
  sector: '[Sector TO CONFIRM]',
  challenge: '[TO CONFIRM] One sentence on the problem the client faced.',
  intervention: '[TO CONFIRM] One sentence on what DataHustle changed.',
  outcome: '[TO CONFIRM] The measured result, as the client would state it.',
}));

export const FOUNDERS = [
  {
    name: 'Thomas Gakis',
    title: '[Title TO CONFIRM]',
    credentials: 'BSc Mathematics. MSc Advanced Information Systems, with a thesis on neural networks for time-series forecasting.',
    focus: '[TO CONFIRM] One line on focus.',
  },
  {
    name: 'Ioannis Souliotis',
    title: '[Title TO CONFIRM]',
    credentials: '[TO CONFIRM] Background.',
    focus: '[TO CONFIRM] One line on focus.',
  },
];
