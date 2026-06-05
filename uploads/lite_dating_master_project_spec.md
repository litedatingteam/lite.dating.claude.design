# lite.dating — Master Product, Architecture, Safety, Legal, and Delivery Specification

**Document status:** Project source of truth / handoff spec  
**Last updated:** 2026-06-05  
**Product owner / PM:** Halit Turan ARICAN  
**Senior auditor / technical product manager:** ChatGPT  
**Design execution lead:** Claude  
**Implementation execution lead:** Codex  
**Primary domain:** `lite.dating`  
**General contact:** `support@lite.dating`  

---

## 0. Purpose of this document

This document is the master specification for the new direction of **lite.dating**. It is intended to be used by Claude, Codex, and future reviewers as the canonical product and architecture source.

It intentionally supersedes all older lite.dating definitions, payment models, MVP reductions, and earlier assumptions. The current direction is based on the latest concept direction: a free, ad-supported, consent-first dating discovery website where users do not swipe, do not chat inside the product, and do not pay to unlock contact. Users discover profiles and request to share verified Instagram or Telegram handles. A handle is revealed only when both people consent to the same verified contact channel.

This document covers:

- Product thesis and boundaries.
- Full functional scope.
- Design and UX principles.
- Frontend/backend architecture.
- Deployment and external service decisions.
- Data model and state machines.
- Auth/session strategy.
- Verification strategy.
- Moderation and appeal system.
- False-report and bot-abuse protections.
- AdSense/ad-safe architecture.
- Legal/privacy/KVKK/GDPR/DSA foundations.
- Admin/moderator security.
- Implementation roadmap for Codex.
- Design master direction for Claude.
- Launch checklist and risk register.

The goal is not to shrink scope. The goal is to keep the full concept coherent, buildable, reviewable, and safe enough to launch without turning the project into an unbounded compliance or AI research project.

---

## 1. One-sentence product thesis

**lite.dating is a free, no-swipe, no-in-app-DM dating discovery website where people browse real profiles, request a verified Instagram or Telegram handle, and only unlock the handle when both people consent.**

Shorter marketing line:

> **Skip the swiping. Skip the chat. Just trade handles.**

Operational line:

> **Browse real profiles. Request a verified handle. Talk elsewhere when it is mutual.**

---

## 2. Product identity

### 2.1 What lite.dating is

lite.dating is:

- A dating discovery website.
- Free to use.
- Ad-supported through clearly labeled Google ads.
- Built around consent-based contact handle exchange.
- Designed to get users out of the app, not trap them inside chat loops.
- Focused on real profiles, verified photos, verified contact channels, and safety tooling.
- International/EU-open in direction, with English-first public/legal surfaces and Turkish/KVKK support.
- Operated initially by a solo operator without a company.

### 2.2 What lite.dating is not

lite.dating is not:

- A swipe game.
- A chat app.
- A paid dating app.
- A subscription app.
- A KYC/identity-document platform.
- A sex/hookup/escort/sugar dating product.
- A platform for explicit sexual content.
- A public profile indexing farm.
- A place where private communication is monetized with ads.
- A moderation tool that blindly trusts AI or blindly trusts reports.

---

## 3. Locked strategic decisions

These decisions are locked unless the Product Manager explicitly changes direction.

### 3.1 Business model

- **Free access.**
- **No subscription.**
- **No premium tier.**
- **No paid verification.**
- **No card required.**
- **Revenue model: Google AdSense / Google ads only.**

### 3.2 Auth model

- **No password system.**
- **No Apple Sign-In.**
- **No passkeys at launch.**
- **Google Sign-In + email code fallback.**
- **Trusted long-lived sessions.**
- Email code is not required on every login. It is required for first login, new device, suspicious/risky login, or sensitive account actions.

### 3.3 Verification model

- **No government ID upload.**
- **No passport/national ID verification.**
- **No KYC vendor.**
- **Photo verification via private verification selfie.**
- **Reusable reference selfie allowed only with explicit separate consent.**
- **Instagram and Telegram channel verification are required before users can request those channels from others.**

### 3.4 AI/model strategy

- **No self-hosted AI at launch.**
- **No GPU/model-serving infrastructure at launch.**
- **Google Cloud Vision for image/photo moderation and face presence checks.**
- **OpenAI Moderation endpoint for text moderation.**
- AI is a triage/risk tool, not a final judge for irreversible enforcement.

### 3.5 Deployment and stack

- **Next.js frontend.**
- **NestJS backend API.**
- **NestJS worker service.**
- **Postgres via Neon Launch.**
- **Prisma ORM.**
- **Railway Pro for app/API/worker hosting.**
- **Cloudflare Pro as DNS/CDN/WAF/perimeter.**
- **Cloudflare R2 for media storage.**
- **Cloudflare Access for admin/moderator subdomains.**
- **Cloudflare Turnstile for bot friction.**
- **Resend Pro for transactional email.**

### 3.6 Legal/compliance direction

- Legal docs will be custom-written for this product.
- Heavy certifications such as ISO 27001 and SOC 2 are out of launch scope.
- EU-open direction remains, but EU representative/DSA representative will be handled as a quote/activation item, not as a reason to build KYC-heavy flows.
- Google-certified CMP requirement will be handled through Google AdSense Privacy & messaging / European regulations message.
- Internal legal consent/version logging remains separate from Google CMP.

---

## 4. Target users

### 4.1 Primary user

A person who wants a lower-friction way to discover dating profiles without:

- endless swiping,
- manipulative match mechanics,
- in-app chat pressure,
- paywalls,
- card-required trials,
- or paying to see/contact people.

### 4.2 Safety-sensitive user

A user who needs:

- verified photos,
- channel verification,
- clear report tools,
- ability to block/report,
- no public exposure of private contact handles,
- no pressure to chat inside the platform,
- control over visibility and deletion.

### 4.3 Moderator/admin user

A person reviewing assigned safety cases, not browsing users. Their workflow must be case-based, limited, logged, and privacy-preserving.

---

## 5. Core product mechanic

### 5.1 Handle request model

The product revolves around **verified contact channel requests**.

A user can request another user’s:

- Instagram handle; or
- Telegram handle.

But only if:

1. The requester has verified that same channel on their own account.
2. The target user has verified that channel.
3. The target user is eligible to receive requests.
4. The requester has not exceeded request limits or risk restrictions.
5. The target user has not blocked or restricted the requester.

### 5.2 Mutual unlock

A handle is revealed only after mutual consent.

Flow:

1. User A views User B.
2. User A requests Instagram or Telegram.
3. User B receives incoming request.
4. User B accepts/share handle or declines/pass.
5. If User B accepts, both users see the chosen verified handle.
6. The handle remains visible inside lite.dating for a limited window.

### 5.3 Handle visibility window

The handle is visible in lite.dating for **14 days**.

Important wording:

- Correct: “The handle stays visible inside lite.dating for 14 days.”
- Incorrect: “The handle disappears everywhere.”

Once a user sees a handle, lite.dating cannot guarantee the user has not saved it or contacted the person outside the platform.

After 14 days:

- the connection card expires inside lite.dating;
- users may refresh if both still consent;
- the history remains in internal audit/safety records as needed.

---

## 6. Product scope

The scope is not being narrowed. The concept includes public pages, onboarding, app surfaces, settings, report flows, moderator dashboard, admin dashboard, legal pages, ad compliance, crawler/security, audit logs, risk signals, policy templates, and appeals.

The implementation can be phased, but scope stays in the product definition.

### 6.1 Public surfaces

Required public routes:

- `/` landing
- `/about`
- `/how-it-works`
- `/free`
- `/safety`
- `/privacy`
- `/terms`
- `/gdpr`
- `/kvkk`
- `/privacy/full`
- `/terms/full`
- `/gdpr/full`
- `/kvkk/full`
- `/contact`
- `/sign-up`

### 6.2 Onboarding surfaces

Required onboarding routes:

- `/onboarding/about-you`
- `/onboarding/photos`
- `/onboarding/bio`
- `/onboarding/interests`
- `/onboarding/channels`
- `/onboarding/photo-verification`

### 6.3 App surfaces

Required app routes:

- `/discover`
- `/discover?empty=nearby`
- `/profile/:profileSlugOrId`
- `/profile/:profileSlugOrId?action=request`
- `/inbox`
- `/sent`
- `/connections`
- `/favorites`
- `/me`
- `/me/edit`
- `/settings`
- `/settings/ad-experience`
- `/settings/notifications`
- `/settings/delete-account`
- `/settings/safety`
- `/report/:profileId`

### 6.4 Moderator surfaces

Required moderator routes:

- `moderator.lite.dating/dashboard`
- `moderator.lite.dating/case/:caseId`
- `moderator.lite.dating/evidence/:caseId`
- `moderator.lite.dating/decisions/:caseId`
- `moderator.lite.dating/templates`
- `moderator.lite.dating/shift-notes`

### 6.5 Admin surfaces

Required admin routes:

- `admin.lite.dating/`
- `admin.lite.dating/revenue`
- `admin.lite.dating/visitors`
- `admin.lite.dating/trust-safety-ops`
- `admin.lite.dating/moderators`
- `admin.lite.dating/roles`
- `admin.lite.dating/moderation-queue`
- `admin.lite.dating/reports/:caseId`
- `admin.lite.dating/trust-safety-detail`
- `admin.lite.dating/ig-queue`
- `admin.lite.dating/photo-queue`
- `admin.lite.dating/re-verification`
- `admin.lite.dating/appeals`
- `admin.lite.dating/ad-compliance`
- `admin.lite.dating/audit-logs`
- `admin.lite.dating/risk-signals`
- `admin.lite.dating/legal-crawler`
- `admin.lite.dating/policy-templates`

---

## 7. External service decisions

### 7.1 Infrastructure/services table

| Category | Chosen service | Launch use |
|---|---|---|
| DNS/CDN/WAF | Cloudflare Pro | Domain, WAF, CDN, security rules |
| Bot friction | Cloudflare Turnstile | Signup, email-code, report, appeal, contact forms |
| Admin gateway | Cloudflare Access Free | Protect admin/moderator subdomains before app auth |
| Object storage | Cloudflare R2 Standard | Profile media, verification selfie, evidence, appeal attachments |
| Edge logic | Cloudflare Workers | Signed media proxy, ad/crawler gate, path guards |
| Email aliases | Cloudflare Email Routing | support/privacy/legal/safety/abuse/dsa aliases |
| App hosting | Railway Pro | web/api/worker services |
| Database | Neon Postgres Launch | Production Postgres |
| ORM | Prisma | Typed schema and migrations |
| Transactional email | Resend Pro | Email codes, notifications, legal updates, appeal notices |
| Ads | Google AdSense | Ad-supported revenue |
| Google CMP | AdSense Privacy & messaging | EEA/UK/Switzerland ad consent |
| Image moderation | Google Cloud Vision | SafeSearch + face detection |
| Text moderation | OpenAI Moderation endpoint | Bio, intro, report/appeal text safety |
| Monitoring | Better Stack Free | Uptime, logs, errors, status |
| EU representation | Prighter quote | GDPR/DSA representative services |

### 7.2 Explicit non-choices

The following are excluded from launch:

- self-hosted AI;
- custom ML model hosting;
- GPU servers;
- KYC/ID verification vendor;
- Apple Sign-In;
- passkeys;
- password system;
- paid human moderation vendor;
- ISO 27001;
- SOC 2;
- Kubernetes;
- self-hosted Postgres;
- Firebase-only database;
- static-only Next.js export.

---

## 8. System architecture

### 8.1 High-level architecture

```text
User browser
  ↓
Cloudflare DNS/CDN/WAF/Turnstile/Access
  ↓
Railway services
  ├── web: Next.js
  ├── api: NestJS
  └── worker: NestJS worker
  ↓
Neon Postgres
  ↓
Cloudflare R2 media storage
  ↓
External APIs: Resend, Google Vision, OpenAI Moderation, AdSense/CMP, Better Stack
```

### 8.2 Subdomains

| Host | Purpose | Protection |
|---|---|---|
| `lite.dating` | Public and app routes | Cloudflare WAF |
| `www.lite.dating` | Redirect/canonical | Cloudflare redirect |
| `api.lite.dating` | API endpoint | Cloudflare WAF + backend auth |
| `admin.lite.dating` | Admin dashboard | Cloudflare Access + app role auth |
| `moderator.lite.dating` | Moderator dashboard | Cloudflare Access + app role auth |
| `media.lite.dating` | Media proxy | Worker signed/proxy access |

### 8.3 Monorepo structure

```text
lite-dating/
  apps/
    web/                 # Next.js frontend
    api/                 # NestJS API
    worker/              # NestJS worker jobs
  packages/
    db/                  # Prisma schema/client/migrations
    shared/              # shared types, enums, constants
    config/              # eslint, tsconfig, env schemas
    ui/                  # optional shared design primitives
  docs/
    master-spec.md
    claude-design-master-prompt.md
    legal/
    architecture/
  scripts/
    seed.ts
    check-env.ts
```

---

## 9. Frontend architecture

### 9.1 Next.js role

Next.js is the UI and page layer:

- public pages;
- auth pages;
- onboarding;
- app dashboard;
- profile/discovery UI;
- settings and safety center;
- admin/moderator UIs.

Next.js must not become the core business-logic backend. Complex policy logic, state transitions, moderation decisions, verification, reports, appeals, legal events, and ad-safe state updates belong in NestJS.

### 9.2 Frontend requirements

- App Router.
- TypeScript.
- Tailwind CSS.
- Responsive mobile-first layout.
- Strong loading/error/empty states.
- Accessible semantic structure.
- No direct secret/service API keys in frontend.
- API calls through typed client.
- Session handled through secure HTTP-only cookies.

### 9.3 UI principles

- Warm, modern, social, lightweight.
- Not a corporate SaaS landing page.
- Not an overly sexualized dating app.
- No dark-pattern urgency.
- No fake scarcity.
- No chat-like UI that implies in-app messaging.
- Ads clearly separated from profile actions.
- Safety and privacy language visible without feeling scary.

---

## 10. Backend architecture

### 10.1 NestJS modules

Required backend modules:

```text
AuthModule
UsersModule
ProfilesModule
MediaModule
VerificationModule
DiscoveryModule
RequestsModule
ConnectionsModule
FavoritesModule
ReportsModule
ModerationModule
AppealsModule
LegalModule
AdsModule
RiskModule
NotificationsModule
AdminModule
AuditModule
JobsModule
```

### 10.2 Backend responsibilities

- Session creation and validation.
- Email code verification.
- Google Sign-In validation.
- Profile CRUD.
- Media upload URL issuance.
- Media state transitions.
- Photo moderation result ingestion.
- Contact channel verification.
- Discovery eligibility and ranking.
- Handle request state machine.
- Inbox/sent/connections data.
- Report creation and AI triage.
- Appeal creation and review workflow.
- Admin/moderator role enforcement.
- Legal consent event logging.
- Ad-safe rendering gate.
- Bot/risk scoring.
- Audit logging.
- Notification/email dispatch.

### 10.3 Worker responsibilities

The worker service processes async jobs:

- image moderation jobs;
- face presence/quality checks;
- thumbnail/derivative generation;
- OpenAI text moderation jobs;
- report AI triage jobs;
- legal update notification jobs;
- cleanup/retention jobs;
- expired connection-window jobs;
- risk score recalculations;
- ad-safe state recalculations.

At launch, the job queue can be DB-backed. Cloudflare Queues can be added later if throughput requires it.

---

## 11. Database architecture

### 11.1 Principles

- Postgres is source of truth.
- Prisma is migration and typed client layer.
- State transitions are explicit.
- Audit logs are immutable append-only records.
- Sensitive media is never stored in Postgres, only metadata and R2 keys.
- Legal consent logs must include document version/hash and timestamp.
- Moderation decisions must be traceable to case, evidence, actor, and reason.

### 11.2 Core tables

Below is a conceptual schema. Prisma models should map closely to these domains.

#### users

```text
id
email
email_verified_at
google_subject_id nullable
account_status: active | limited | suspended | permanently_banned | deletion_pending | deleted
role: user | moderator | admin | owner
birthdate nullable
age_confirmed_at
created_at
updated_at
last_login_at
```

#### profiles

```text
id
user_id
name
age_display
gender
looking_for
city
country
bio_short
about_long
profile_status: draft | pending_review | active | paused | hidden | suspended | banned
visibility_status: active | paused_by_user | visibility_hold | admin_hidden
ad_safe_state: pending_review | eligible | limited | blocked
photo_verification_status: unverified | pending | verified | reverify_required | rejected
created_at
updated_at
```

#### profile_photos

```text
id
profile_id
r2_key_original
r2_key_derivative
photo_status: uploaded | ai_pending | manual_review | approved | rejected | removed
is_primary
safe_search_result jsonb
face_detection_result jsonb
ad_safe_state
created_at
updated_at
```

#### verification_selfies

```text
id
user_id
r2_key_private
selfie_type: one_time | reusable_reference
status: pending | active | revoked | deleted | expired
explicit_consent_event_id nullable
created_at
revoked_at nullable
deleted_at nullable
```

#### contact_channels

```text
id
user_id
channel_type: instagram | telegram
handle_encrypted
handle_hash
verification_status: unverified | pending | verified | rejected | reverify_required | revoked
verified_at
last_reverified_at
created_at
updated_at
```

#### handle_requests

```text
id
requester_user_id
target_user_id
channel_type
status: pending | accepted | declined | expired | canceled | blocked_by_safety
intro_note nullable
text_moderation_result jsonb
created_at
responded_at
expires_at
```

#### connections

```text
id
request_id
user_a_id
user_b_id
channel_type
status: active | expired | refreshed | blocked | safety_removed
visible_until
created_at
updated_at
```

#### reports

```text
id
reporter_user_id
reported_user_id
reported_profile_id nullable
report_type
report_reason
statement
status: submitted | ai_triage | open | waiting_evidence | under_review | resolved | closed
report_weight numeric
reporter_trust_snapshot numeric
evidence_quality_score numeric
coordination_risk_score numeric
retaliation_risk_score numeric
created_at
updated_at
```

#### report_evidence

```text
id
report_id
uploaded_by_user_id
r2_key_private
file_type
file_hash
evidence_status: uploaded | ai_pending | review_ready | restricted | deleted
created_at
```

#### moderation_cases

```text
id
case_type: report | photo_verify | channel_verify | appeal | ad_policy | reverify | ban_evasion
subject_user_id
related_report_id nullable
priority: low | normal | high | urgent
status: open | assigned | under_review | waiting_user | escalated | resolved | closed
assigned_to_user_id nullable
created_at
updated_at
sla_due_at
```

#### moderation_decisions

```text
id
case_id
subject_user_id
decision_type
action_taken
reason_category
terms_rule_id nullable
ai_used boolean
human_reviewed boolean
reviewer_user_id nullable
user_visible_summary
internal_summary
created_at
notified_at
appeal_deadline_at
```

#### appeals

```text
id
decision_id
user_id
appeal_type
status: draft | submitted | intake_ai_triaged | waiting_user_evidence | assigned_to_reviewer | under_review | escalated | decision_upheld | decision_reversed | partially_reversed | closed_no_response | duplicate | abusive_appeal
reason_selected
user_statement
priority
sla_due_at
created_at
updated_at
closed_at
outcome nullable
```

#### legal_documents

```text
id
document_type: terms | privacy | gdpr | kvkk | cookie_ads | photo_verification | safety | moderation_appeal | retention | dsa_notice
version
language
title
body_markdown
body_hash
summary_of_changes
published_at
effective_at
requires_reacceptance boolean
status: draft | published | archived
created_by_user_id
```

#### legal_consent_events

```text
id
user_id
event_type: acceptance | acknowledgment | consent | withdrawal | rejection
document_type
document_version
document_hash
language
action
required boolean
created_at_utc
user_local_time nullable
timezone nullable
ip_hash nullable
user_agent_hash nullable
device_id_hash nullable
session_id nullable
source_screen
app_version nullable
policy_change_id nullable
```

#### admin_access_events

```text
id
actor_user_id
case_id nullable
resource_type
resource_id nullable
action: view | reveal | download_attempt | decision | search | role_change | break_glass
reason nullable
ip_hash
device_id_hash
created_at
```

#### ad_events

```text
id
user_id nullable
session_id
page_type
slot_id
ad_render_allowed boolean
block_reason nullable
consent_state_snapshot jsonb
traffic_risk_score numeric
content_ad_safe_state
created_at
```

#### risk_events

```text
id
user_id nullable
session_id nullable
risk_type
risk_score
signals jsonb
action_taken nullable
created_at
```

---

## 12. State machines

### 12.1 Account status

```text
active
  → limited
  → suspended
  → permanently_banned
  → deletion_pending
  → deleted
```

Rules:

- `limited` restricts specific actions.
- `suspended` blocks app use except appeal/data/privacy screens.
- `permanently_banned` blocks return and creates ban-evasion safety records.
- Permanent ban normally requires human review.

### 12.2 Profile status

```text
draft
  → pending_review
  → active
  → paused
  → hidden
  → suspended
  → banned
```

Rules:

- Draft profiles cannot appear in discovery.
- Pending review profiles cannot receive ads around them.
- Hidden/paused profiles do not appear in discovery.

### 12.3 Ad-safe state

```text
pending_review
  → eligible
  → limited
  → blocked
```

Rules:

- Default for new/changed UGC is `pending_review`.
- Reported content becomes at least `limited` until cleared.
- Adult/unsafe/evidence/admin/mod/private pages are always blocked from ad rendering.

### 12.4 Photo verification state

```text
unverified
  → pending
  → verified
  → reverify_required
  → rejected
```

Rules:

- Verification selfie is private.
- Reusable reference selfie requires explicit consent.
- Photo changes can trigger re-verification.
- No government ID is requested.

### 12.5 Request state

```text
pending
  → accepted
  → declined
  → expired
  → canceled
  → blocked_by_safety
```

Rules:

- Only verified channel requests are allowed.
- Request intro is not a chat.
- The recipient can accept or decline; there is no reply thread.

### 12.6 Connection state

```text
active
  → expired
  → refreshed
  → blocked
  → safety_removed
```

Rules:

- Visible window is 14 days.
- A refreshed window requires appropriate consent.
- Block/safety action hides connection.

### 12.7 Report handling state

```text
submitted
  → ai_triage
  → open
  → waiting_evidence
  → under_review
  → resolved
  → closed
```

Report escalation:

- First report triggers AI triage.
- If AI sees high/critical risk, immediate visibility hold/suspension is allowed.
- Second report triggers stricter audit.
- Third trusted unique report triggers suspension + manual review.
- False/coordinated report signals reduce report weight and may open a reporter-abuse case.

### 12.8 Appeal state

```text
submitted
  → intake_ai_triaged
  → assigned_to_reviewer
  → under_review
  → decision_upheld | decision_reversed | partially_reversed
```

Rules:

- Appeal is available for suspensions, bans, visibility holds, verification failures, photo rejections, report decisions, and ad-policy visibility blocks.
- AI can triage but final appeal decisions require human supervision.
- EU-open direction requires appeal availability and reasoned decisions.

---

## 13. Auth and sessions

### 13.1 Login options

User-facing options:

- Continue with Google.
- Continue with email code.

No password. No Apple. No passkey.

### 13.2 Email code rules

- One-time code.
- Short expiration window.
- Server stores hash, not raw code.
- Rate-limited by email, IP, device, and session.
- Same response whether email is registered or not.
- Turnstile required on abuse-prone paths.

### 13.3 Trusted sessions

- Session cookie must be HTTP-only, Secure, SameSite Lax/Strict.
- Do not store auth token in localStorage.
- Trusted devices remain signed in.
- New/risky device triggers email code.
- Sensitive actions trigger step-up verification.

Sensitive actions include:

- email change;
- account deletion;
- verified contact channel change;
- reusable selfie consent change;
- appeal/ban-sensitive action;
- suspicious session reset.

### 13.4 Safety page messaging

The site should clearly say:

> Simple sign-in does not mean weak protection. lite.dating does not use passwords, so there is no lite.dating password database for attackers to steal. Trusted devices stay signed in, and we ask for a new code when there is a new device, unusual activity, or sensitive account change.

---

## 14. Verification system

### 14.1 Photo verification

The private verification selfie is used to verify that profile photos show the same person.

Rules:

- It is never public.
- It is never shown in discovery.
- It is never used for ads.
- It is never exposed to Google/AdSense bots.
- It is stored in private R2 storage.
- Access requires case-based permission.
- Raw reveal is logged and watermarked.

### 14.2 Reusable reference selfie

Users may opt into reusable reference selfie.

Consent language must be separate from general Terms:

- explain purpose;
- explain storage;
- explain future photo-change use;
- explain withdrawal;
- explain that declining may require new selfies later.

States:

```text
none
consented_active
one_time_expired
revoked
deleted
suspended_retained_safety_record
```

### 14.3 Contact-channel verification

Instagram and Telegram are separate verified channels.

Rules:

- User can only request a channel they have verified.
- User can only request a channel the target has verified.
- Handles are encrypted and hashed.
- Moderators do not see raw handles by default.
- Raw handle reveal requires reason and high-level permission.

### 14.4 No identity-document verification

The platform does not request:

- passport;
- government ID;
- national ID;
- driver’s license;
- KYC vendor checks.

This is intentional data minimization.

---

## 15. Discovery and ranking

Discovery is not a swipe deck. It is a browse/feed system.

Ranking should optimize for:

- verified profiles;
- profile completeness;
- safety/risk eligibility;
- ad-safe eligibility where relevant;
- interest overlap;
- city/distance settings;
- recency without creepiness;
- diversity and freshness;
- not repeatedly showing same style/person type.

Ranking must not optimize for:

- hotness scoring;
- monetized pay-to-rank;
- manipulative scarcity;
- addictive swiping loops.

---

## 16. Reporting system

### 16.1 Report categories

Required report categories:

- fake profile;
- impersonation;
- stolen photos;
- AI/deepfake identity;
- harassment;
- scam/fraud;
- sexual/explicit content;
- underage suspicion;
- off-platform harm after handle unlock;
- wrong/abusive Instagram or Telegram handle;
- spam;
- ad/policy-risk content;
- other safety concern.

### 16.2 Report AI audit flow

Flow:

```text
Report submitted
  ↓
Turnstile/rate/risk checks
  ↓
OpenAI text moderation for report text
  ↓
Google Vision if evidence image exists
  ↓
Report weight + reporter trust + evidence quality + coordination risk
  ↓
AI triage recommendation
  ↓
State action
```

Actions:

- Low risk: case open, profile may remain active.
- Medium risk: ad_safe_state limited, case review.
- High risk: visibility_hold, ad_safe_state blocked, manual review.
- Critical: immediate suspension or visibility_hold + urgent manual review.

### 16.3 Second and third report rules

- Second report triggers stricter AI audit and lower risk thresholds.
- Third trusted unique report triggers automatic suspension or visibility hold and manual review.
- “Trusted unique” excludes coordinated, same-device/IP cluster, newly-created, or low-trust accounts.

### 16.4 False report protections

Every report has a weight. The system must consider:

- reporter age/account history;
- reporter verification status;
- previous report accuracy;
- previous false/overturned reports;
- evidence quality;
- text similarity to other reports;
- timing after rejection/decline/block;
- same IP/device/network cluster;
- coordinated report patterns.

False report categories:

```text
mistaken_report
low_quality_report
unsupported_claim
retaliatory_report
coordinated_report
fabricated_evidence
harassment_by_reporting
ban_evasion_attack
```

False report penalty ladder:

- trust score reduction;
- evidence-required reporting;
- report cooldown;
- warning;
- request/report limit reduction;
- temporary suspension;
- permanent ban review for fabricated evidence or coordinated abuse.

---

## 17. Appeal system

### 17.1 Appealable decisions

Appeals must be available for:

- account suspension;
- permanent ban;
- visibility hold;
- profile photo rejection;
- photo re-verification failure;
- Instagram verification rejection;
- Telegram verification rejection;
- channel re-verification failure;
- report decision;
- profile edit requirement;
- ad-policy visibility block.

### 17.2 Decision notice requirement

Every moderation decision that restricts a user must create a decision notice:

```text
Decision type
Reason category
Action taken
AI used? yes/no
Human reviewed? yes/no/pending
Appeal available? yes/no
Appeal deadline
User-visible explanation
```

### 17.3 Appeal workflow

```text
User receives decision notice
  ↓
User opens Safety Center
  ↓
User submits appeal
  ↓
AI intake/triage summary
  ↓
Case assigned to reviewer
  ↓
Human-supervised decision
  ↓
Outcome sent to user
  ↓
Decision/event logs updated
```

### 17.4 Appeal outcome options

- original decision upheld;
- original decision reversed;
- restriction reduced;
- temporary suspension shortened;
- permanent ban changed to temporary;
- verification approved;
- new verification required;
- profile edit required;
- insufficient evidence;
- duplicate/abusive appeal.

---

## 18. Moderation security: zero-trust model

### 18.1 Principle

Moderators do not browse users. Moderators review assigned cases.

### 18.2 Roles

Only three roles at launch:

```text
Owner
Admin
Moderator
```

No separate Super Admin role. Owner is the highest role.

Owner:

- final platform control;
- role changes;
- legal document publish;
- permanent ban confirmation;
- break-glass access;
- evidence download permission;
- ad-safe override.

Admin:

- daily operations;
- report/verification/appeal review;
- temporary suspension/visibility hold;
- limited ad-safe changes;
- cannot change Owner;
- cannot publish legal docs;
- cannot perform unrestricted evidence download.

Moderator:

- assigned case review only;
- no global user browsing;
- no raw handle access;
- no sensitive evidence download;
- no permanent action alone.

### 18.3 Evidence handling

Evidence must be:

- blurred by default;
- revealed only with reason;
- watermarked with moderator ID, case ID, timestamp;
- served through signed/proxy access;
- no direct public URL;
- no crawler access;
- no ads;
- reveal logged in `admin_access_events`.

### 18.4 Critical actions requiring extra confirmation

- permanent ban;
- ban evasion block;
- raw handle reveal;
- raw reference selfie reveal;
- evidence download;
- legal retention override;
- appeal rejection after permanent ban;
- manual ad-safe restore after serious report;
- role/permission upgrade.

---

## 19. Ads and ad safety

### 19.1 Ad rules

Ads must be:

- clearly labeled;
- separate from profile actions;
- never styled as request/accept/decline buttons;
- never inserted into private communication or handle unlock areas;
- never shown in admin/mod/evidence/safety-critical pages.

### 19.2 Ad render gate

Before any AdSense script loads, the backend/frontend must evaluate:

```text
canRenderAds({
  page_type,
  user_risk_score,
  traffic_risk_score,
  content_ad_safe_state,
  consent_state,
  profile_review_state,
  country_region,
})
```

False if:

- admin/mod/evidence page;
- verification page;
- report/appeal/suspension/ban page;
- private connection/handle detail;
- unreviewed UGC;
- reported profile not cleared;
- bot/risky traffic;
- missing required Google CMP consent where applicable;
- sexual/adult/policy-risk content.

### 19.3 Ad-safe states

`ad_safe_state` must exist on content/profile/media:

```text
pending_review
eligible
limited
blocked
```

Defaults:

- new profile: pending_review;
- new photo: pending_review;
- profile after report: limited or blocked;
- evidence/private: blocked forever;
- admin/mod: blocked forever.

---

## 20. Bot and abuse protection

### 20.1 Bot threat categories

- signup bots;
- scraping bots;
- mass request bots;
- report brigading bots;
- appeal/contact spam;
- credential/session abuse;
- invalid ad traffic;
- fake profile factories.

### 20.2 Controls

- Cloudflare WAF.
- Cloudflare Turnstile on sensitive forms.
- backend rate limits.
- trusted session scoring.
- risk events.
- non-sequential IDs.
- cursor-based feeds.
- no bulk profile API.
- request limits by trust score.
- report weight/trust system.
- suspicious traffic disables ads.
- admin/mod Cloudflare Access.

### 20.3 Internal scores

```text
bot_score
signup_abuse_score
scraping_score
request_spam_score
report_abuse_score
ad_traffic_risk_score
moderator_risk_score
```

These are not user-visible.

---

## 21. Legal and privacy system

### 21.1 Legal documents

Custom documents required:

1. Terms of Service.
2. Privacy Policy.
3. KVKK Aydınlatma Metni.
4. GDPR Privacy Notice.
5. Cookie & Ads Policy.
6. Community Guidelines.
7. Safety & Reporting Policy.
8. Moderation, Suspension, Ban & Appeal Policy.
9. Photo Verification & Reference Selfie Consent.
10. Data Retention & Deletion Policy.
11. Contact / Legal Notice Page.
12. DSA Notice-and-Action / Contact Point Page.

### 21.2 Legal version gate

After legal changes, users must accept/acknowledge required changes on next login before continuing.

Distinguish:

- acceptance = Terms;
- acknowledgment = Privacy/KVKK/GDPR notice;
- consent = optional or sensitive processing such as reusable selfie, personalized ads, analytics.

### 21.3 Consent event requirements

Every legal event must log:

- user ID;
- event type;
- document type;
- version;
- document hash;
- action;
- timestamp UTC;
- language;
- IP hash;
- user agent hash;
- device/session ID;
- source screen.

### 21.4 Contact structure

Public contact aliases:

```text
support@lite.dating
privacy@lite.dating
legal@lite.dating
safety@lite.dating
abuse@lite.dating
dsa@lite.dating
```

All can initially forward to the same inbox via Cloudflare Email Routing.

Legal identity:

```text
lite.dating is operated by Halit Turan ARICAN as an individual operator based in Türkiye.
```

No home address should be exposed in the public UI unless legally required and reviewed.

---

## 22. Media storage and access

### 22.1 R2 buckets

Use separate logical buckets or strict prefixes:

```text
public-approved-media
private-sensitive-media
```

Public-approved media:

- approved profile derivatives;
- compressed/resized images;
- no originals exposed;
- CDN cache allowed.

Private-sensitive media:

- reference selfie;
- verification selfie;
- report evidence;
- appeal evidence;
- moderation attachments.

Rules for private media:

- no public URL;
- no direct object listing;
- no caching except controlled short-lived proxy;
- signed/proxy access;
- reveal log;
- watermark for moderator views;
- no ads;
- no crawler;
- no sitemap.

---

## 23. API design outline

### 23.1 Auth

```text
POST /auth/email/start
POST /auth/email/verify
POST /auth/google
POST /auth/logout
POST /auth/logout-all
GET  /auth/session
GET  /auth/devices
DELETE /auth/devices/:id
```

### 23.2 Profile

```text
GET    /profiles/me
PATCH  /profiles/me
GET    /profiles/:id
GET    /discover
POST   /favorites/:profileId
DELETE /favorites/:profileId
```

### 23.3 Media

```text
POST /media/upload-url
POST /media/complete-upload
GET  /media/:id/signed-view
POST /media/:id/reveal-sensitive
DELETE /media/:id
```

### 23.4 Verification

```text
POST /verification/photo/start
POST /verification/photo/submit
POST /verification/reference-selfie/consent
DELETE /verification/reference-selfie/consent
POST /verification/channel/instagram/start
POST /verification/channel/instagram/submit
POST /verification/channel/telegram/start
POST /verification/channel/telegram/submit
```

### 23.5 Requests/connections

```text
POST /requests
GET  /requests/inbox
GET  /requests/sent
POST /requests/:id/accept
POST /requests/:id/decline
GET  /connections
POST /connections/:id/refresh
POST /connections/:id/block
```

### 23.6 Reports/appeals

```text
POST /reports
POST /reports/:id/evidence
GET  /safety/decisions
POST /appeals
GET  /appeals/:id
POST /appeals/:id/evidence
```

### 23.7 Admin/moderation

```text
GET  /admin/overview
GET  /admin/moderation-cases
GET  /admin/moderation-cases/:id
POST /admin/moderation-cases/:id/assign
POST /admin/moderation-cases/:id/decision
POST /admin/moderation-cases/:id/escalate
GET  /admin/audit-logs
GET  /admin/risk-signals
GET  /admin/ad-compliance
POST /admin/legal-documents
POST /admin/legal-documents/:id/publish
```

---

## 24. Design system principles

### 24.1 Visual tone

- soft but confident;
- romantic/social but not sexualized;
- colorful but controlled;
- not corporate SaaS;
- not cheap dating-app neon;
- trustworthy without being sterile.

### 24.2 Palette direction

Core colors:

```text
ink: near-black plum
muted text: warm gray-purple
pink: vivid warm pink
purple: saturated violet
blue/cyan: fresh trust blue
soft gradients: pink/purple/cyan
white/glass surfaces
```

### 24.3 Typography

- Host Grotesk as primary UI/logo vibe.
- Clean headings, rounded but serious.
- Avoid over-decorated fonts in functional surfaces.

### 24.4 UI motifs

- cards with generous radius;
- subtle glass surfaces;
- soft shadows;
- clear status badges;
- channel chips for Instagram/Telegram;
- verified badges;
- ad labels that are boring/clear, not playful;
- sensitive areas calmer and more utilitarian.

---

## 25. Implementation phases for Codex

### Phase 0 — Repository foundation

- Monorepo.
- Next.js app.
- NestJS API.
- NestJS worker.
- Prisma package.
- shared types.
- env validation.
- lint/typecheck.
- Docker/Railway configs.

### Phase 1 — Infrastructure integration

- Neon connection.
- Prisma schema initial models.
- Cloudflare R2 config.
- Resend email sending.
- Cloudflare Turnstile verification endpoint.
- Better Stack logger/monitoring hooks.

### Phase 2 — Auth/session

- Google Sign-In.
- email code sign-in.
- trusted sessions.
- logout all devices.
- step-up verification.

### Phase 3 — Profile/onboarding/media

- onboarding steps.
- profile create/edit.
- photo upload.
- R2 derivatives.
- Google Vision moderation job.
- photo states.

### Phase 4 — Channel verification

- Instagram verification flow.
- Telegram verification flow.
- channel state machine.
- handle encryption/hash.

### Phase 5 — Discovery/request/connections

- discovery feed.
- profile detail.
- send request.
- inbox/sent.
- accept/decline.
- mutual unlock.
- 14-day connection window.

### Phase 6 — Safety/reporting/moderation

- report flow.
- evidence upload.
- OpenAI text moderation.
- AI triage job.
- moderation cases.
- false-report scoring.
- admin/mod dashboards.

### Phase 7 — Appeals/legal/ad-safe

- decision notices.
- appeal flow.
- legal documents.
- legal version gate.
- consent events.
- adRenderGate.
- AdSense CMP integration.

### Phase 8 — Hardening and launch

- Cloudflare Access on admin/mod.
- private media proxy.
- audit logs.
- rate limits.
- security headers.
- QA tests.
- AdSense approval attempt.

---

## 26. Testing and acceptance criteria

### 26.1 General acceptance

- All protected routes require valid session.
- All admin/mod routes require Cloudflare Access and app role.
- No private media has public URL.
- No AdSense script on blocked/sensitive pages.
- Legal changes trigger next-login gate.
- Moderation actions create audit events.
- Appeals are linked to decisions.
- Permanent bans are appealable and logged.

### 26.2 Auth tests

- Email code cannot be reused.
- Email code expires.
- Invalid attempts rate-limit.
- New device requires verification.
- Trusted session works.
- Logout-all revokes sessions.

### 26.3 Media tests

- Public profile photos show only approved derivatives.
- Evidence requires signed/proxy access.
- Sensitive reveal logs event.
- Deleted media cannot be accessed.

### 26.4 Ad-safety tests

- Admin/mod/evidence pages never load ad scripts.
- Reported profiles disable ads until cleared.
- Missing CMP consent blocks personalized ads.
- Bot-risk traffic blocks ad rendering.

### 26.5 Moderation tests

- Moderator cannot browse arbitrary users.
- Moderator sees only assigned cases.
- Evidence reveal requires reason.
- Handle reveal requires elevated permission.
- Permanent ban cannot be issued by standard moderator.

---

## 27. Launch checklist

### Product

- Landing complete.
- How it works complete.
- Safety complete.
- Legal pages complete.
- Signup/onboarding complete.
- Discover/request/inbox/connections complete.
- Report/appeal complete.
- Admin/mod review minimum complete.

### Technical

- Railway deploy stable.
- Neon migrations applied.
- R2 buckets configured.
- Resend domain verified.
- Cloudflare DNS/WAF configured.
- Turnstile configured.
- Cloudflare Access configured.
- Better Stack monitors active.

### Legal/compliance

- Terms published.
- Privacy published.
- KVKK published.
- GDPR notice published.
- Cookie/Ads policy published.
- Safety/report policy published.
- Moderation/appeal policy published.
- Photo verification consent published.
- Data retention policy published.
- Google CMP configured.
- Consent/version logs working.

### Ads

- AdSense account/site setup.
- Google CMP active.
- Ad slots only on safe surfaces.
- adRenderGate tested.
- No ads in admin/mod/evidence/private/safety-critical surfaces.

---

## 28. Risk register

### Risk: AdSense approval/restriction

Mitigation:

- ad-safe states;
- no ads on sensitive/private pages;
- policy-safe public pages;
- clear ad labels;
- UGC moderation.

### Risk: false reports weaponized

Mitigation:

- reporter trust score;
- evidence quality score;
- retaliation detection;
- coordination detection;
- appeal reversal feedback loop.

### Risk: moderator misuse

Mitigation:

- case-based access;
- no browsing;
- sensitive reveal logs;
- watermarking;
- Cloudflare Access;
- audit logs.

### Risk: bot scraping

Mitigation:

- Turnstile;
- rate limits;
- cursor feed;
- signed media;
- no bulk API;
- suspicious traffic blocks ads.

### Risk: legal/compliance gap

Mitigation:

- versioned legal docs;
- consent events;
- appeal system;
- DSA contact;
- Prighter quote for EU representation.

### Risk: launch delay due to overengineering

Mitigation:

- no self-hosted AI;
- no KYC;
- managed moderation APIs;
- Railway/Neon managed infra;
- 3-role admin model;
- DB-backed jobs before advanced queues.

---

## 29. Final product mantra

> **Simple user experience. Serious safety architecture.**

> **No swiping. No in-app chat. No paywall. Verified handles unlock only by mutual consent.**

> **Ads fund the service, but ads never override user safety, privacy, or moderation integrity.**

