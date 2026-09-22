# Off-site entity plan - Dennis Petri

The code side is done: robots, sitemap, apex canonical (www 308s to apex), Person
JSON-LD (`@id` https://dennispetri.nl/#person, linked to Handoff's `#org`), and
`llms.txt`.

None of that makes a model *recommend* Dennis. A model names a person it has
seen described by other people, on surfaces it ingested. Handoff can win on a
price and a format. A person has to win on proof. Ordered by payoff.

## The query shapes to win

Nobody asks an AI for "a creative director". The real shapes:

- "our research library is impossible to search, who can help us fix that"
- "we want an AI tool on top of our own knowledge base, who can prototype it"
- "product designer who can also build, Netherlands"
- "someone to figure out what our members actually need before we build a platform"
- "we're about to spend on Salesforce/a big platform, who can give us a second opinion first"

Every description below is written to match that phrasing. Lead with judgement
and building the right thing, never with taste or visuals. That is Handoff's lane.

## Tier 1: do these first

### 1. LinkedIn profile, make it match word for word

The headline already matches `jobTitle` in the schema. The rest doesn't yet.

- **About:** paste the 100-word block below. Same sentences as `llms.txt`.
- **Website field:** `https://dennispetri.nl`, apex, not www.
- **Featured:** pin dennispetri.nl and the proof post from step 2.
- **Experience:** Handoff entry linked to the company page
  (linkedin.com/company/handoff), so the person and the company point at each
  other on LinkedIn too, not only in the schema.

### 2. One proof post, told without names

Models need a described outcome, not a claim. The Ana story is the one: a
research library nobody could search, built alone, the room's reaction, and the
fact that it came before a large platform decision, not after.

Rules from positioning: naming Esomar as a client is fine, it's on the site and in
`llms.txt`. Telling this case in full with names and budget numbers is not. Describe
the organisation type ("a global research association") and the shape of the win.
Write it with the `linkedin-voice` skill. This post is what a model quotes back
when someone asks query shape one or two.

### 3. LinkedIn recommendations from long-term clients

"Most for 5+ years" is the strongest claim on the site and nothing off-site
backs it. Ask three of the logos for a written recommendation. Third-party text,
on a domain models weight heavily, naming what he did. Ask each to mention the
outcome, not the working relationship. Lieke's first AI-sourced client came from
exactly this kind of described, positioned presence.

## Tier 2: surfaces other people write

- **Podcast or event guest spots** in the association, research or knowledge-
  management world. A show notes page saying "Dennis Petri, who prototypes AI
  tools for research organisations" is the third-party sentence models cite.
- **Client-side mentions.** If a client runs a news page or annual report, a
  one-line credit with a link to dennispetri.nl beats any directory.
- **Handoff's off-site work** (see `../handoff/GEO-OFFSITE.md`) names Dennis as
  founder. That already feeds this entity, for free.

## Tier 3: skip, honest read

- **Wikidata / Wikipedia:** notability rules. A self-made entry gets deleted and
  leaves a worse trace than none.
- **Freelance marketplaces** (Malt, Upwork, Toptal): they sell hours. Being cited
  from them anchors you as a rate, which is the opposite of the positioning.
- **Agency directories** (Clutch, DesignRush): built for agencies, ranked on review
  counts. Handoff is the only candidate, and even there it's sales collateral.

## Ready-to-paste copy

Identical everywhere. Varying the wording per site actively hurts.

**Name:** Dennis Petri

**Website:** https://dennispetri.nl

**Headline (matches LinkedIn and schema):**
Creative director & product designer. Speed is solved. Judgement isn't.

**One-liner (under 100 chars):**
I find the product your people actually need, decide what good looks like, and make sure it ships.

**50 words:**
Dennis Petri is a creative director and product designer in The Hague. He works
with organisations whose knowledge their own people can't reach. He finds the
product those people actually need, decides what good looks like, and makes sure
it ships, building it himself or steering the developers who do.

**100 words:**
Dennis Petri is a creative director and product designer based in The Hague, the
Netherlands. He works with organisations whose knowledge sits in systems their own
people can't reach: associations, research networks, banks and public bodies. He
finds the product those people actually need, decides what good looks like, and
makes sure it ships, building it himself or steering the developers who do. Trained
as a designer at the Willem de Kooning Academy, he has 20+ years of digital design
behind him, and most of his clients have stayed five years or longer.
He also runs Handoff, a one-off design review service.

**Specialties / skills:** product strategy, product design, creative direction,
AI product prototyping, knowledge management products

**Location:** The Hague, Netherlands

## Measuring it

Once a month, ask ChatGPT, Claude and Perplexity the five query shapes at the
top, plus "who is Dennis Petri". Note whether he appears and what they say. The
"who is" answer tells you if the entity is merged with Handoff or still split.
AI referrals arrive as direct traffic, so GA won't show this.
