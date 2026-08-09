import { useState, useEffect, useCallback } from "react";
import { loadRoster, saveRoster, loadStudentRaw, saveStudent, deleteStudent } from "./storage";
import { hashPassword, loadTeacherPasswordHash, saveTeacherPasswordHash } from "./auth";
import { extractPdfText, parseRosterText, buildProposedRoster } from "./rosterParser";
import { ITEM_BANK } from "./items";
import {
  CheckCircle2,
  XCircle,
  Flag,
  Lock,
  Unlock,
  ChevronRight,
  Users,
  GraduationCap,
  RotateCcw,
  Plus,
  Trash2,
  Loader2,
  Download,
  KeyRound,
  LogOut,
  FileUp,
  X,
  ArrowRightLeft,
} from "lucide-react";

// ===========================================================================
// COURSE / SECTION / UNIT / SEGMENT / TOPIC STRUCTURE
// ===========================================================================
const COURSES = {
  csa: { id: "csa", label: "AP Computer Science A", sections: ["1A", "3A", "4A", "1B"] },
  cs3: { id: "cs3", label: "Computer Science 3 (Data Structures)", sections: ["3B", "4B"] },
};

// Each unit has an ordered list of Segments (matching AP Classroom "Parts").
// Each Segment has an ordered list of Topics. Students auto-advance through
// tiers and topics within a Segment, then STOP and wait for a teacher unlock
// at every Segment boundary and every Unit boundary.
const UNITS = {
  csa: [
    {
      id: "u1",
      label: "Unit 1: Using Objects and Methods",
      segments: [
        { id: "u1sA", label: "Benchmark A (Topics 1.1-1.4)", topics: ["1.1", "1.2", "1.3", "1.4"] },
        { id: "u1sB", label: "Benchmark B (Topics 1.5-1.9)", topics: ["1.5", "1.6", "1.7", "1.8", "1.9"] },
        // Benchmark C (1.10-1.15) will be added here later.
      ],
    },
    // Units 2-4 will be added here later.
  ],
  cs3: [
    // No content yet.
  ],
};

const TOPIC_LABELS = {
  "1.1": "Intro to Algorithms & Compilers",
  "1.2": "Variables & Data Types",
  "1.3": "Expressions & Output",
  "1.4": "Assignment Statements & Input",
  "1.5": "Casting & Range of Variables",
  "1.6": "Compound Assignment Operators",
  "1.7": "API and Libraries",
  "1.8": "Documentation with Comments",
  "1.9": "Method Signatures",
};

const TIER_ORDER = ["basic", "intermediate", "complex"];
const DISPLAY_STAGES = ["basic", "intermediate", "complex", "mastered"];
const TIER_LABELS = { basic: "Basic", intermediate: "Intermediate", complex: "Complex", mastered: "Mastered" };
const TIER_COLORS = {
  basic: "bg-sky-100 text-sky-800 border-sky-300",
  intermediate: "bg-indigo-100 text-indigo-800 border-indigo-300",
  complex: "bg-violet-100 text-violet-800 border-violet-300",
  mastered: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

// ---------------------------------------------------------------------------
// Structure helpers
// ---------------------------------------------------------------------------
function getUnit(course, unitId) {
  return (UNITS[course] || []).find((u) => u.id === unitId) || null;
}
function getSegment(course, unitId, segmentId) {
  const u = getUnit(course, unitId);
  return u ? u.segments.find((s) => s.id === segmentId) || null : null;
}
function resolveNextTopic(course, unitId, segmentId, currentTopic) {
  const seg = getSegment(course, unitId, segmentId);
  if (!seg) return null;
  const idx = seg.topics.indexOf(currentTopic);
  if (idx >= 0 && idx + 1 < seg.topics.length) {
    return { unitId, segmentId, topic: seg.topics[idx + 1] };
  }
  return null;
}
// Where should a student go after finishing every topic in a Segment?
// Used both to preview (for messaging) and to actually apply an unlock.
function resolveNextSegmentOrUnit(course, unitId, segmentId) {
  const unit = getUnit(course, unitId);
  if (!unit) return null;
  const segIdx = unit.segments.findIndex((s) => s.id === segmentId);
  if (segIdx >= 0 && segIdx + 1 < unit.segments.length) {
    const nextSeg = unit.segments[segIdx + 1];
    return { unitId, segmentId: nextSeg.id, topic: nextSeg.topics[0] };
  }
  const units = UNITS[course] || [];
  const unitIdx = units.findIndex((u) => u.id === unitId);
  if (unitIdx >= 0 && unitIdx + 1 < units.length) {
    const nextUnit = units[unitIdx + 1];
    const nextSeg = nextUnit.segments[0];
    return { unitId: nextUnit.id, segmentId: nextSeg.id, topic: nextSeg.topics[0] };
  }
  return null; // nothing further configured yet
}

// ===========================================================================
// ITEM BANK -- currently CSA Unit 1 / Segment A (Topics 1.1-1.4) only.
// All items are original; none are reused from official AP Classroom
// Progress Check assessments, which remain reserved for actual quizzes.
// ===========================================================================
function itemsForTopicTier(course, topic, tier) {
  return ITEM_BANK.filter((it) => it.course === course && it.topic === topic && it.tier === tier);
}

// Returns an [unit, segment, topic, tier] index tuple for ordering students by
// how far along they are. Lower = earlier/less progress. Used to sort the
// Teacher dashboard roster.
function positionTuple(course, data) {
  if (!data || !data.unitId) return [-1, -1, -1, -1];
  const units = UNITS[course] || [];
  const unitIdx = units.findIndex((u) => u.id === data.unitId);
  const unit = units[unitIdx];
  const segmentIdx = unit ? unit.segments.findIndex((s) => s.id === data.segmentId) : -1;
  const segment = unit ? unit.segments[segmentIdx] : null;
  const topicIdx = segment ? segment.topics.indexOf(data.topic) : -1;
  const tierIdx = DISPLAY_STAGES.indexOf(data.tier);
  return [unitIdx, segmentIdx, topicIdx, tierIdx];
}
function compareTuples(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40) || "student";
}
// A roster entry is { name, idTag }. idTag (last 2 digits of a student ID,
// when known) guarantees a unique storage key even if two students share
// the same abbreviated name -- without it, they'd silently overwrite each
// other's saved progress. idTag itself is never shown to students.
function rosterSlug(entry) {
  return slugify(entry.idTag ? `${entry.name}_${entry.idTag}` : entry.name);
}
function sample(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function emptyStudent(displayName, course, idTag = null) {
  const firstUnit = (UNITS[course] || [])[0] || null;
  const firstSegment = firstUnit ? firstUnit.segments[0] : null;
  const firstTopic = firstSegment ? firstSegment.topics[0] : null;
  return {
    displayName,
    idTag,
    pin: generatePin(),
    unitId: firstUnit ? firstUnit.id : null,
    segmentId: firstSegment ? firstSegment.id : null,
    topic: firstTopic,
    tier: firstTopic ? TIER_ORDER[0] : null,
    misses: 0,
    flagged: false,
    locked: false,
    lockedAt: null,
    masteredTopics: [],
    history: [],
    createdAt: Date.now(),
  };
}

// Backfills a PIN for any student record created before PINs existed.
function ensurePin(data) {
  if (data && !data.pin) data.pin = generatePin();
  return data;
}

function accuracy(history) {
  if (!history || history.length === 0) return null;
  const correct = history.filter((h) => h.correct).length;
  return Math.round((correct / history.length) * 100);
}

// ---------------------------------------------------------------------------
// Storage helpers now live in ./storage.js (Firestore-backed) and are
// imported at the top of this file.
// ---------------------------------------------------------------------------

async function exportAllData() {
  const result = { exportedAt: new Date().toISOString(), courses: {} };
  for (const courseId of Object.keys(COURSES)) {
    result.courses[courseId] = {};
    for (const sectionId of COURSES[courseId].sections) {
      const roster = await loadRoster(courseId, sectionId);
      const students = {};
      for (const entry of roster) {
        const slug = rosterSlug(entry);
        const data = await loadStudentRaw(courseId, sectionId, slug);
        students[slug] = data || emptyStudent(entry.name, courseId, entry.idTag);
      }
      result.courses[courseId][sectionId] = { roster, students };
    }
  }
  return result;
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Visual pipeline pieces
// ---------------------------------------------------------------------------
function TopicRow({ course, unitId, segmentId, currentTopic, masteredTopics }) {
  const seg = getSegment(course, unitId, segmentId);
  if (!seg) return null;
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {seg.topics.map((t) => {
        const done = masteredTopics.includes(t);
        const active = t === currentTopic && !done;
        return (
          <div key={t} className={`flex-1 text-center py-1.5 rounded-md text-xs font-mono border ${
            done ? "bg-emerald-500 border-emerald-500 text-white"
              : active ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white border-slate-200 text-slate-400"
          }`}>
            {done ? <CheckCircle2 size={12} className="inline mb-0.5" /> : null} {t}
          </div>
        );
      })}
    </div>
  );
}

function TierTrack({ tier, flagged }) {
  const currentIdx = DISPLAY_STAGES.indexOf(tier);
  return (
    <div className="w-full">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${DISPLAY_STAGES.length}, 1fr)` }}>
        {DISPLAY_STAGES.map((s, i) => {
          const isMasteredStage = s === "mastered";
          const done = i < currentIdx;
          const active = i === currentIdx;
          const filled = done || (active && isMasteredStage); // reaching Mastered counts as "achieved", not "in progress"
          let circleStyle = "border-slate-300 bg-white text-slate-400";
          if (flagged && active && !isMasteredStage) circleStyle = "border-rose-500 bg-rose-100 text-rose-700";
          else if (filled) circleStyle = "border-emerald-500 bg-emerald-500 text-white";
          else if (active) circleStyle = "border-indigo-500 bg-indigo-500 text-white";
          return (
            <div key={s} className="flex items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i - 1 < currentIdx ? "bg-emerald-500" : "bg-slate-200"}`} />
              <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 font-mono text-xs ${circleStyle}`}>
                {flagged && active && !isMasteredStage ? <Flag size={14} /> : filled ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <div className={`h-0.5 flex-1 ${i === DISPLAY_STAGES.length - 1 ? "opacity-0" : i < currentIdx ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
          );
        })}
      </div>
      <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${DISPLAY_STAGES.length}, 1fr)` }}>
        {DISPLAY_STAGES.map((s) => (
          <div key={s} className="text-center font-mono text-[10px] text-slate-400 uppercase tracking-wide">{TIER_LABELS[s]}</div>
        ))}
      </div>
    </div>
  );
}

function MiniTierStrip({ tier }) {
  const idx = DISPLAY_STAGES.indexOf(tier);
  const short = { basic: "Basic", intermediate: "Interm", complex: "Complex", mastered: "Master" };
  return (
    <div className="inline-flex rounded-md border border-slate-200 overflow-hidden">
      {DISPLAY_STAGES.map((s, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <div
            key={s}
            title={TIER_LABELS[s]}
            className={`px-5 py-1 text-[10px] font-mono leading-none ${i > 0 ? "border-l border-slate-200" : ""} ${
              active ? "bg-indigo-600 text-white font-semibold"
                : past ? "bg-emerald-100 text-emerald-700"
                : "bg-white text-slate-300"
            }`}
          >
            {short[s]}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Course / Section selector (shared header control)
// ---------------------------------------------------------------------------
function CourseSectionBar({ course, section, onCourse, onSection }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <select value={course} onChange={(e) => onCourse(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs">
        {Object.values(COURSES).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select value={section} onChange={(e) => onSection(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs">
        {COURSES[course].sections.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Student practice view
// ---------------------------------------------------------------------------
function StudentView({ course, section, roster }) {
  const [selectedName, setSelectedName] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [round, setRound] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [checkingFlag, setCheckingFlag] = useState(false);
  const [stillFlagged, setStillFlagged] = useState(false);

  useEffect(() => { setSelectedName(""); setStudentData(null); setUnlocked(false); setPinInput(""); setPinError(false); setRound(null); setRoundResult(null); }, [course, section]);

  const selectStudent = useCallback(async (entry) => {
    setSelectedName(entry.name);
    setLoading(true);
    setUnlocked(false);
    setPinInput("");
    setPinError(false);
    setRound(null);
    setRoundResult(null);
    const slug = rosterSlug(entry);
    let data = await loadStudentRaw(course, section, slug);
    if (!data) { data = emptyStudent(entry.name, course, entry.idTag); await saveStudent(course, section, slug, data); }
    else if (!data.pin) { data = ensurePin(data); await saveStudent(course, section, slug, data); }
    setStudentData(data);
    setLoading(false);
  }, [course, section]);

  const submitPin = () => {
    if (pinInput === studentData.pin) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const switchStudent = () => {
    setSelectedName(""); setStudentData(null); setUnlocked(false); setPinInput(""); setPinError(false);
    setCheckingFlag(false); setStillFlagged(false);
  };

  const startRound = () => {
    const pool = itemsForTopicTier(course, studentData.topic, studentData.tier);
    const items = sample(pool, Math.min(3, pool.length));
    setRound({ items, index: 0, answers: [] });
    setSelectedChoice(null);
    setShowFeedback(false);
    setRoundResult(null);
  };

  const submitAnswer = () => { if (selectedChoice !== null) setShowFeedback(true); };

  const nextQuestion = async () => {
    const item = round.items[round.index];
    const correct = selectedChoice === item.answer;
    const newAnswers = [...round.answers, { itemId: item.id, topic: item.topic, tier: item.tier, correct, chosen: selectedChoice, timestamp: Date.now() }];

    if (round.index + 1 < round.items.length) {
      setRound({ ...round, index: round.index + 1, answers: newAnswers });
      setSelectedChoice(null);
      setShowFeedback(false);
      return;
    }

    const score = newAnswers.filter((a) => a.correct).length;
    const passed = score >= 2;
    let updated = { ...studentData, history: [...studentData.history, ...newAnswers] };
    let topicAdvancedTo = null;
    let segmentLocked = false;

    if (passed) {
      updated.misses = 0;
      const tierIdx = TIER_ORDER.indexOf(studentData.tier);
      if (tierIdx + 1 < TIER_ORDER.length) {
        updated.tier = TIER_ORDER[tierIdx + 1];
      } else {
        updated.masteredTopics = [...new Set([...updated.masteredTopics, studentData.topic])];
        const next = resolveNextTopic(course, studentData.unitId, studentData.segmentId, studentData.topic);
        if (next) {
          // Advance immediately -- the round-result screen below just
          // reports the move, rather than requiring a second click.
          updated.topic = next.topic;
          updated.tier = TIER_ORDER[0];
          topicAdvancedTo = next.topic;
        } else {
          // Last topic in the segment -- rest at "mastered" while locked,
          // waiting for Mr. Morgan to unlock the next Benchmark.
          updated.tier = "mastered";
          updated.locked = true;
          updated.lockedAt = { unitId: studentData.unitId, segmentId: studentData.segmentId };
          segmentLocked = true;
        }
      }
    } else {
      updated.misses = (studentData.misses || 0) + 1;
      if (updated.misses >= 2) updated.flagged = true;
    }

    setStudentData(updated);
    await saveStudent(course, section, rosterSlug({ name: updated.displayName, idTag: updated.idTag }), updated);
    setRoundResult({ score, passed, flagged: updated.flagged, topicAdvancedTo, segmentLocked, masteredTopic: studentData.topic });
    setRound(null);
  };

  const checkFlagStatus = async () => {
    setCheckingFlag(true);
    setStillFlagged(false);
    const fresh = await loadStudentRaw(course, section, rosterSlug({ name: studentData.displayName, idTag: studentData.idTag }));
    setCheckingFlag(false);
    if (fresh && !fresh.flagged) {
      setStudentData(fresh);
    } else {
      setStillFlagged(true);
    }
  };

  if (!selectedName) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="font-mono text-lg text-slate-700 mb-3">Who are you?</h2>
        {roster.length === 0 ? (
          <p className="text-slate-500 text-sm">No students on the roster for this section yet. Ask Mr. Morgan to add you from the Teacher tab.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {roster.map((entry) => (
              <button key={rosterSlug(entry)} onClick={() => selectStudent(entry)}
                className="text-left px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                {entry.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading || !studentData) {
    return <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200 text-center">
        <p className="text-slate-500 text-sm mb-1">Hi, {studentData.displayName}</p>
        <p className="font-mono text-xs text-slate-400 mb-4">Enter your 4-digit PIN</p>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          autoFocus
          className={`w-32 text-center text-2xl font-mono tracking-widest px-3 py-2 rounded-lg border ${pinError ? "border-rose-400 bg-rose-50" : "border-slate-300"} focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3`}
          placeholder="----"
        />
        <div>
          <button onClick={submitPin} disabled={pinInput.length !== 4}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            Unlock
          </button>
        </div>
        {pinError && <p className="text-rose-600 text-xs mt-3">That PIN doesn't match. Ask Mr. Morgan if you're not sure.</p>}
        <button onClick={switchStudent} className="mt-4 text-xs text-slate-400 hover:text-slate-600 font-mono">
          not {studentData.displayName}?
        </button>
      </div>
    );
  }

  if (!studentData.topic && !studentData.locked) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Your teacher hasn't added any practice content for {COURSES[course].label} yet.</p>
      </div>
    );
  }

  const unit = getUnit(course, studentData.unitId);
  const segment = getSegment(course, studentData.unitId, studentData.segmentId);
  const isFlagged = studentData.flagged;
  const isLocked = studentData.locked;
  const liveNext = isLocked ? resolveNextSegmentOrUnit(course, studentData.lockedAt.unitId, studentData.lockedAt.segmentId) : null;

  // While the "Topic mastered!" round-result is showing, keep the pipeline
  // displaying the just-finished topic (fully mastered) rather than jumping
  // ahead to the next topic's Basic tier -- that jump happens only once the
  // student clicks "Continue to Topic X.X".
  const showingMasteryResult = !!(roundResult && roundResult.topicAdvancedTo);
  const displayTopic = showingMasteryResult ? roundResult.masteredTopic : studentData.topic;
  const displayTier = showingMasteryResult ? "mastered" : studentData.tier;

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 font-mono">{unit ? unit.label : ""}{segment ? ` \u00b7 ${segment.label}` : ""}</p>
          <h2 className="text-xl font-semibold text-slate-800">{studentData.displayName}</h2>
        </div>
        <button onClick={switchStudent} title="Log out"
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <LogOut size={13} /> Logout
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
        <TopicRow course={course} unitId={studentData.unitId} segmentId={studentData.segmentId} currentTopic={displayTopic} masteredTopics={studentData.masteredTopics} />
        <TierTrack tier={displayTier} flagged={isFlagged} />
      </div>

      {isLocked && (
        <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
          <Lock className="mx-auto text-indigo-600 mb-2" size={28} />
          <p className="font-semibold text-indigo-800">{segment ? `${segment.label} complete!` : "Benchmark complete!"}</p>
          <p className="text-sm text-indigo-700 mt-1">
            {liveNext ? "Nice work -- waiting for Mr. Morgan to unlock the next Benchmark." : "You've finished everything currently available here. Great work -- check with Mr. Morgan about what's next."}
          </p>
        </div>
      )}

      {!isLocked && isFlagged && (
        <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-center mt-4">
          <Flag className="mx-auto text-rose-600 mb-2" size={28} />
          <p className="font-semibold text-rose-800">Flagged for small-group help</p>
          <p className="text-sm text-rose-700 mt-1">You've missed this tier twice in a row. Sit tight -- Mr. Morgan will pull you for a quick small-group session.</p>
          <button onClick={checkFlagStatus} disabled={checkingFlag}
            className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors inline-flex items-center gap-2">
            {checkingFlag ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />} Continue
          </button>
          {stillFlagged && <p className="text-rose-600 text-xs mt-3">Not yet -- Mr. Morgan hasn't cleared you for this tier.</p>}
        </div>
      )}

      {!isLocked && !isFlagged && !round && !roundResult && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-4 font-mono">
            Current tier: <span className={`px-2 py-0.5 rounded border ${TIER_COLORS[studentData.tier]}`}>{TIER_LABELS[studentData.tier]}</span>
          </p>
          <button onClick={startRound} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            Start <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!isLocked && !isFlagged && roundResult && (
        <div className={`p-6 rounded-xl border text-center ${roundResult.passed ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`font-semibold ${roundResult.passed ? "text-emerald-800" : "text-amber-800"}`}>{roundResult.score} / 3 correct</p>
          <p className={`text-sm mt-1 ${roundResult.passed ? "text-emerald-700" : "text-amber-700"}`}>
            {roundResult.segmentLocked ? "Benchmark complete! Waiting for Mr. Morgan to unlock the next Benchmark."
              : roundResult.topicAdvancedTo ? "Topic mastered!"
              : roundResult.passed ? "Great work -- advancing to the next tier."
              : "Not quite there yet -- let's try this tier again."}
          </p>
          {!roundResult.segmentLocked && (
            <button onClick={() => setRoundResult(null)} className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              {roundResult.topicAdvancedTo ? `Continue to Topic ${roundResult.topicAdvancedTo}` : "Continue"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {round && (
        <div className="p-6 rounded-xl bg-white border border-slate-200">
          <p className="text-xs font-mono text-slate-400 mb-3">
            Question {round.index + 1} of {round.items.length} &middot; Topic {round.items[round.index].topic} &middot; {TIER_LABELS[round.items[round.index].tier]}
          </p>
          <p className="text-slate-800 mb-4 whitespace-pre-wrap">{round.items[round.index].prompt}</p>
          <div className="flex flex-col gap-2 mb-4">
            {round.items[round.index].choices.map((choice, i) => {
              const isCorrect = i === round.items[round.index].answer;
              const isChosen = i === selectedChoice;
              let style = "border-slate-200 hover:border-indigo-300";
              if (showFeedback) {
                if (isCorrect) style = "border-emerald-400 bg-emerald-50";
                else if (isChosen) style = "border-rose-400 bg-rose-50";
              } else if (isChosen) style = "border-indigo-400 bg-indigo-50";
              return (
                <button key={i} disabled={showFeedback} onClick={() => setSelectedChoice(i)}
                  className={`text-left px-4 py-2.5 rounded-lg border ${style} transition-colors text-sm flex items-start gap-2`}>
                  {showFeedback && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
                  {showFeedback && isChosen && !isCorrect && <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />}
                  <span className="whitespace-pre-wrap">{choice}</span>
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
              {round.items[round.index].explanation}
            </div>
          )}
          {!showFeedback ? (
            <button onClick={submitAnswer} disabled={selectedChoice === null}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
              Check answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              {round.index + 1 < round.items.length ? "Next question" : "See tier result"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher dashboard
// ---------------------------------------------------------------------------
function TeacherView({ course, section, roster, onRosterChange, onLock }) {
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loadErrors, setLoadErrors] = useState([]);
  const [bulkMsg, setBulkMsg] = useState("");
  const [exporting, setExporting] = useState(false);
  const [pendingRows, setPendingRows] = useState(null); // review-before-commit rows from a parsed PDF
  const [parsingPdf, setParsingPdf] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [movingSlug, setMovingSlug] = useState(null);
  const [moveTarget, setMoveTarget] = useState("");

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const data = await exportAllData();
      downloadJson(data, `adaptive-practice-export-${new Date().toISOString().slice(0, 10)}.json`);
    } catch (e) {
      console.error("Export failed", e);
    }
    setExporting(false);
  };

  // Roster PDF upload: parsing happens entirely client-side (see
  // rosterParser.js). Full names/IDs are held only in pendingRows (React
  // state, in-memory only) for this review step -- nothing is written to
  // Firestore, logged, or persisted until "Add to roster" is clicked, and
  // pendingRows is cleared immediately after.
  const handleRosterFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset the input so the same file can be re-picked later
    if (!file) return;
    setUploadError("");
    setParsingPdf(true);
    try {
      const text = await extractPdfText(file);
      const rows = parseRosterText(text);
      if (rows.length === 0) {
        setUploadError("Couldn't find any names in that PDF. You can still add students manually below.");
      } else {
        const proposed = buildProposedRoster(rows);
        setPendingRows(proposed.map((row) => ({
          editedName: row.proposedName,
          idTag: row.idTag,
          include: true,
        })));
      }
    } catch (err) {
      setUploadError("Couldn't read that PDF. Make sure it's not a scanned image and try again.");
    }
    setParsingPdf(false);
  };

  const updatePendingRow = (index, patch) => {
    setPendingRows((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const cancelPendingRoster = () => {
    setPendingRows(null); // discards all parsed names/IDs immediately
    setUploadError("");
  };

  const confirmPendingRoster = async () => {
    const toAdd = pendingRows.filter((r) => r.include && r.editedName.trim());
    let updatedRoster = [...roster];
    for (const row of toAdd) {
      const entry = { name: row.editedName.trim(), idTag: row.idTag };
      const slug = rosterSlug(entry);
      if (updatedRoster.some((e) => rosterSlug(e) === slug)) continue; // skip exact duplicates
      updatedRoster.push(entry);
      const fresh = emptyStudent(entry.name, course, entry.idTag);
      await saveStudent(course, section, slug, fresh);
    }
    await saveRoster(course, section, updatedRoster);
    onRosterChange(updatedRoster);
    setPendingRows(null); // clear all parsed names/IDs from memory now that we're done
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    const entries = await Promise.all(
      roster.map(async (entry) => {
        const slug = rosterSlug(entry);
        let raw = await loadStudentRaw(course, section, slug);
        if (!raw) { raw = emptyStudent(entry.name, course, entry.idTag); await saveStudent(course, section, slug, raw); }
        else if (!raw.pin) { raw = ensurePin(raw); await saveStudent(course, section, slug, raw); }
        return [slug, raw];
      })
    );
    setStudents(Object.fromEntries(entries));
    setLoadErrors([]);
    setLoading(false);
  }, [roster, course, section]);

  useEffect(() => { refresh(); setBulkMsg(""); }, [refresh]);

  const addStudent = async () => {
    const name = newName.trim();
    if (!name) return;
    const entry = { name, idTag: null };
    if (roster.some((e) => rosterSlug(e) === rosterSlug(entry))) return;
    const updated = [...roster, entry];
    await saveRoster(course, section, updated);
    onRosterChange(updated);
    setNewName("");
  };

  const removeStudent = async (entry) => {
    const slug = rosterSlug(entry);
    const updated = roster.filter((e) => rosterSlug(e) !== slug);
    await saveRoster(course, section, updated);
    onRosterChange(updated);
    await deleteStudent(course, section, slug);
  };

  const clearFlag = async (entry) => {
    const slug = rosterSlug(entry);
    const data = await loadStudentRaw(course, section, slug);
    if (!data) return;
    const updated = { ...data, flagged: false, misses: 0 };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [slug]: updated }));
  };

  const unlockStudent = async (entry) => {
    const slug = rosterSlug(entry);
    const data = await loadStudentRaw(course, section, slug);
    if (!data || !data.locked) return;
    const next = resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId);
    if (!next) return; // nothing to unlock into yet
    const updated = { ...data, unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0], locked: false, lockedAt: null };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [slug]: updated }));
  };

  const unlockAllWaiting = async () => {
    let unlocked = 0, skipped = 0;
    for (const entry of roster) {
      const slug = rosterSlug(entry);
      const data = students[slug];
      if (!data || !data.locked) continue;
      const next = resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId);
      if (!next) { skipped++; continue; }
      const updated = { ...data, unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0], locked: false, lockedAt: null };
      await saveStudent(course, section, slug, updated);
      setStudents((s) => ({ ...s, [slug]: updated }));
      unlocked++;
    }
    setBulkMsg(unlocked === 0 && skipped === 0 ? "No students are currently waiting."
      : `Unlocked ${unlocked} student${unlocked === 1 ? "" : "s"}.` + (skipped > 0 ? ` ${skipped} waiting but no further content is configured yet.` : ""));
  };

  const resetStudent = async (entry) => {
    const slug = rosterSlug(entry);
    const fresh = emptyStudent(entry.name, course, entry.idTag);
    await saveStudent(course, section, slug, fresh);
    setStudents((s) => ({ ...s, [slug]: fresh }));
  };

  const regeneratePin = async (entry) => {
    const slug = rosterSlug(entry);
    const data = await loadStudentRaw(course, section, slug);
    if (!data) return;
    const updated = { ...data, pin: generatePin() };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [slug]: updated }));
  };

  const moveStudent = async (entry, targetSection) => {
    if (!targetSection || targetSection === section) return;
    const slug = rosterSlug(entry);
    const data = students[slug];
    if (!data) return;
    const targetRoster = await loadRoster(course, targetSection);
    if (targetRoster.some((e) => rosterSlug(e) === slug)) {
      window.alert(`A student with a matching name/ID already exists in ${targetSection}. Rename one of them first to avoid a conflict.`);
      return;
    }
    await saveStudent(course, targetSection, slug, data);
    await saveRoster(course, targetSection, [...targetRoster, entry]);
    const updatedSourceRoster = roster.filter((e) => rosterSlug(e) !== slug);
    await saveRoster(course, section, updatedSourceRoster);
    onRosterChange(updatedSourceRoster);
    await deleteStudent(course, section, slug);
    setStudents((s) => {
      const copy = { ...s };
      delete copy[slug];
      return copy;
    });
    setMovingSlug(null);
    setMoveTarget("");
  };

  const deleteAllStudents = async () => {
    if (roster.length === 0) return;
    const confirmed = window.confirm(
      `Delete all ${roster.length} student${roster.length === 1 ? "" : "s"} in ${COURSES[course].label} \u00b7 ${section}? This permanently erases their progress and cannot be undone.`
    );
    if (!confirmed) return;
    for (const entry of roster) {
      await deleteStudent(course, section, rosterSlug(entry));
    }
    await saveRoster(course, section, []);
    onRosterChange([]);
    setStudents({});
  };

  const anyWaiting = Object.values(students).some((d) => d && d.locked);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStudent()}
          placeholder="Add student (e.g. Jane D.)" className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <button onClick={addStudent} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 text-sm">
          <Plus size={16} /> Add
        </button>
        <label className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 cursor-pointer">
          {parsingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />} Upload roster PDF
          <input type="file" accept="application/pdf" onChange={handleRosterFile} disabled={parsingPdf} className="hidden" />
        </label>
        <button onClick={refresh} title="Refresh progress data" className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          <RotateCcw size={14} /> Refresh
        </button>
        <button onClick={unlockAllWaiting} disabled={!anyWaiting}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 text-sm">
          <Unlock size={14} /> Unlock waiting students
        </button>
        <button onClick={handleExportAll} disabled={exporting}
          className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export all data
        </button>
        <button onClick={onLock} title="Lock the Teacher tab"
          className="ml-auto px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          <Lock size={14} /> Lock
        </button>
        <button onClick={deleteAllStudents} disabled={roster.length === 0} title="Permanently delete every student in this section"
          className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 text-sm">
          <Trash2 size={14} /> Delete all students
        </button>
      </div>

      {uploadError && <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-mono">{uploadError}</div>}

      {pendingRows && (
        <div className="mb-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-indigo-900">Review before adding ({pendingRows.filter((r) => r.include).length} selected)</p>
            <button onClick={cancelPendingRoster} title="Discard without saving anything" className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-indigo-700 mb-3">Nothing is saved yet. Edit any name below, uncheck anyone you don't want to add, then confirm.</p>
          <div className="flex flex-col gap-1.5 mb-4 max-h-80 overflow-y-auto">
            {pendingRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
                <input type="checkbox" checked={row.include} onChange={(e) => updatePendingRow(i, { include: e.target.checked })} />
                <input value={row.editedName} onChange={(e) => updatePendingRow(i, { editedName: e.target.value })}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                {row.idTag && <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-400 font-mono shrink-0">{`ID ${row.idTag}`}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={confirmPendingRoster} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm">
              Add {pendingRows.filter((r) => r.include).length} student{pendingRows.filter((r) => r.include).length === 1 ? "" : "s"} to roster
            </button>
            <button onClick={cancelPendingRoster} className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {bulkMsg && <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">{bulkMsg}</div>}
      {loadErrors.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-mono">
          Couldn't load saved progress for: {loadErrors.join(", ")}. Try Refresh again.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading roster...</div>
      ) : roster.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-10 font-mono">No students in this section yet -- add one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...roster].sort((entryA, entryB) => {
            const a = students[rosterSlug(entryA)], b = students[rosterSlug(entryB)];
            if (!a || !b) return 0;
            const flagDiff = (a.flagged ? 0 : 1) - (b.flagged ? 0 : 1);
            if (flagDiff !== 0) return flagDiff;
            return compareTuples(positionTuple(course, a), positionTuple(course, b));
          }).map((entry) => {
            const slug = rosterSlug(entry);
            const data = students[slug];
            if (!data) return null;
            const acc = accuracy(data.history);
            const isOpen = expanded === slug;
            const unit = data.unitId ? getUnit(course, data.unitId) : null;
            const segment = data.unitId && data.segmentId ? getSegment(course, data.unitId, data.segmentId) : null;
            const lockedNext = data.locked ? resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId) : null;
            return (
              <div key={slug} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between p-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-slate-800">{data.displayName}</span>
                      {entry.idTag && (
                        <span title="Last 2 digits of student ID -- for your own disambiguation only, never shown to students" className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-400 font-mono">
                          {`ID ${entry.idTag}`}
                        </span>
                      )}
                      {data.locked ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-indigo-300 bg-indigo-100 text-indigo-700 inline-flex items-center gap-1">
                            <Lock size={10} /> Waiting to unlock
                          </span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : data.topic ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-600 font-mono">{unit ? unit.id : ""}{segment ? ` \u00b7 ${segment.label}` : ""}</span>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-600 font-mono">Topic {data.topic}</span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-500 font-mono">No content yet</span>
                      )}
                      {data.flagged && (
                        <span className="text-xs px-2 py-0.5 rounded border border-rose-300 bg-rose-100 text-rose-700 inline-flex items-center gap-1">
                          <Flag size={10} /> flagged
                        </span>
                      )}
                    </div>
                    {(acc !== null || data.masteredTopics.length > 0) && (
                      <p className="text-xs text-slate-400">
                        {acc !== null ? `${acc}% overall accuracy` : ""}
                        {data.masteredTopics.length > 0 ? `${acc !== null ? " \u00b7 " : ""}mastered: ${data.masteredTopics.join(", ")}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => regeneratePin(entry)} title="Click to generate a new PIN"
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 font-mono text-slate-500">
                      <KeyRound size={12} /> {data.pin || "----"}
                    </button>
                    {data.flagged && (
                      <button onClick={() => clearFlag(entry)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                        Clear flag
                      </button>
                    )}
                    {data.locked && (
                      <button onClick={() => unlockStudent(entry)} disabled={!lockedNext} title={!lockedNext ? "No further content configured yet" : ""}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                        <Unlock size={12} /> Unlock
                      </button>
                    )}
                    <button onClick={() => { setMovingSlug(movingSlug === slug ? null : slug); setMoveTarget(""); }} title="Move to another section"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400">
                      <ArrowRightLeft size={14} />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : slug)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      {isOpen ? "Hide" : "History"}
                    </button>
                    <button onClick={() => resetStudent(entry)} title="Reset progress" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => removeStudent(entry)} title="Remove student" className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors text-slate-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {movingSlug === slug && (
                  <div className="border-t border-slate-100 bg-slate-50 p-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500">Move to:</span>
                    <select value={moveTarget} onChange={(e) => setMoveTarget(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-mono">
                      <option value="">Choose section...</option>
                      {COURSES[course].sections.filter((s) => s !== section).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={() => moveStudent(entry, moveTarget)} disabled={!moveTarget}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Move
                    </button>
                    <button onClick={() => { setMovingSlug(null); setMoveTarget(""); }} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white transition-colors text-slate-500">
                      Cancel
                    </button>
                  </div>
                )}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    {data.history.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono">No attempts yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {data.history.slice().reverse().map((h, i) => {
                          const item = ITEM_BANK.find((it) => it.id === h.itemId);
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              {h.correct ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <XCircle size={14} className="text-rose-500 shrink-0" />}
                              <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-mono text-slate-500">{h.topic}</span>
                              <span className={`px-1.5 py-0.5 rounded border font-mono ${TIER_COLORS[h.tier]}`}>{TIER_LABELS[h.tier]}</span>
                              <span className="text-slate-500 truncate">{item ? item.prompt.split("\n")[0] : h.itemId}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher password gate -- separate from student PINs, since this guards
// roster management, unlocking, and data export. First-ever visit lets you
// set the password; every visit after that requires it.
// ---------------------------------------------------------------------------
function TeacherGate({ onUnlock }) {
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadTeacherPasswordHash().then((hash) => { setHasPassword(!!hash); setLoading(false); });
  }, []);

  const handleSetup = async () => {
    if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== confirmPw) { setError("Passwords don't match."); return; }
    setBusy(true);
    await saveTeacherPasswordHash(await hashPassword(pw));
    setBusy(false);
    onUnlock();
  };

  const handleLogin = async () => {
    setBusy(true);
    const [inputHash, storedHash] = await Promise.all([hashPassword(pw), loadTeacherPasswordHash()]);
    setBusy(false);
    if (inputHash === storedHash) onUnlock();
    else { setError("Incorrect password."); setPw(""); }
  };

  if (loading) {
    return <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200">
      {hasPassword ? (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-1">Teacher access</p>
          <p className="text-xs text-slate-400 mb-4 font-mono">Enter the teacher password</p>
          <input type="password" value={pw} autoFocus
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
            placeholder="Password" />
          <button onClick={handleLogin} disabled={busy || !pw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            {busy ? "Checking..." : "Unlock"}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-1">Set up teacher access</p>
          <p className="text-xs text-slate-400 mb-4 font-mono">No password is set yet. Create one now (8+ characters) -- you'll enter this every time you open the Teacher tab.</p>
          <input type="password" value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-2"
            placeholder="New password" />
          <input type="password" value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSetup()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
            placeholder="Confirm password" />
          <button onClick={handleSetup} disabled={busy || !pw || !confirmPw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            {busy ? "Saving..." : "Set password"}
          </button>
        </>
      )}
      {error && <p className="text-rose-600 text-xs mt-3 text-center">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------
export default function App() {
  const [mode, setMode] = useState("student");
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [course, setCourse] = useState("csa");
  const [section, setSection] = useState(COURSES.csa.sections[0]);
  const [roster, setRoster] = useState([]);
  const [rosterLoaded, setRosterLoaded] = useState(false);

  const changeCourse = (newCourse) => {
    setCourse(newCourse);
    setSection(COURSES[newCourse].sections[0]);
  };

  useEffect(() => {
    setRosterLoaded(false);
    loadRoster(course, section).then((r) => {
      // Migrate any old plain-string roster entries (from before idTag existed).
      const normalized = r.map((e) => (typeof e === "string" ? { name: e, idTag: null } : e));
      setRoster(normalized);
      setRosterLoaded(true);
    });
  }, [course, section]);

  return (
    <div className="min-h-screen bg-slate-50" style={{ backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <p className="font-mono text-[11px] text-slate-400 tracking-widest uppercase">Adaptive Practice</p>
            <h1 className="font-mono text-lg font-semibold text-slate-800">{COURSES[course].label} &middot; {section}</h1>
          </div>
          <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1">
            <button onClick={() => setMode("student")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "student" ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <GraduationCap size={15} /> Student
            </button>
            <button onClick={() => setMode("teacher")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "teacher" ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <Users size={15} /> Teacher
            </button>
          </div>
        </div>

        <div className="mb-6">
          <CourseSectionBar course={course} section={section} onCourse={changeCourse} onSection={setSection} />
        </div>

        {!rosterLoaded ? (
          <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>
        ) : mode === "student" ? (
          <StudentView course={course} section={section} roster={roster} />
        ) : !teacherAuthed ? (
          <TeacherGate onUnlock={() => setTeacherAuthed(true)} />
        ) : (
          <TeacherView course={course} section={section} roster={roster} onRosterChange={setRoster} onLock={() => setTeacherAuthed(false)} />
        )}
      </div>
    </div>
  );
}
