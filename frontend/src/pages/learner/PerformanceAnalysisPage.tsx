import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Download } from 'lucide-react';
import DashboardHeader from '../../components/ui/DashboardHeader';
import SectionPanel from '../../components/ui/SectionPanel';
import InfoField from '../../components/ui/InfoField';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

// ── Types ─────────────────────────────────────────────────────────────────────

type ScoreStatus = 'pass' | 'partial' | 'fail';
type QuestionType = 'MC' | 'T/F' | 'AI';
type ResultStatus = 'pass' | 'fail';
type ChipStatus = 'detected' | 'missed' | 'avoid';
type FeedbackTone = 'good' | 'warn' | 'bad';

interface ScoreEntry {
  label: string;
  score: number;
  max: number;
  status: ScoreStatus;
  highlight?: boolean;
}

interface InvQuestion {
  label: string;
  detail: string;
  type: QuestionType;
  result: ResultStatus;
  points: number;
}

interface NegOutcome {
  label: string;
  detail: string;
  result: ResultStatus;
  points: number;
}

interface ActionChip {
  label: string;
  status: ChipStatus;
}

interface Feedback {
  tone: FeedbackTone;
  text: string;
}

interface BcsmStage {
  num: number;
  status: ScoreStatus;
  title: string;
  subtitle: string;
  score: number;
  max: number;
  chips: ActionChip[];
  feedbacks: Feedback[];
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_REPORT: {
  learner: string;
  completed: string;
  duration: string;
  scenario: string;
  threat_actor: string;
  title: string;
  subtitle: string;
  scores: ScoreEntry[];
  verdict: { passed: boolean; title: string; description: string };
  investigation: InvQuestion[];
  invFeedback: string;
  negotiation: NegOutcome[];
  negFeedback: string;
  bcsm: BcsmStage[];
  bcsmBreakdown: { label: string; score: number; status: ScoreStatus }[];
} = {
  learner: 'Alex Yoo',
  completed: '01 May 2026 · 14:32 AEST',
  duration: '38 min',
  scenario: '#SCN-0042',
  threat_actor: 'ShadowCrypt',
  title: 'Operation BlackIce — Ransomware Negotiation',
  subtitle: 'Behavioral Change Stairway Model (BCSM) post-session evaluation',
  scores: [
    { label: 'Total Score', score: 80, max: 100, status: 'partial', highlight: true },
    { label: 'Investigation', score: 30, max: 40, status: 'pass' },
    { label: 'Negotiation', score: 10, max: 10, status: 'pass' },
    { label: 'BCSM', score: 40, max: 50, status: 'partial' },
  ],
  verdict: {
    passed: true,
    title: 'Passed — Competent Negotiator (80 / 100)',
    description:
      'Passed the 65-point threshold. Investigation and negotiation outcomes were strong. BCSM Stage 4 (Influence) needs attention — only 1 tactic category detected. Rapport and Behavioral Change also have room to grow.',
  },
  investigation: [
    { label: 'Q1 — How did the breach happen?', detail: 'Selected: Spear-phishing email with malicious attachment ✓', type: 'MC', result: 'pass', points: 10 },
    { label: 'Q2 — Which systems are affected?', detail: 'Selected: HR & Finance servers  ✗  (Correct: All domain controllers + file servers)', type: 'MC', result: 'fail', points: 0 },
    { label: 'Q3 — What data is at risk?', detail: 'Selected: PII, payment records, and trade secrets ✓', type: 'MC', result: 'pass', points: 10 },
    { label: 'Q4 — Requested encryption proof from threat actor', detail: 'Learner response: Yes — requested proof-of-decryption sample ✓', type: 'T/F', result: 'pass', points: 10 },
  ],
  invFeedback:
    '3 of 4 questions correct. Q2 was missed — the ransomware had propagated laterally across all domain controllers and file servers, not just HR & Finance. Review the network topology section of the scenario briefing before your next attempt.',
  negotiation: [
    { label: 'Ransom amount reduced', detail: 'Threat actor: $250,000 → $180,000', result: 'pass', points: 5 },
    { label: 'Payment deadline extended', detail: "Deadline extended: 24 hrs → 72 hrs upon learner's request", result: 'pass', points: 5 },
  ],
  negFeedback:
    "Both concessions obtained — this is the ideal outcome for this scenario. The ransom reduction and deadline extension provide your organisation's IR team with additional response capacity.",
  bcsm: [
    {
      num: 1, status: 'pass', title: 'Active Listening',
      subtitle: "Listen to their side and make them aware you're listening",
      score: 10, max: 10,
      chips: [
        { label: 'Open-ended questions', status: 'detected' },
        { label: 'Minimal encouragers', status: 'detected' },
        { label: 'Mirroring', status: 'detected' },
        { label: 'Paraphrasing', status: 'missed' },
      ],
      feedbacks: [
        { tone: 'good', text: '3 actions detected — full marks. Examples: "Tell me more about what your group is trying to achieve here." / "I see… I hear you." / Mirroring: echoing "irreversible encryption" back to the threat actor. Paraphrasing was the only unused technique.' },
      ],
    },
    {
      num: 2, status: 'pass', title: 'Empathy',
      subtitle: "Understand where they're coming from — situation, feelings, motives",
      score: 10, max: 10,
      chips: [
        { label: 'Understood motives', status: 'detected' },
        { label: 'Emotional labelling', status: 'detected' },
        { label: 'Situational understanding', status: 'missed' },
      ],
      feedbacks: [
        { tone: 'good', text: '2 actions detected — full marks. Emotional labelling example: "You seem frustrated that your previous deadline was not taken seriously." Motive acknowledgement: "I understand you need a guaranteed outcome here." Explicit reference to the threat actor\'s operational situation was not observed.' },
      ],
    },
    {
      num: 3, status: 'partial', title: 'Rapport',
      subtitle: 'Empathy is what you feel — rapport is when they feel it back',
      score: 5, max: 10,
      chips: [
        { label: 'Agreed where possible', status: 'detected' },
        { label: 'Reduced real/perceived differences', status: 'missed' },
        { label: 'Found common ground', status: 'missed' },
      ],
      feedbacks: [
        { tone: 'warn', text: '1 action detected — partial marks. You agreed to acknowledge their technical capabilities ("I recognise your team has clearly planned this carefully") without making concessions. To earn full marks, try reducing perceived differences: e.g., acknowledging a shared interest in resolving this without data publication, or finding common ground around a clean, quiet resolution.' },
      ],
    },
    {
      num: 4, status: 'fail', title: 'Influence',
      subtitle: 'Earned the right to recommend a course of action',
      score: 5, max: 10,
      chips: [
        { label: 'Rational persuasion', status: 'detected' },
        { label: 'Information exchange', status: 'detected' },
        { label: 'Being credible', status: 'missed' },
        { label: 'Exchanging (offer/reassurance)', status: 'missed' },
        { label: 'Legitimising', status: 'missed' },
        { label: 'Being kind', status: 'missed' },
        { label: 'Imposing a restriction', status: 'missed' },
      ],
      feedbacks: [
        { tone: 'bad', text: "2 actions detected but they fall within overlapping categories — scored as 1 distinct category (5 pts). Rational persuasion and information exchange were present but no credibility signals, regulatory references, or concrete offers were made. To improve: reference your organisation's legal obligations, make a structured payment proposal, or demonstrate expertise to increase perceived reliability." },
        { tone: 'warn', text: 'No avoidance violations detected. Intimidation tactic was not used — good.' },
      ],
    },
    {
      num: 5, status: 'pass', title: 'Behavioral Change',
      subtitle: 'What the threat actor does afterwards',
      score: 10, max: 10,
      chips: [
        { label: 'Threat actor reduced ransom', status: 'detected' },
        { label: 'Threat actor extended deadline', status: 'detected' },
        { label: 'All prior 4 stages fully effective', status: 'missed' },
      ],
      feedbacks: [
        { tone: 'warn', text: 'Both concessions achieved — the threat actor followed your guidance on ransom and deadline. However, Stage 4 (Influence) was not fully completed, so maximum score requires all prior stages to be effectively carried out. Strengthening your influence tactics in a future attempt will unlock full behavioral change credit.' },
        { tone: 'warn', text: 'No avoidance violations detected — you did not rush stages or skip ahead to premature problem-solving.' },
      ],
    },
  ],
  bcsmBreakdown: [
    { label: 'Listening', score: 10, status: 'pass' },
    { label: 'Empathy', score: 10, status: 'pass' },
    { label: 'Rapport', score: 5, status: 'partial' },
    { label: 'Influence', score: 5, status: 'fail' },
    { label: 'Beh. Change', score: 10, status: 'pass' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(status: ScoreStatus): string {
  if (status === 'pass') return 'text-green-600';
  if (status === 'partial') return 'text-amber-600';
  return 'text-red-600';
}

function barColor(status: ScoreStatus): string {
  if (status === 'pass') return 'bg-green-500';
  if (status === 'partial') return 'bg-amber-500';
  return 'bg-red-500';
}

function stageNumClass(status: ScoreStatus): string {
  if (status === 'pass') return 'bg-green-100 text-green-800';
  if (status === 'partial') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

function chipClass(status: ChipStatus): string {
  if (status === 'detected') return 'border-green-500 text-green-700 bg-green-50';
  if (status === 'avoid') return 'border-red-500 text-red-700 bg-red-50';
  return 'border-gray-200 text-gray-400 bg-white';
}

function chipPrefix(status: ChipStatus): string {
  if (status === 'detected') return '✓';
  if (status === 'avoid') return '✗';
  return '○';
}

function feedbackBorder(tone: FeedbackTone): string {
  if (tone === 'good') return 'border-l-4 border-green-500';
  if (tone === 'warn') return 'border-l-4 border-amber-500';
  return 'border-l-4 border-red-500';
}

function typeBadgeClass(type: QuestionType): string {
  if (type === 'MC') return 'bg-blue-100 text-blue-700';
  if (type === 'T/F') return 'bg-purple-100 text-purple-700';
  return 'bg-amber-100 text-amber-700';
}

function resultBadgeClass(result: ResultStatus): string {
  return result === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
}

function resultLabel(result: ResultStatus, points: number): string {
  return result === 'pass' ? `✓  +${points} pts` : '✗  +0 pts';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionToggleHeader({
  dotColor, title, pts, score, max, status, isOpen, onToggle,
}: {
  dotColor: string; title: string; pts: number; score: number; max: number;
  status: ScoreStatus; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className='w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors'
    >
      <div className='flex items-center gap-3'>
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
        <span className='text-sm font-semibold text-gray-900'>{title}</span>
        <span className='font-mono text-[10px] bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-500'>
          {pts} pts
        </span>
      </div>
      <div className='flex items-center gap-3'>
        <span className={`font-mono text-lg font-bold ${scoreColor(status)}`}>
          {score} / {max}
        </span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>
    </button>
  );
}

function FeedbackBox({ tone, text }: Feedback) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-gray-50 ${feedbackBorder(tone)}`}>
      <p className='text-xs text-gray-500 leading-relaxed'>{text}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PerformanceAnalysisPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState({ s1: true, s2: true, s3: true });
  const toggle = (key: keyof typeof open) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN, { replace: true }); };

  const { scores, verdict, investigation, negotiation, bcsm, bcsmBreakdown } = MOCK_REPORT;

  const handleDownloadReport = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 12mm; size: A4; }
        }
      `}</style>
      <div className='min-h-screen bg-gray-100'>
      <div className='print:hidden'>
        <DashboardHeader
          title='Performance Report'
          subtitle={MOCK_REPORT.title}
          onLogoClick={() => navigate(ROUTES.LEARNER.DASHBOARD)}
          onBack={() => navigate(ROUTES.LEARNER.PROGRESS)}
          onLogout={handleLogout}
        />
      </div>

      <main className='max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-4'>
        {/* Action Buttons */}
        <div className='flex flex-wrap gap-3 justify-end pt-1 print:hidden'>
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm text-white font-medium transition-colors cursor-pointer'
            onClick={handleDownloadReport}
          >
            <Download className='w-4 h-4' />
            Export PDF
          </button>
        </div>
        {/* Session Header */}
        <SectionPanel
          title=''
          header={
            <div className='bg-[#0d1b2e] px-7 py-6'>
              <p className='font-mono text-xs text-red-400 uppercase tracking-widest mb-1.5'>
                Session Report · Tactix AI
              </p>
              <p className='text-white text-xl font-bold mb-1'>
                {MOCK_REPORT.title}
              </p>
              <p className='text-slate-400 text-sm'>{MOCK_REPORT.subtitle}</p>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5'>
                <InfoField
                  label='Learner'
                  value={
                    <span className='text-slate-300 font-mono text-xs'>
                      {MOCK_REPORT.learner}
                    </span>
                  }
                />
                <InfoField
                  label='Completed'
                  value={
                    <span className='text-slate-300 font-mono text-xs'>
                      {MOCK_REPORT.completed}
                    </span>
                  }
                />
                <InfoField
                  label='Duration'
                  value={
                    <span className='text-slate-300 font-mono text-xs'>
                      {MOCK_REPORT.duration}
                    </span>
                  }
                />
                <InfoField
                  label='Scenario'
                  value={
                    <span className='text-slate-300 font-mono text-xs'>
                      {MOCK_REPORT.scenario}
                    </span>
                  }
                />
                <InfoField
                  label='Threat Actor'
                  value={
                    <span className='text-slate-300 font-mono text-xs'>
                      {MOCK_REPORT.threat_actor}
                    </span>
                  }
                />
              </div>
            </div>
          }
        >
          <></>
        </SectionPanel>

        {/* Score Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
          {scores.map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-xl border p-4 text-center shadow-sm ${s.highlight ? 'border-red-400' : 'border-gray-200'}`}
            >
              <p className='font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2'>
                {s.label}
              </p>
              <p
                className={`font-mono text-3xl font-bold leading-none ${scoreColor(s.status)}`}
              >
                {s.score}
              </p>
              <p className='text-xs text-gray-400 mt-1'>/ {s.max} pts</p>
              <div className='h-1 bg-gray-100 rounded-full mt-3 overflow-hidden'>
                <div
                  className={`h-full rounded-full ${barColor(s.status)}`}
                  style={{ width: `${(s.score / s.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Verdict Banner */}
        <div className='flex items-start gap-3 px-5 py-4 rounded-xl bg-green-50 border border-green-200'>
          <span className='text-2xl mt-0.5'>◎</span>
          <div>
            <p className='text-sm font-bold text-gray-900'>{verdict.title}</p>
            <p className='text-xs text-gray-500 mt-1 leading-relaxed'>
              {verdict.description}
            </p>
          </div>
        </div>

        {/* Section 1: Investigation Tasks */}
        <SectionPanel
          className='print:break-before-page'
          title=''
          header={
            <SectionToggleHeader
              dotColor='bg-red-500'
              title='Investigation Tasks'
              pts={40}
              score={30}
              max={40}
              status='pass'
              isOpen={open.s1}
              onToggle={() => toggle('s1')}
            />
          }
        >
          {open.s1 && (
            <div className='border-t border-gray-200 px-5 py-4 space-y-0'>
              <p className='font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-3'>
                Multiple choice — human input (10 pts each)
              </p>
              {investigation.slice(0, 3).map((q, i) => (
                <div
                  key={i}
                  className='grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 border-b border-gray-100'
                >
                  <div>
                    <p className='text-sm text-gray-900'>{q.label}</p>
                    <p className='font-mono text-xs text-gray-400 mt-0.5'>
                      {q.detail}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-1 rounded ${typeBadgeClass(q.type)}`}
                  >
                    {q.type}
                  </span>
                  <span
                    className={`font-mono text-xs px-3 py-1 rounded font-semibold whitespace-nowrap ${resultBadgeClass(q.result)}`}
                  >
                    {resultLabel(q.result, q.points)}
                  </span>
                </div>
              ))}
              <p className='font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-4 mb-3'>
                True / False — human input (10 pts)
              </p>
              {investigation.slice(3).map((q, i) => (
                <div
                  key={i}
                  className='grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3'
                >
                  <div>
                    <p className='text-sm text-gray-900'>{q.label}</p>
                    <p className='font-mono text-xs text-gray-400 mt-0.5'>
                      {q.detail}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-1 rounded ${typeBadgeClass(q.type)}`}
                  >
                    {q.type}
                  </span>
                  <span
                    className={`font-mono text-xs px-3 py-1 rounded font-semibold whitespace-nowrap ${resultBadgeClass(q.result)}`}
                  >
                    {resultLabel(q.result, q.points)}
                  </span>
                </div>
              ))}
              <div className='mt-4'>
                <FeedbackBox tone='warn' text={MOCK_REPORT.invFeedback} />
              </div>
            </div>
          )}
        </SectionPanel>

        {/* Section 2: Negotiation Outcomes */}
        <SectionPanel
          title=''
          header={
            <SectionToggleHeader
              dotColor='bg-amber-500'
              title='Negotiation Outcomes'
              pts={10}
              score={10}
              max={10}
              status='pass'
              isOpen={open.s2}
              onToggle={() => toggle('s2')}
            />
          }
        >
          {open.s2 && (
            <div className='border-t border-gray-200 px-5 py-4'>
              <p className='font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-3'>
                AI-evaluated outcomes (5 pts each)
              </p>
              {negotiation.map((o, i) => (
                <div
                  key={i}
                  className='grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 border-b border-gray-100 last:border-0'
                >
                  <div>
                    <p className='text-sm text-gray-900'>{o.label}</p>
                    <p className='font-mono text-xs text-gray-400 mt-0.5'>
                      {o.detail}
                    </p>
                  </div>
                  <span className='font-mono text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-700'>
                    AI
                  </span>
                  <span
                    className={`font-mono text-xs px-3 py-1 rounded font-semibold whitespace-nowrap ${resultBadgeClass(o.result)}`}
                  >
                    {resultLabel(o.result, o.points)}
                  </span>
                </div>
              ))}
              <div className='mt-4'>
                <FeedbackBox tone='good' text={MOCK_REPORT.negFeedback} />
              </div>
            </div>
          )}
        </SectionPanel>

        {/* Section 3: BCSM */}
        <SectionPanel
          className='print:break-before-page'
          title=''
          header={
            <SectionToggleHeader
              dotColor='bg-blue-500'
              title='BCSM — Behavioral Change Stairway Model'
              pts={50}
              score={37}
              max={50}
              status='partial'
              isOpen={open.s3}
              onToggle={() => toggle('s3')}
            />
          }
        >
          {open.s3 && (
            <div className='border-t border-gray-200 px-5 py-4 space-y-3'>
              <p className='font-mono text-[10px] text-gray-400 text-right'>
                5 pts = 1 action detected · 10 pts = 2 or more actions detected
              </p>

              {bcsm.map((stage) => (
                <div
                  key={stage.num}
                  className='border border-gray-200 rounded-xl p-4'
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${stageNumClass(stage.status)}`}
                      >
                        {stage.num}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>
                          {stage.title}
                        </p>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-base font-bold ${scoreColor(stage.status)}`}
                    >
                      {stage.score} / {stage.max}
                    </span>
                  </div>

                  <div className='flex flex-wrap gap-1.5 mb-3'>
                    {stage.chips.map((chip) => (
                      <span
                        key={chip.label}
                        className={`text-xs px-2.5 py-1 rounded-full border font-mono flex items-center gap-1 ${chipClass(chip.status)}`}
                      >
                        <span className='text-[10px]'>
                          {chipPrefix(chip.status)}
                        </span>
                        {chip.label}
                      </span>
                    ))}
                  </div>

                  <div className='space-y-2'>
                    {stage.feedbacks.map((fb, fi) => (
                      <FeedbackBox key={fi} tone={fb.tone} text={fb.text} />
                    ))}
                  </div>
                </div>
              ))}

              <div className='grid grid-cols-5 gap-2 mt-2 bg-gray-50 rounded-xl p-4 text-center'>
                {bcsmBreakdown.map((b) => (
                  <div key={b.label}>
                    <p className='font-mono text-[10px] text-gray-400 uppercase mb-1'>
                      {b.label}
                    </p>
                    <p
                      className={`font-mono text-base font-bold ${scoreColor(b.status)}`}
                    >
                      {b.score}
                    </p>
                  </div>
                ))}
              </div>

              <div className='flex items-center gap-2 pt-3 border-t border-gray-100'>
                <span className='text-gray-400 text-sm'>◈</span>
                <p className='font-mono text-[10px] text-gray-400'>
                  BCSM stages evaluated by AI Model 3 · Full conversation
                  transcript analysed
                </p>
              </div>
            </div>
          )}
        </SectionPanel>
      </main>
    </div>
    </>
  );
}
