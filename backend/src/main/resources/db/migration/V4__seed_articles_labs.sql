insert into articles (slug, title, excerpt, content, article_date, read_minutes, tags, author, icon, published)
values
  ('ce-que-lia-change-education-financiere', 'Ce que l''IA change vraiment dans l''éducation financière', 'Des outils accessibles pour expliquer l''investissement, en français et en darija.', $mdx$La plupart des outils d'éducation financière ont été conçus pour un public qui lit déjà l'anglais financier. L'IA générative change ça moins par la technologie elle-même que par ce qu'elle rend possible : traduire un concept complexe dans la langue et le registre de la personne qui apprend, pas l'inverse.

## Trois usages qui tiennent la route

Le premier est la reformulation à la demande — expliquer un bilan financier trois fois, à trois niveaux de complexité, sans réécrire trois fois le cours. Le deuxième est la voix-off en darija, qui rend un contenu écrit en français réellement accessible à un public qui parle mais ne lit pas nécessairement le français financier. Le troisième est la génération d'exemples chiffrés adaptés au contexte marocain — dirhams, taux locaux, produits disponibles localement — plutôt que des exemples calibrés pour un marché nord-américain.

> "L'objectif n'est pas de remplacer le professeur, c'est de rendre le premier cours moins intimidant."

## Ce qui ne change pas

L'IA ne remplace pas la nécessité d'un contenu juste. Un exemple mal traduit ou un chiffre mal contextualisé reste faux, généré ou non. Chaque leçon publiée ici passe encore par une relecture humaine avant d'être mise en ligne — l'IA accélère la production, elle ne se substitue pas à la vérification.$mdx$, '2026-07-05', 5, 'IA,Éducation', 'Tarik El Berrak', 'rings', true),
  ('designing-event-driven-architectures', 'Designing Event-Driven Architectures for Real-Time Risk Management', 'Why request-response patterns break down under market stress, and what to replace them with.', $mdx$Most trading and risk platforms still lean on request-response calls: a service asks another for a position, a price, a limit check, and waits. That works fine on a quiet Tuesday. It breaks exactly when it matters most — during a volatility spike, when call volumes spike together and every synchronous dependency becomes a queue of one.

Event-driven architecture doesn't remove that pressure, but it changes where it shows up. Instead of a chain of blocking calls, state changes are published as events, and every downstream system reacts at its own pace, from its own durable log. Risk aggregation stops being a call you make and becomes a view you maintain continuously.

## Where request-response quietly fails

The failure mode is rarely a crash. It's latency creep: a risk check that normally takes 40ms starts taking 4 seconds because three services upstream are all waiting on each other. Nothing is technically down, but every desk relying on that check is now flying blind during the exact window they need it most.

```json
// Example — position update event
{
  "event": "position.updated",
  "instrument": "MNQ",
  "delta": -4,
  "asOf": "2026-09-21T14:32:01Z",
  "source": "execution-gateway"
}
```

Each consumer — risk aggregation, limits, reporting — subscribes to this stream independently. A slow consumer no longer slows the producer down, and a consumer that's temporarily offline replays from the log the moment it recovers.

> "The goal isn't to make every call faster. It's to make almost nothing a call at all."

## What actually needs to change

Three things tend to matter more than the messaging technology itself: giving every event a stable schema and a version, treating the event log as the source of truth rather than any single service's database, and designing consumers to be idempotent so replays and retries never double-count a position.

None of this is exotic. It's the same discipline good ledger systems have always needed — event sourcing just makes it explicit, and testable, before the volatile day arrives instead of during it.$mdx$, '2026-09-15', 8, 'Architecture,Risk & Resilience', 'Tarik El Berrak', 'bars', true),
  ('devsecfinops-cost-security-cloud-banking', 'DevSecFinOps: Bringing Cost and Security Together in Cloud Banking', 'A practical model for treating spend and risk as one conversation, not two teams.', $mdx$In most banks, cost and security review a change at different times, from different dashboards, and rarely agree on what "done" looks like. A workload can pass a security gate and still be an unbounded cost risk, or come in under budget by skipping encryption at rest. Treating them as one conversation — one policy layer evaluated in the same pull request — closes that gap.

## One gate, two lenses

The mechanism is simple: policy-as-code checks run in CI against every infrastructure change, evaluating both a security baseline (encryption, network exposure, IAM scope) and a cost baseline (instance sizing, autoscaling bounds, idle-resource TTLs) before the change reaches a human reviewer.

```hcl
# Example — Terraform plan gate (OPA/Conftest)
deny[msg] {
  input.resource.aws_db_instance.publicly_accessible == true
  msg = "Databases must not be publicly accessible"
}

warn[msg] {
  input.resource.aws_instance.instance_type == "m5.24xlarge"
  msg = "Oversized instance — confirm autoscaling bounds"
}
```

## What this changes day to day

Engineers get one comment thread instead of two review cycles. Security stops being the team that says no after the cost review already said yes. And finance stops discovering the expensive workload three weeks into the invoice instead of at merge time.

The discipline scales past cloud infrastructure, too — the same pattern works for model-serving costs and data-residency checks on AI workloads, which is where most banks are about to need it next.$mdx$, '2026-08-10', 6, 'Cloud,FinOps', 'Tarik El Berrak', 'toggle', true);

insert into labs (slug, title, excerpt, content, status, category, tags, icon, lab_date, published)
values
  ('devsecfinops-policy-toolkit', 'DevSecFinOps Policy-as-Code Toolkit', 'Guardrails that check cost, security and compliance in the same pull request, before deploy.', $mdx$## What this is

A reusable set of Open Policy Agent policies that evaluate Terraform plans for security baseline violations, cost outliers and compliance tagging gaps, wired into CI so the check runs on every pull request rather than as a separate downstream audit.

## Architecture

Terraform plans are exported to JSON and evaluated with Conftest against a shared policy bundle. Violations are categorized as `deny` (blocks merge) or `warn` (posts a PR comment), and the bundle is versioned independently so policy updates roll out without touching application repos.

## Findings so far

Splitting policies into `deny` and `warn` tiers was essential for adoption — teams tolerate a blocking gate much better when it's narrow and well-justified, and a wide `warn` tier still surfaces issues without stalling every PR on day one.

## What I'd do differently

The first policy bundle tried to cover too many resource types at once, which made false positives hard to triage. Rolling out policies resource-type by resource-type, starting with the highest-risk ones, would have built trust in the gate faster.$mdx$, 'Live', 'Cloud & Kubernetes', 'OPA,Terraform,Azure', 'toggle', '2026-07-18', true),
  ('event-driven-trading-signals', 'Event-Driven Trading Signals', 'A streaming pipeline that turns tick data into candlestick pattern signals in near real time.', $mdx$## What this is

A streaming pipeline that ingests tick data, aggregates it into candlesticks on multiple timeframes, and scores each new candle against a library of classical patterns (engulfing, doji, hammer) plus a lightweight gradient-boosted classifier trained on historical continuation outcomes.

## Architecture

Ticks land on a Kafka topic from the execution gateway. A Faust stream processor windows them into OHLCV candles per timeframe and republishes completed candles to a `candles.{symbol}.{timeframe}` topic. A separate signal service consumes that topic, runs pattern detection, and writes scored signals to Postgres and a `signals` topic for downstream alerting.

## Findings so far

Pattern-only signals have a high false-positive rate in choppy sessions — the classifier layer, trained mostly on regime (trend vs. range) as a feature, cuts false positives by roughly a third in early backtests. The next iteration adds a volatility-regime feature explicitly rather than relying on the classifier to infer it.

## What I'd do differently

Windowing candle aggregation in the stream processor instead of the database was the right call for latency, but it made backfills harder — replaying historical ticks needs its own code path rather than reusing the live windowing logic. I'd unify those from day one next time.$mdx$, 'In Progress', 'Trading & Quant', 'Kafka,Python,ML', 'bars', '2026-09-01', true),
  ('kubernetes-cost-resilience-simulator', 'Kubernetes Cost & Resilience Simulator', 'Models the cost and failure-recovery trade-offs of different cluster topologies before you build them.', $mdx$## What this is

A simulator that takes a candidate cluster topology — node pool mix, multi-AZ spread, pod disruption budgets — and estimates both its steady-state cost and its recovery time under a simulated zone failure, so the trade-off is visible before the topology is provisioned.

## Architecture

Written in Go, the simulator models nodes, pods and their scheduling constraints as a lightweight graph, replays a configurable failure scenario (single AZ loss, node pool drain, spot reclaim), and reports time-to-reschedule alongside a monthly cost estimate built from published cloud pricing.

## Findings so far

The biggest lever wasn't node pool size — it was pod disruption budget configuration. Overly conservative PDBs on stateless workloads added minutes of unnecessary recovery time during simulated AZ loss for no resilience benefit, since those workloads had no state to protect.

## What I'd do differently

The first version only simulated AZ failure. Adding spot-instance reclaim as a second scenario surfaced a completely different bottleneck (image pull time on cold nodes), so I'd build multiple failure scenarios in from the start rather than bolting them on later.$mdx$, 'Case Study', 'Cloud & Kubernetes', 'Kubernetes,FinOps,Go', 'hexagons', '2026-05-12', true),
  ('llm-copilot-architecture-reviews', 'LLM Copilot for Architecture Reviews', 'Retrieval-augmented assistant that checks new designs against internal reference architectures.', $mdx$## What this is

An internal assistant that reads a submitted architecture document and flags divergence from published reference architectures — missing DR region, absent data-classification tagging, non-standard auth pattern — before a human architect spends an hour on the same checklist.

## Architecture

Reference architectures, decision records and past review comments are chunked and embedded into a vector store. On submission, the assistant retrieves the most relevant reference material for the design's domain (payments, data platform, integration), then prompts an Azure OpenAI model to produce a structured review: findings, severity, and the specific reference clause each finding is grounded in.

## Findings so far

Grounding every finding in a specific retrieved passage — rather than letting the model reason freely — cut hallucinated findings dramatically and made reviewers trust the output enough to actually read it instead of skimming past it. Precision matters more than recall here: architects would rather the tool stay quiet than flag ten things where seven are noise.

## What I'd do differently

Early versions re-embedded the entire reference corpus on every document update, which was slow and unnecessary. Incremental re-indexing on changed documents only would have saved a lot of iteration time.$mdx$, 'Live', 'AI & LLM', 'LLM,RAG,Azure OpenAI', 'network', '2026-06-20', true),
  ('micro-nq-candlestick-backtester', 'Micro NQ Candlestick Pattern Backtester', 'Backtests candlestick-pattern strategies on CME Micro NQ futures across multiple timeframes.', $mdx$## What this is

A backtesting harness focused specifically on Micro NQ futures, evaluating candlestick pattern strategies across the 1-minute, 5-minute and 15-minute timeframes with realistic slippage and commission assumptions for a retail-sized account.

## Architecture

Historical tick data is resampled into OHLCV bars per timeframe. Strategies are expressed as pattern-detection functions plus entry/exit rules, run through a vectorized backtest engine, and scored on Sharpe ratio, max drawdown and win rate, with walk-forward validation to reduce overfitting to a single historical window.

## Findings so far

Patterns that perform well in-sample on the 1-minute timeframe degrade the most out-of-sample — noise dominates at that resolution for this instrument. The 15-minute timeframe has produced the most walk-forward-stable results so far, though at lower trade frequency.

## What I'd do differently

Slippage was modeled as a flat number of ticks initially, which overstated performance in low-liquidity windows. Modeling slippage as a function of recent volume would give a more honest picture — this is the next change queued up.$mdx$, 'In Progress', 'Trading & Quant', 'Python,Quant,Backtesting', 'bars', '2026-08-25', true),
  ('multi-agent-ops-assistant', 'Multi-Agent Ops Assistant for Cloud Incidents', 'Agents that triage, correlate and draft the incident summary while the engineer is still investigating.', $mdx$## What this is

A set of cooperating agents that pick up an incident the moment it's paged: one triages recent deploys and config changes for likely correlation, one queries logs and metrics for anomalies in the affected window, and one drafts a running incident summary that the on-call engineer edits rather than writes from scratch.

## Architecture

Agents communicate through a shared incident-state object rather than directly to each other, which keeps the system debuggable — every agent's contribution is a diff against that shared state, visible to the human in real time. A coordinator agent decides which specialist agent to invoke next based on what's still unknown about the incident.

## Findings so far

The summary-drafting agent is the highest-value piece by a wide margin — engineers report it saves the most time precisely because incident writeups are tedious, not because they're hard. The correlation agent is more hit-or-miss and currently needs a human to confirm its hypotheses before they're trusted.

## What I'd do differently

Early versions let agents call each other directly, which made a bad hypothesis from one agent propagate silently into another's reasoning. Routing everything through shared, human-visible state fixed that, and I'd design for that visibility from the first prototype next time.$mdx$, 'Prototype', 'AI & LLM', 'LLM Agents,Kubernetes,Observability', 'rings', '2026-09-10', true);
