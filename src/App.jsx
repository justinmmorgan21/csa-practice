import { useState, useEffect, useCallback } from "react";
import { loadRoster, saveRoster, loadStudentRaw, saveStudent, deleteStudent } from "./storage";
import { hashPassword, loadTeacherPasswordHash, saveTeacherPasswordHash } from "./auth";
import { extractPdfText, parseRosterText, buildProposedRoster } from "./rosterParser";
import { getReview } from "./reviews";
import { loadAllContent, saveSegmentItems } from "./contentStore";
import { STATIC_ITEM_BANK } from "./items/index";
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
  Target,
  BookOpen,
  Pencil,
  Wrench,
  Sun,
  Moon,
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
        { id: "u1sC", label: "Benchmark C (Topics 1.10-1.15)", topics: ["1.10", "1.11", "1.12", "1.13", "1.14", "1.15"] },
      ],
    },
    {
      id: "u2",
      label: "Unit 2: Selection and Iteration",
      segments: [
        { id: "u2sA", label: "Benchmark A (Topics 2.1-2.6)", topics: ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
        { id: "u2sB", label: "Benchmark B (Topics 2.7-2.12)", topics: ["2.7", "2.8", "2.9", "2.10", "2.11", "2.12"] },
      ],
    },
    {
      id: "u3",
      label: "Unit 3: Class Creation",
      segments: [
        { id: "u3sA", label: "Benchmark A (Topics 3.1-3.4)", topics: ["3.1", "3.2", "3.3", "3.4"] },
        { id: "u3sB", label: "Benchmark B (Topics 3.5-3.9)", topics: ["3.5", "3.6", "3.7", "3.8", "3.9"] },
      ],
    },
    {
      id: "u4",
      label: "Unit 4: Data Collections",
      segments: [
        { id: "u4sA", label: "Benchmark A (Topics 4.1-4.5)", topics: ["4.1", "4.2", "4.3", "4.4", "4.5"] },
        { id: "u4sB", label: "Benchmark B (Topics 4.6-4.10)", topics: ["4.6", "4.7", "4.8", "4.9", "4.10"] },
        { id: "u4sC", label: "Benchmark C (Topics 4.11-4.17)", topics: ["4.11", "4.12", "4.13", "4.14", "4.15", "4.16", "4.17"] },
      ],
    },
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
  "1.10": "Calling Class Methods",
  "1.11": "Math Class",
  "1.12": "Objects: Instances of Classes",
  "1.13": "Object Creation and Instantiation",
  "1.14": "Calling Instance Methods",
  "1.15": "String Manipulation",
  "2.1": "Algorithms with Selection and Repetition",
  "2.2": "Boolean Expressions",
  "2.3": "if Statements",
  "2.4": "Nested if Statements",
  "2.5": "Compound Boolean Expressions",
  "2.6": "Comparing Boolean Expressions",
  "2.7": "while Loops",
  "2.8": "for Loops",
  "2.9": "Implementing Selection & Iteration Algorithms",
  "2.10": "Implementing String Algorithms",
  "2.11": "Nested Iteration",
  "2.12": "Informal Run-Time Analysis",
  "3.1": "Abstraction and Program Design",
  "3.2": "Impact of Program Design",
  "3.3": "Anatomy of a Class",
  "3.4": "Constructors",
  "3.5": "Methods: How to Write Them",
  "3.6": "Methods: Passing and Returning References of an Object",
  "3.7": "Class Variables and Methods",
  "3.8": "Scope and Access",
  "3.9": "this Keyword",
  "4.1": "Ethical and Social Issues Around Data Collection",
  "4.2": "Introduction to Using Data Sets",
  "4.3": "Array Creation and Access",
  "4.4": "Array Traversals",
  "4.5": "Implementing Array Algorithms",
  "4.6": "Using Text Files",
  "4.7": "Wrapper Classes",
  "4.8": "ArrayList Methods",
  "4.9": "ArrayList Traversals",
  "4.10": "Implementing ArrayList Algorithms",
  "4.11": "2D Array Creation and Access",
  "4.12": "2D Array Traversals",
  "4.13": "Implementing 2D Array Algorithms",
  "4.14": "Searching Algorithms",
  "4.15": "Sorting Algorithms",
  "4.16": "Recursion",
  "4.17": "Recursive Searching and Sorting",
};

const TIER_ORDER = ["basic", "intermediate", "complex"];
const ROUND_SIZE = 4; // questions asked per round
const PASS_THRESHOLD = 3; // correct answers needed to pass a round
const DISPLAY_STAGES = ["basic", "intermediate", "complex", "mastered"];
const TIER_LABELS = { basic: "Basic", intermediate: "Intermediate", complex: "Complex", mastered: "Mastered" };
const TIER_COLORS = {
  basic: "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700",
  intermediate: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
  complex: "bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-300 border-violet-300 dark:border-violet-700",
  mastered: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
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

// Finds which unit/segment a given topic belongs to, for a course. Used by
// the content editor to know which Firestore segment-document to write back
// to when an item is edited, added, or deleted.
function findSegmentForTopic(course, topic) {
  for (const unit of UNITS[course] || []) {
    for (const seg of unit.segments) {
      if (seg.topics.includes(topic)) return { unitId: unit.id, segmentId: seg.id, topics: seg.topics };
    }
  }
  return null;
}

// ===========================================================================
// ITEM BANK -- currently CSA Unit 1 / Segment A (Topics 1.1-1.4) only.
// All items are original; none are reused from official AP Classroom
// Progress Check assessments, which remain reserved for actual quizzes.
// ===========================================================================
function itemsForTopicTier(itemBank, course, topic, tier) {
  return itemBank.filter((it) => it.course === course && it.topic === topic && it.tier === tier);
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

// Whichever of two {unitId, segmentId, topic, tier} positions is further
// along, per positionTuple's ordering. Used to maintain a "farthest reached"
// high-water mark that only ever moves forward, regardless of how a
// student's actual current position gets set (advancing through a round,
// a teacher's manual placement, a segment unlock, or the student's own
// self-service move-back/move-forward).
function laterPosition(course, a, b) {
  if (!a) return b;
  if (!b) return a;
  return compareTuples(positionTuple(course, a), positionTuple(course, b)) >= 0 ? a : b;
}

// A student record's high-water mark, falling back to their current position
// for any record saved before the "farthest reached" field existed -- for
// those, the farthest they've ever reached IS simply wherever they currently
// are, since the move-back/move-forward feature didn't exist yet to let that
// drift apart from their live position.
function getFarthest(data) {
  return data.farthest || { unitId: data.unitId, segmentId: data.segmentId, topic: data.topic, tier: data.tier };
}

// Every real, selectable practice position across a course's whole
// curriculum (excluding the synthetic "mastered" stage, which isn't
// something a student practices at), in curriculum order. Used to build the
// student self-service "move back" / "move forward" pickers.
function allPositions(course) {
  const out = [];
  for (const unit of UNITS[course] || []) {
    for (const seg of unit.segments) {
      for (const topic of seg.topics) {
        for (const tier of TIER_ORDER) {
          out.push({ unitId: unit.id, segmentId: seg.id, topic, tier, unitLabel: unit.label, segmentLabel: seg.label });
        }
      }
    }
  }
  return out;
}

// Does a {unitId, segmentId, topic} position actually belong to the given
// course's curriculum? Used to tell whether a stored position is stale for
// whichever curriculum is currently active -- e.g. a CS3 student's saved
// position might belong to their "AP CS A review" bookmark rather than
// CS3's own (currently empty) content, or vice versa.
function positionBelongsTo(course, data) {
  return !!(data && data.topic && getSegment(course, data.unitId, data.segmentId)?.topics.includes(data.topic));
}

// Extracts a sortable last initial from a name like "Jane A." -> "A".
// Falls back gracefully for names that don't follow that convention.
function lastInitial(name) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1] || "";
  return last.replace(/[^A-Za-z]/g, "").toUpperCase();
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
    resumePoint: null, // set by a teacher's "return to where they left off" override
    inProgressRound: null, // {topic, tier, itemIds, answers} -- lets a student resume mid-round
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
              : active ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
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
          let circleStyle = "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500";
          if (flagged && active && !isMasteredStage) circleStyle = "border-rose-500 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300";
          else if (filled) circleStyle = "border-emerald-500 bg-emerald-500 text-white";
          else if (active) circleStyle = "border-indigo-500 bg-indigo-500 text-white";
          return (
            <div key={s} className="flex items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i - 1 < currentIdx ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 font-mono text-xs ${circleStyle}`}>
                {flagged && active && !isMasteredStage ? <Flag size={14} /> : filled ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <div className={`h-0.5 flex-1 ${i === DISPLAY_STAGES.length - 1 ? "opacity-0" : i < currentIdx ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            </div>
          );
        })}
      </div>
      <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${DISPLAY_STAGES.length}, 1fr)` }}>
        {DISPLAY_STAGES.map((s) => (
          <div key={s} className="text-center font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">{TIER_LABELS[s]}</div>
        ))}
      </div>
    </div>
  );
}

function MiniTierStrip({ tier }) {
  const idx = DISPLAY_STAGES.indexOf(tier);
  const short = { basic: "Basic", intermediate: "Interm", complex: "Complex", mastered: "Master" };
  return (
    <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
      {DISPLAY_STAGES.map((s, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <div
            key={s}
            title={TIER_LABELS[s]}
            className={`px-5 py-1 text-[10px] font-mono leading-none ${i > 0 ? "border-l border-slate-200 dark:border-slate-700" : ""} ${
              active ? "bg-indigo-600 dark:bg-indigo-500 text-white font-semibold"
                : past ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                : "bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600"
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
function CourseSectionBar({ course, section, onCourse, onSection, studentCount }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <select value={course} onChange={(e) => onCourse(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs">
        {Object.values(COURSES).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select value={section} onChange={(e) => onSection(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs">
        {COURSES[course].sections.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      {studentCount !== undefined && (
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{studentCount} student{studentCount === 1 ? "" : "s"}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Student practice view
// ---------------------------------------------------------------------------
function StudentView({ course, section, roster, itemBank, reviewItemBank }) {
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
  const [showReview, setShowReview] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveDirection, setMoveDirection] = useState("back"); // "back" or "forward"
  const [moveChoice, setMoveChoice] = useState("");

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

    // Resume an interrupted round, if one exists and still looks valid --
    // matches the student's current topic/tier (hasn't been manually moved
    // since), and every sampled question still exists in the item bank
    // (hasn't been deleted via the Content Editor since).
    if (data.inProgressRound) {
      const ip = data.inProgressRound;
      // A CS3 student's in-progress round could belong to their "AP CS A
      // review" mode (drawing from reviewItemBank) rather than their native
      // course's own bank -- check the bank that was actually active.
      const activeBank = (course === "cs3" && data.reviewMode === "csa") ? reviewItemBank : itemBank;
      const stillValid = ip.topic === data.topic && ip.tier === data.tier &&
        ip.itemIds.every((id) => activeBank.some((it) => it.id === id));
      if (stillValid) {
        const items = ip.itemIds.map((id) => activeBank.find((it) => it.id === id));
        setRound({ items, index: ip.answers.length, answers: ip.answers });
      } else {
        data = { ...data, inProgressRound: null };
        await saveStudent(course, section, slug, data);
      }
    }

    setStudentData(data);
    setLoading(false);
  }, [course, section, itemBank, reviewItemBank]);

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
    setCheckingFlag(false); setStillFlagged(false); setShowReview(false);
    setShowMoveModal(false); setMoveDirection("back"); setMoveChoice("");
  };

  // CS3 has no content of its own yet -- for now it's used as an AP CS A
  // review tool instead. A CS3 student picks a mode (once, at first login;
  // switchable later via the header) and everything content-related
  // (curriculum, item bank, navigation) follows that choice instead of their
  // native "cs3" course, while their roster identity/PIN/storage stay under
  // course="cs3" the whole time -- see effectiveCourse/effectiveItemBank below.
  const chooseReviewMode = async (mode) => {
    let updated = { ...studentData, reviewMode: mode };
    if (mode === "csa" && !positionBelongsTo("csa", studentData)) {
      // First time choosing review mode (or their old review position no
      // longer resolves) -- start at the very beginning, but immediately
      // open every topic/tier up for free navigation via the Move picker,
      // since this is a review tool, not a gated first-time course.
      const firstUnit = UNITS.csa[0];
      const firstSegment = firstUnit.segments[0];
      const firstTopic = firstSegment.topics[0];
      const last = allPositions("csa")[allPositions("csa").length - 1];
      updated = {
        ...updated,
        unitId: firstUnit.id, segmentId: firstSegment.id, topic: firstTopic, tier: TIER_ORDER[0],
        farthest: last, locked: false, lockedAt: null, flagged: false, misses: 0, resumePoint: null, inProgressRound: null,
      };
    }
    setStudentData(updated);
    setRound(null);
    setRoundResult(null);
    setShowReview(false);
    await saveStudent(course, section, rosterSlug({ name: updated.displayName, idTag: updated.idTag }), updated);
  };

  // Self-service navigation: a student can move BACK to any earlier topic/tier
  // they want (no restriction -- they just continue forward normally from
  // there, unlike a teacher's optional "one pass then jump right back" detour).
  // They can move FORWARD only up to the farthest they've actually earned by
  // passing rounds, so this can never be used to skip ahead of real progress.
  const applyStudentMove = async (newPos) => {
    const updated = {
      ...studentData, unitId: newPos.unitId, segmentId: newPos.segmentId, topic: newPos.topic, tier: newPos.tier,
      locked: false, lockedAt: null, flagged: false, misses: 0, resumePoint: null, inProgressRound: null,
    };
    updated.farthest = laterPosition(effectiveCourse, getFarthest(studentData), newPos);
    setStudentData(updated);
    setRound(null);
    setRoundResult(null);
    setShowReview(false);
    await saveStudent(course, section, rosterSlug({ name: updated.displayName, idTag: updated.idTag }), updated);
    setShowMoveModal(false);
    setMoveChoice("");
  };

  const startRound = () => {
    const pool = itemsForTopicTier(effectiveItemBank, effectiveCourse, studentData.topic, studentData.tier);
    const items = sample(pool, Math.min(ROUND_SIZE, pool.length));
    setRound({ items, index: 0, answers: [] });
    setSelectedChoice(null);
    setShowFeedback(false);
    setRoundResult(null);
    setShowReview(false);
    // Persist immediately so this round can be resumed if the student
    // disconnects (closes the tab, loses wifi, etc.) before finishing it.
    const updated = { ...studentData, inProgressRound: { topic: studentData.topic, tier: studentData.tier, itemIds: items.map((i) => i.id), answers: [] } };
    setStudentData(updated);
    saveStudent(course, section, rosterSlug({ name: updated.displayName, idTag: updated.idTag }), updated);
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
      // Save progress so far -- if the student stops here, they'll resume
      // right where they left off instead of losing these answers.
      const midUpdate = { ...studentData, inProgressRound: { ...studentData.inProgressRound, answers: newAnswers } };
      setStudentData(midUpdate);
      await saveStudent(course, section, rosterSlug({ name: midUpdate.displayName, idTag: midUpdate.idTag }), midUpdate);
      return;
    }

    const score = newAnswers.filter((a) => a.correct).length;
    const passed = score >= PASS_THRESHOLD;
    let updated = { ...studentData, history: [...studentData.history, ...newAnswers], inProgressRound: null };
    let topicAdvancedTo = null;
    let segmentLocked = false;
    let resumedTo = null;

    if (passed) {
      updated.misses = 0;
      if (studentData.resumePoint) {
        // Mr. Morgan placed this student here as a one-time detour --
        // passing sends them straight back to where they actually left
        // off, bypassing normal tier/topic advancement entirely.
        resumedTo = studentData.resumePoint;
        updated.topic = studentData.resumePoint.topic;
        updated.tier = studentData.resumePoint.tier;
        updated.resumePoint = null;
      } else {
        const tierIdx = TIER_ORDER.indexOf(studentData.tier);
        if (tierIdx + 1 < TIER_ORDER.length) {
          updated.tier = TIER_ORDER[tierIdx + 1];
        } else {
          updated.masteredTopics = [...new Set([...updated.masteredTopics, studentData.topic])];
          const next = resolveNextTopic(effectiveCourse, studentData.unitId, studentData.segmentId, studentData.topic);
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
      }
    } else {
      updated.misses = (studentData.misses || 0) + 1;
      if (updated.misses >= 2) updated.flagged = true;
    }

    // Track the farthest this student has ever legitimately reached, so the
    // self-service "move forward" picker below knows how far it's allowed to
    // let them jump back to after they've used "move back" to review earlier
    // material. This only ever ratchets forward.
    updated.farthest = laterPosition(effectiveCourse, getFarthest(studentData),
      { unitId: updated.unitId, segmentId: updated.segmentId, topic: updated.topic, tier: updated.tier });

    setStudentData(updated);
    await saveStudent(course, section, rosterSlug({ name: updated.displayName, idTag: updated.idTag }), updated);
    setRoundResult({ score, passed, flagged: updated.flagged, topicAdvancedTo, segmentLocked, resumedTo, preTopic: studentData.topic, preTier: studentData.tier });
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
        <h2 className="font-mono text-lg text-slate-700 dark:text-slate-200 mb-3">Who are you?</h2>
        {roster.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No students on the roster for this section yet. Ask Mr. Morgan to add you from the Teacher tab.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {[...roster].sort((a, b) => lastInitial(a.name).localeCompare(lastInitial(b.name))).map((entry) => (
              <button key={rosterSlug(entry)} onClick={() => selectStudent(entry)}
                className="text-left px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors">
                {entry.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading || !studentData) {
    return <div className="flex items-center justify-center mt-16 text-slate-400 dark:text-slate-500"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Hi, {studentData.displayName}</p>
        <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-4">Enter your 4-digit PIN</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          autoFocus
          className={`w-32 text-center text-2xl font-mono tracking-widest px-3 py-2 rounded-lg border ${pinError ? "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950" : "border-slate-300 dark:border-slate-600"} focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-3`}
          placeholder="----"
        />
        <div>
          <button onClick={submitPin} disabled={pinInput.length !== 4}
            className="px-5 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
            Unlock
          </button>
        </div>
        {pinError && <p className="text-rose-600 dark:text-rose-400 text-xs mt-3">That PIN doesn't match. Ask Mr. Morgan if you're not sure.</p>}
        <button onClick={switchStudent} className="mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-mono">
          not {studentData.displayName}?
        </button>
      </div>
    );
  }

  // CS3 has no content of its own yet -- until it does, a CS3 student picks
  // between reviewing the AP CS A bank or their (currently empty) native
  // course. Every other course is unaffected by any of this.
  if (course === "cs3" && !studentData.reviewMode) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Hi, {studentData.displayName}</p>
        <p className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-5">What would you like to work on?</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => chooseReviewMode("csa")}
            className="px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors text-indigo-800 dark:text-indigo-300 font-medium">
            AP CS A review
          </button>
          <button onClick={() => chooseReviewMode("cs3")}
            className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 font-medium">
            {COURSES.cs3.label}
          </button>
        </div>
        <button onClick={switchStudent} className="mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-mono">
          not {studentData.displayName}?
        </button>
      </div>
    );
  }

  // Whichever curriculum is actually active for this student right now.
  // Normally that's just their own course -- except a CS3 student who has
  // chosen "AP CS A review", who gets AP CS A's whole curriculum and item
  // bank layered on top, while their roster identity/PIN/storage stay under
  // course="cs3" throughout (see the save calls above and below, which all
  // still use the real `course`/`section` props, never `effectiveCourse`).
  const isReviewing = course === "cs3" && studentData.reviewMode === "csa";
  const effectiveCourse = isReviewing ? "csa" : course;
  const effectiveItemBank = isReviewing ? reviewItemBank : itemBank;

  if ((!studentData.topic || !positionBelongsTo(effectiveCourse, studentData)) && !studentData.locked) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Your teacher hasn't added any practice content for {COURSES[effectiveCourse].label} yet.</p>
        {course === "cs3" && (
          <button onClick={() => chooseReviewMode(isReviewing ? "cs3" : "csa")}
            className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-mono">
            {isReviewing ? `Switch to ${COURSES.cs3.label}` : "Switch to AP CS A review"}
          </button>
        )}
      </div>
    );
  }

  const unit = getUnit(effectiveCourse, studentData.unitId);
  const segment = getSegment(effectiveCourse, studentData.unitId, studentData.segmentId);
  const isFlagged = studentData.flagged;
  const isLocked = studentData.locked;
  const liveNext = isLocked ? resolveNextSegmentOrUnit(effectiveCourse, studentData.lockedAt.unitId, studentData.lockedAt.segmentId) : null;
  const review = getReview(studentData.topic, studentData.tier);

  // Options for the self-service move picker. "Back" is unrestricted (any
  // earlier position); "forward" is capped at the farthest this student has
  // actually earned by passing rounds, so it can never be used to skip ahead.
  // For a CS3 student in review mode, "farthest" was set to AP CS A's very
  // last topic/tier the moment they chose review mode, so forward is
  // effectively wide open too -- see chooseReviewMode above.
  const currentPos = { unitId: studentData.unitId, segmentId: studentData.segmentId, topic: studentData.topic, tier: studentData.tier };
  const currentTuple = positionTuple(effectiveCourse, currentPos);
  const farthestTuple = positionTuple(effectiveCourse, getFarthest(studentData));
  const backOptions = allPositions(effectiveCourse).filter((p) => compareTuples(positionTuple(effectiveCourse, p), currentTuple) < 0);
  const forwardOptions = allPositions(effectiveCourse).filter((p) => {
    const t = positionTuple(effectiveCourse, p);
    return compareTuples(t, currentTuple) > 0 && compareTuples(t, farthestTuple) <= 0;
  });
  const moveOptions = moveDirection === "back" ? backOptions : forwardOptions;
  const moveOptionKey = (p) => `${p.unitId}|${p.segmentId}|${p.topic}|${p.tier}`;
  const selectedMoveOption = moveOptions.find((p) => moveOptionKey(p) === moveChoice) || null;

  // While the "Topic mastered!" round-result is showing, keep the pipeline
  // displaying the just-finished topic (fully mastered) rather than jumping
  // ahead to the next topic's Basic tier -- that jump happens only once the
  // student clicks "Continue to Topic X.X".
  const showingTransition = !!(roundResult && (roundResult.topicAdvancedTo || roundResult.resumedTo));
  const displayTopic = showingTransition ? roundResult.preTopic : studentData.topic;
  const displayTier = showingTransition ? (roundResult.topicAdvancedTo ? "mastered" : roundResult.preTier) : studentData.tier;

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {isReviewing && <span className="px-1.5 py-0.5 mr-1.5 rounded border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] align-middle">AP CS A review</span>}
            {unit ? unit.label : ""}{segment ? ` \u00b7 ${segment.label}` : ""}
          </p>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{studentData.displayName}</h2>
        </div>
        <div className="flex items-center gap-2">
          {course === "cs3" && (
            <button onClick={() => chooseReviewMode(isReviewing ? "cs3" : "csa")}
              title={isReviewing ? `Switch to ${COURSES.cs3.label}` : "Switch to AP CS A review"}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isReviewing ? "Switch to CS3" : "Switch to review"}
            </button>
          )}
          <button onClick={() => { setShowMoveModal(true); setMoveDirection("back"); setMoveChoice(""); }} title="Move to a different topic/tier"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Target size={13} /> Move
          </button>
          <button onClick={switchStudent} title="Log out"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <TopicRow course={effectiveCourse} unitId={studentData.unitId} segmentId={studentData.segmentId} currentTopic={displayTopic} masteredTopics={studentData.masteredTopics} />
        <TierTrack tier={displayTier} flagged={isFlagged} />
      </div>

      {isLocked && (
        <div className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-center">
          <Lock className="mx-auto text-indigo-600 dark:text-indigo-400 mb-2" size={28} />
          <p className="font-semibold text-indigo-800 dark:text-indigo-300">{segment ? `${segment.label} complete!` : "Benchmark complete!"}</p>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
            {liveNext ? "Nice work -- waiting for Mr. Morgan to unlock the next Benchmark." : "You've finished everything currently available here. Great work -- check with Mr. Morgan about what's next."}
          </p>
        </div>
      )}

      {!isLocked && isFlagged && (
        <div className="p-6 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-center mt-4">
          <Flag className="mx-auto text-rose-600 dark:text-rose-400 mb-2" size={28} />
          <p className="font-semibold text-rose-800 dark:text-rose-300">Flagged for small-group help</p>
          <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">You've missed this tier twice in a row. Sit tight -- Mr. Morgan will pull you for a quick small-group session.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={checkFlagStatus} disabled={checkingFlag}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-60 transition-colors inline-flex items-center gap-2">
              {checkingFlag ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />} Continue
            </button>
            {review && (
              <button onClick={() => setShowReview((v) => !v)}
                className="px-5 py-2.5 rounded-lg border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-900 font-medium hover:bg-rose-50 dark:hover:bg-rose-900 transition-colors inline-flex items-center gap-2">
                <BookOpen size={16} /> {showReview ? "Hide review" : "Review while you wait"}
              </button>
            )}
          </div>
          {stillFlagged && <p className="text-rose-600 dark:text-rose-400 text-xs mt-3">Not yet -- Mr. Morgan hasn't cleared you for this tier.</p>}
        </div>
      )}

      {!isLocked && isFlagged && showReview && review && (
        <div className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left">
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">Topic {studentData.topic} \u00b7 {TIER_LABELS[studentData.tier]}</p>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">{review.title}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 whitespace-pre-line">{review.concept}</p>
          {review.examples.map((ex, i) => (
            <div key={i} className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">Example</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-mono">{ex.text}</p>
            </div>
          ))}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mb-1">Common mistake</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{review.commonMistake}</p>
          </div>
        </div>
      )}

      {!isLocked && !isFlagged && !round && !roundResult && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-mono">
            Current tier: <span className={`px-2 py-0.5 rounded border ${TIER_COLORS[studentData.tier]}`}>{TIER_LABELS[studentData.tier]}</span>
          </p>
          <button onClick={startRound} className="px-5 py-2.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors inline-flex items-center gap-2">
            Start <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!isLocked && !isFlagged && roundResult && (
        <div className={`p-6 rounded-xl border text-center ${roundResult.passed ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"}`}>
          <p className={`font-semibold ${roundResult.passed ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"}`}>{roundResult.score} / {ROUND_SIZE} correct</p>
          <p className={`text-sm mt-1 ${roundResult.passed ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
            {roundResult.segmentLocked ? "Benchmark complete! Waiting for Mr. Morgan to unlock the next Benchmark."
              : roundResult.resumedTo ? "Nice work! Picking back up where you left off."
              : roundResult.topicAdvancedTo ? "Topic mastered!"
              : roundResult.passed ? "Great work -- advancing to the next tier."
              : "Not quite there yet -- let's try this tier again."}
          </p>
          {!roundResult.segmentLocked && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setRoundResult(null)} className="px-5 py-2.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors inline-flex items-center gap-2">
                {roundResult.resumedTo ? `Continue to Topic ${roundResult.resumedTo.topic}`
                  : roundResult.topicAdvancedTo ? `Continue to Topic ${roundResult.topicAdvancedTo}` : "Continue"} <ChevronRight size={16} />
              </button>
              {!roundResult.passed && review && (
                <button onClick={() => setShowReview((v) => !v)}
                  className="px-5 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 bg-white dark:bg-slate-900 font-medium hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors inline-flex items-center gap-2">
                  <BookOpen size={16} /> {showReview ? "Hide review" : "Review before trying again"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!isLocked && !isFlagged && roundResult && !roundResult.passed && showReview && review && (
        <div className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left">
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">Topic {studentData.topic} \u00b7 {TIER_LABELS[studentData.tier]}</p>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">{review.title}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 mb-4 whitespace-pre-line">{review.concept}</p>
          {review.examples.map((ex, i) => (
            <div key={i} className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-1">Example</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-mono">{ex.text}</p>
            </div>
          ))}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mb-1">Common mistake</p>
            <p className="text-sm text-amber-800 dark:text-amber-300">{review.commonMistake}</p>
          </div>
        </div>
      )}

      {round && (
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mb-3">
            Question {round.index + 1} of {round.items.length} &middot; Topic {round.items[round.index].topic} &middot; {TIER_LABELS[round.items[round.index].tier]}
          </p>
          <p className="text-slate-800 dark:text-slate-100 mb-4 whitespace-pre-wrap">{round.items[round.index].prompt}</p>
          <div className="flex flex-col gap-2 mb-4">
            {round.items[round.index].choices.map((choice, i) => {
              const isCorrect = i === round.items[round.index].answer;
              const isChosen = i === selectedChoice;
              let style = "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600";
              if (showFeedback) {
                if (isCorrect) style = "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950";
                else if (isChosen) style = "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950";
              } else if (isChosen) style = "border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950";
              return (
                <button key={i} disabled={showFeedback} onClick={() => setSelectedChoice(i)}
                  className={`text-left px-4 py-2.5 rounded-lg border ${style} transition-colors text-sm flex items-start gap-2`}>
                  {showFeedback && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />}
                  {showFeedback && isChosen && !isCorrect && <XCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
                  <span className="whitespace-pre-wrap">{choice}</span>
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
              {round.items[round.index].explanation}
            </div>
          )}
          {!showFeedback ? (
            <button onClick={submitAnswer} disabled={selectedChoice === null}
              className="px-5 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
              Check answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="px-5 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors inline-flex items-center gap-2">
              {round.index + 1 < round.items.length ? "Next question" : "See tier result"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {showMoveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 max-w-sm w-full">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Move to a different topic</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              You're currently on Topic {studentData.topic} ({TIER_LABELS[studentData.tier]}).
            </p>

            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-3 text-xs font-medium">
              <button onClick={() => { setMoveDirection("back"); setMoveChoice(""); }}
                className={`flex-1 py-1.5 transition-colors ${moveDirection === "back" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                Move back
              </button>
              <button onClick={() => { setMoveDirection("forward"); setMoveChoice(""); }}
                className={`flex-1 py-1.5 border-l border-slate-200 dark:border-slate-700 transition-colors ${moveDirection === "forward" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                Move forward
              </button>
            </div>

            {moveDirection === "back" ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Go back to any earlier topic and tier to review or practice more. You'll start fresh at Question 1 and just keep going from there as normal -- there's no jump back to where you are now, so make sure that's what you want.
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {forwardOptions.length === 0
                  ? "You're already at the farthest point you've earned -- there's nowhere further to move forward to yet. Keep passing tiers to unlock more."
                  : "Jump forward to any topic/tier you've already reached, up to the farthest you've actually earned by passing rounds. You'll start fresh at Question 1."}
              </p>
            )}

            {moveOptions.length > 0 && (
              <select value={moveChoice} onChange={(e) => setMoveChoice(e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono mb-4">
                <option value="">Choose a topic/tier...</option>
                {moveOptions.map((p) => (
                  <option key={moveOptionKey(p)} value={moveOptionKey(p)}>
                    {p.unitLabel} · Topic {p.topic} ({TOPIC_LABELS[p.topic] || p.topic}) · {TIER_LABELS[p.tier]}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-2">
              <button onClick={() => applyStudentMove(selectedMoveOption)} disabled={!selectedMoveOption}
                className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
                {moveDirection === "back" ? "Move back" : "Move forward"}
              </button>
              <button onClick={() => { setShowMoveModal(false); setMoveChoice(""); }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher dashboard
// ---------------------------------------------------------------------------
function TeacherView({ course, section, roster, onRosterChange, onLock, itemBank, onItemBankChange }) {
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
  const [settingSlug, setSettingSlug] = useState(null);
  const [posUnit, setPosUnit] = useState("");
  const [posSegment, setPosSegment] = useState("");
  const [posTopic, setPosTopic] = useState("");
  const [posTier, setPosTier] = useState("basic");
  const [pendingPosition, setPendingPosition] = useState(null); // {entry, newPos, oldPos} while confirming a backward move
  const [renamingSlug, setRenamingSlug] = useState(null);
  const [renameName, setRenameName] = useState("");
  const [renameIdTag, setRenameIdTag] = useState("");
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingPinSlug, setEditingPinSlug] = useState(null);
  const [pinDraft, setPinDraft] = useState("");
  const [pinDraftError, setPinDraftError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

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

    // A .json file here means it came from the separate roster-converter
    // tool (which parses the PDF on normal hosting, where pdf.js's worker
    // works reliably) -- skip PDF parsing entirely and use it directly.
    if (file.name.toLowerCase().endsWith(".json")) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("not an array");
        setPendingRows(parsed.map((row) => ({
          editedName: row.editedName || "",
          idTag: row.idTag || null,
          include: row.include !== false,
        })));
      } catch (err) {
        console.error("Converted roster file parsing failed", err);
        setUploadError(`Couldn't read that file: ${err?.message || err}. Make sure it's the file downloaded from the roster converter tool.`);
      }
      return;
    }

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
      console.error("Roster PDF parsing failed", err);
      setUploadError(`Couldn't read that PDF: ${err?.message || err}. Make sure it's not a scanned image and try again.`);
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
    // Unlocking into a new segment is real, earned progress -- keep the
    // student's own "farthest reached" bookmark (used by their self-service
    // move-forward picker) in sync with it.
    updated.farthest = laterPosition(course, getFarthest(data), { unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0] });
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
      updated.farthest = laterPosition(course, getFarthest(data), { unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0] });
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

  const setStudentPinManual = async (entry, newPin) => {
    if (!/^\d{4}$/.test(newPin)) { setPinDraftError("PIN must be exactly 4 digits."); return; }
    const slug = rosterSlug(entry);
    const data = await loadStudentRaw(course, section, slug);
    if (!data) return;
    const updated = { ...data, pin: newPin };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [slug]: updated }));
    setEditingPinSlug(null);
    setPinDraftError("");
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

  const openRename = (entry) => {
    const slug = rosterSlug(entry);
    if (renamingSlug === slug) { setRenamingSlug(null); return; }
    setRenamingSlug(slug);
    setRenameName(entry.name);
    setRenameIdTag(entry.idTag || "");
  };

  const renameStudent = async (entry) => {
    const trimmedName = renameName.trim();
    if (!trimmedName) return;
    const newEntry = { name: trimmedName, idTag: renameIdTag.trim() || null };
    const oldSlug = rosterSlug(entry);
    const newSlug = rosterSlug(newEntry);
    if (newSlug !== oldSlug && roster.some((e) => rosterSlug(e) === newSlug)) {
      window.alert("A student with that exact name/ID already exists. Choose a different name or ID tag.");
      return;
    }
    const data = students[oldSlug];
    if (!data) return;
    const updatedData = { ...data, displayName: trimmedName, idTag: newEntry.idTag };
    await saveStudent(course, section, newSlug, updatedData);
    if (newSlug !== oldSlug) await deleteStudent(course, section, oldSlug);
    const updatedRoster = roster.map((e) => (rosterSlug(e) === oldSlug ? newEntry : e));
    await saveRoster(course, section, updatedRoster);
    onRosterChange(updatedRoster);
    setStudents((s) => {
      const copy = { ...s };
      if (newSlug !== oldSlug) delete copy[oldSlug];
      copy[newSlug] = updatedData;
      return copy;
    });
    setRenamingSlug(null);
  };

  const openPositionPicker = (entry) => {
    const slug = rosterSlug(entry);
    if (settingSlug === slug) { setSettingSlug(null); return; }
    const data = students[slug];
    setSettingSlug(slug);
    setPendingPosition(null);
    // Default the picker to the student's current position for convenience.
    setPosUnit(data?.unitId || (UNITS[course][0]?.id ?? ""));
    setPosSegment(data?.segmentId || (UNITS[course][0]?.segments[0]?.id ?? ""));
    setPosTopic(data?.topic || (UNITS[course][0]?.segments[0]?.topics[0] ?? ""));
    setPosTier(TIER_ORDER.includes(data?.tier) ? data.tier : "basic");
  };

  const initiateSetPosition = (entry) => {
    const slug = rosterSlug(entry);
    const data = students[slug];
    if (!data || !posUnit || !posSegment || !posTopic) return;
    const newPos = { unitId: posUnit, segmentId: posSegment, topic: posTopic, tier: posTier };
    const oldPos = { unitId: data.unitId, segmentId: data.segmentId, topic: data.topic, tier: data.tier };
    const cmp = compareTuples(positionTuple(course, newPos), positionTuple(course, oldPos));
    if (cmp < 0) {
      setPendingPosition({ entry, newPos, oldPos });
    } else {
      applyPosition(entry, newPos, null);
    }
  };

  const applyPosition = async (entry, newPos, resumePoint) => {
    const slug = rosterSlug(entry);
    const data = students[slug];
    if (!data) return;
    const updated = { ...data, ...newPos, locked: false, lockedAt: null, flagged: false, misses: 0, resumePoint: resumePoint || null, inProgressRound: null };
    // A teacher placing a student ahead of where they've been before is real,
    // earned progress -- keep their "farthest reached" bookmark in sync so
    // their own self-service move-forward picker isn't stuck behind it. A
    // backward placement (with or without a "jump right back" detour) leaves
    // the bookmark untouched, same as everywhere else.
    updated.farthest = laterPosition(course, getFarthest(data), newPos);
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [slug]: updated }));
    setSettingSlug(null);
    setPendingPosition(null);
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
    <div className="max-w-5xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStudent()}
          placeholder="Add student (e.g. Jane D.)" className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700" />
        <button onClick={addStudent} className="px-3 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors inline-flex items-center gap-1 text-sm">
          <Plus size={16} /> Add
        </button>
        <label className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
          {parsingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />} Upload roster PDF or converted file
          <input type="file" accept="application/pdf,.json" onChange={handleRosterFile} disabled={parsingPdf} className="hidden" />
        </label>
        <button onClick={refresh} title="Refresh progress data" className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <RotateCcw size={14} /> Refresh
        </button>
        <button onClick={unlockAllWaiting} disabled={!anyWaiting}
          className="px-3 py-2 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 text-sm">
          <Unlock size={14} /> Unlock waiting students
        </button>
        <button onClick={handleExportAll} disabled={exporting}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export all data
        </button>
        <button onClick={() => setShowChangePassword(true)} title="Change the teacher password"
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <KeyRound size={14} /> Change password
        </button>
        <button onClick={onLock} title="Lock the Teacher tab"
          className="ml-auto px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Lock size={14} /> Lock
        </button>
        <button onClick={deleteAllStudents} disabled={roster.length === 0} title="Permanently delete every student in this section"
          className="px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 text-sm">
          <Trash2 size={14} /> Delete all students
        </button>
        <button onClick={() => setShowContentEditor((v) => !v)}
          className={`px-3 py-2 rounded-lg border transition-colors inline-flex items-center gap-1 text-sm ${showContentEditor ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
          <Wrench size={14} /> {showContentEditor ? "Back to roster" : "Content Editor"}
        </button>
      </div>

      {showContentEditor ? (
        <ContentEditor course={course} itemBank={itemBank} onItemBankChange={onItemBankChange} />
      ) : (
      <>

      {uploadError && <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 font-mono">{uploadError}</div>}

      {pendingRows && (
        <div className="mb-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Review before adding ({pendingRows.filter((r) => r.include).length} selected)</p>
            <button onClick={cancelPendingRoster} title="Discard without saving anything" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-3">Nothing is saved yet. Edit any name below, uncheck anyone you don't want to add, then confirm.</p>
          <div className="flex flex-col gap-1.5 mb-4 max-h-80 overflow-y-auto">
            {pendingRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
                <input type="checkbox" checked={row.include} onChange={(e) => updatePendingRow(i, { include: e.target.checked })} />
                <input value={row.editedName} onChange={(e) => updatePendingRow(i, { editedName: e.target.value })}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700" />
                {row.idTag && <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-mono shrink-0">{`ID ${row.idTag}`}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={confirmPendingRoster} className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors text-sm">
              Add {pendingRows.filter((r) => r.include).length} student{pendingRows.filter((r) => r.include).length === 1 ? "" : "s"} to roster
            </button>
            <button onClick={cancelPendingRoster} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm text-slate-600 dark:text-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {bulkMsg && <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono">{bulkMsg}</div>}
      {loadErrors.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300 font-mono">
          Couldn't load saved progress for: {loadErrors.join(", ")}. Try Refresh again.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400 dark:text-slate-500"><Loader2 className="animate-spin mr-2" size={18} /> Loading roster...</div>
      ) : roster.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-10 font-mono">No students in this section yet -- add one above.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
          {[...roster].sort((entryA, entryB) => {
            const a = students[rosterSlug(entryA)], b = students[rosterSlug(entryB)];
            if (!a || !b) return 0;
            const flagDiff = (a.flagged ? 0 : 1) - (b.flagged ? 0 : 1);
            if (flagDiff !== 0) return flagDiff;
            const posCompare = compareTuples(positionTuple(course, a), positionTuple(course, b));
            if (posCompare !== 0) return posCompare;
            return lastInitial(entryA.name).localeCompare(lastInitial(entryB.name));
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
              <div key={slug} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="flex items-center justify-between p-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-slate-800 dark:text-slate-100">{data.displayName}</span>
                      {entry.idTag && (
                        <span title="Last 2 digits of student ID -- for your own disambiguation only, never shown to students" className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-mono">
                          {`ID ${entry.idTag}`}
                        </span>
                      )}
                      {data.locked ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-indigo-300 dark:border-indigo-700 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 inline-flex items-center gap-1">
                            <Lock size={10} /> Waiting to unlock
                          </span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : data.topic ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">{unit ? unit.id : ""}{segment ? ` \u00b7 ${segment.label}` : ""}</span>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">Topic {data.topic}</span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">No content yet</span>
                      )}
                      {data.flagged && (
                        <span className="text-xs px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 inline-flex items-center gap-1">
                          <Flag size={10} /> flagged
                        </span>
                      )}
                    </div>
                    {(acc !== null || data.masteredTopics.length > 0) && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {acc !== null ? `${acc}% overall accuracy` : ""}
                        {data.masteredTopics.length > 0 ? `${acc !== null ? " \u00b7 " : ""}mastered: ${data.masteredTopics.join(", ")}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => {
                        if (editingPinSlug === slug) { setEditingPinSlug(null); return; }
                        setEditingPinSlug(slug); setPinDraft(data.pin || ""); setPinDraftError("");
                      }} title="Click to view or change this student's PIN"
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                      <KeyRound size={12} /> {data.pin || "----"}
                    </button>
                    {data.flagged && (
                      <button onClick={() => clearFlag(entry)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-colors">
                        Clear flag
                      </button>
                    )}
                    {data.locked && (
                      <button onClick={() => unlockStudent(entry)} disabled={!lockedNext} title={!lockedNext ? "No further content configured yet" : ""}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                        <Unlock size={12} /> Unlock
                      </button>
                    )}
                    <button onClick={() => openRename(entry)} title="Rename"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => { setMovingSlug(movingSlug === slug ? null : slug); setMoveTarget(""); }} title="Move to another section"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500">
                      <ArrowRightLeft size={14} />
                    </button>
                    <button onClick={() => openPositionPicker(entry)} title="Set exact topic/tier"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500">
                      <Target size={14} />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : slug)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      {isOpen ? "Hide" : "History"}
                    </button>
                    <button onClick={() => resetStudent(entry)} title="Reset progress" className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 dark:text-slate-500">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => removeStudent(entry)} title="Remove student" className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900 transition-colors text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {renamingSlug === slug && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Rename to:</span>
                    <input value={renameName} onChange={(e) => setRenameName(e.target.value)}
                      placeholder="e.g. Jane D." className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-40" />
                    <input value={renameIdTag} onChange={(e) => setRenameIdTag(e.target.value.replace(/\D/g, "").slice(0, 2))}
                      placeholder="ID tag (optional)" className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono w-32" />
                    <button onClick={() => renameStudent(entry)} disabled={!renameName.trim()}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-40 transition-colors">
                      Save
                    </button>
                    <button onClick={() => setRenamingSlug(null)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                      Cancel
                    </button>
                  </div>
                )}
                {editingPinSlug === slug && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Set PIN to:</span>
                    <input value={pinDraft} autoFocus
                      onChange={(e) => { setPinDraft(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinDraftError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && pinDraft.length === 4 && setStudentPinManual(entry, pinDraft)}
                      placeholder="4 digits" className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono w-24" />
                    <button onClick={() => setStudentPinManual(entry, pinDraft)} disabled={pinDraft.length !== 4}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Save
                    </button>
                    <button onClick={async () => { await regeneratePin(entry); setEditingPinSlug(null); setPinDraftError(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                      <RotateCcw size={12} /> Randomize instead
                    </button>
                    <button onClick={() => { setEditingPinSlug(null); setPinDraftError(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                      Cancel
                    </button>
                    {pinDraftError && <p className="text-rose-600 dark:text-rose-400 text-xs w-full">{pinDraftError}</p>}
                  </div>
                )}
                {movingSlug === slug && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Move to:</span>
                    <select value={moveTarget} onChange={(e) => setMoveTarget(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
                      <option value="">Choose section...</option>
                      {COURSES[course].sections.filter((s) => s !== section).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={() => moveStudent(entry, moveTarget)} disabled={!moveTarget}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      Move
                    </button>
                    <button onClick={() => { setMovingSlug(null); setMoveTarget(""); }} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                      Cancel
                    </button>
                  </div>
                )}
                {settingSlug === slug && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Set to:</span>
                    <select value={posUnit} onChange={(e) => {
                        const u = e.target.value;
                        const firstSeg = getUnit(course, u)?.segments[0];
                        setPosUnit(u); setPosSegment(firstSeg?.id || ""); setPosTopic(firstSeg?.topics[0] || "");
                      }} className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
                      {UNITS[course].map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                    </select>
                    <select value={posSegment} onChange={(e) => {
                        const s = e.target.value;
                        const seg = getUnit(course, posUnit)?.segments.find((x) => x.id === s);
                        setPosSegment(s); setPosTopic(seg?.topics[0] || "");
                      }} className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
                      {getUnit(course, posUnit)?.segments.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <select value={posTopic} onChange={(e) => setPosTopic(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
                      {getSegment(course, posUnit, posSegment)?.topics.map((t) => <option key={t} value={t}>Topic {t}</option>)}
                    </select>
                    <select value={posTier} onChange={(e) => setPosTier(e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
                      {TIER_ORDER.map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                    </select>
                    <button onClick={() => initiateSetPosition(entry)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
                      Set
                    </button>
                    <button onClick={() => setSettingSlug(null)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                      Cancel
                    </button>
                  </div>
                )}
                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                    {data.history.length === 0 ? (
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">No attempts yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {data.history.slice().reverse().map((h, i) => {
                          const item = itemBank.find((it) => it.id === h.itemId);
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              {h.correct ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <XCircle size={14} className="text-rose-500 shrink-0" />}
                              <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-500 dark:text-slate-400">{h.topic}</span>
                              <span className={`px-1.5 py-0.5 rounded border font-mono ${TIER_COLORS[h.tier]}`}>{TIER_LABELS[h.tier]}</span>
                              <span className="text-slate-500 dark:text-slate-400 truncate">{item ? item.prompt.split("\n")[0] : h.itemId}</span>
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
        </>
      )}

      {pendingPosition && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 max-w-sm w-full">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Moving backward</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              This sets {pendingPosition.entry.name} to Topic {pendingPosition.newPos.topic} ({TIER_LABELS[pendingPosition.newPos.tier]}), earlier than where they currently are.
              How should this work?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => applyPosition(pendingPosition.entry, pendingPosition.newPos, null)}
                className="text-left px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-100">Continue normally from here</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">They'll progress forward as usual, eventually working back up through everything in between.</p>
              </button>
              <button
                onClick={() => applyPosition(pendingPosition.entry, pendingPosition.newPos, pendingPosition.oldPos)}
                className="text-left px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors text-sm">
                <span className="font-medium text-slate-800 dark:text-slate-100">Do this, then return to where they left off</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">One pass at Topic {pendingPosition.newPos.topic} ({TIER_LABELS[pendingPosition.newPos.tier]}), then straight back to Topic {pendingPosition.oldPos.topic} ({TIER_LABELS[pendingPosition.oldPos.tier]}).</p>
              </button>
            </div>
            <button onClick={() => setPendingPosition(null)} className="mt-3 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showChangePassword && (
        <TeacherChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher password change -- lets an already-unlocked teacher set a new
// password after re-entering the current one. Separate from TeacherGate's
// first-time setup / unlock flow below.
// ---------------------------------------------------------------------------
function TeacherChangePasswordModal({ onClose }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setError("");
    if (newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setError("New passwords don't match."); return; }
    setBusy(true);
    const [inputHash, storedHash] = await Promise.all([hashPassword(currentPw), loadTeacherPasswordHash()]);
    if (inputHash !== storedHash) {
      setBusy(false);
      setError("Current password is incorrect.");
      return;
    }
    await saveTeacherPasswordHash(await hashPassword(newPw));
    setBusy(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 max-w-sm w-full">
        {success ? (
          <>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Password updated</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Use your new password next time you unlock the Teacher tab.</p>
            <button onClick={onClose}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
              Done
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Change teacher password</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Enter your current password, then choose a new one (8+ characters).</p>
            <input type="password" value={currentPw} autoFocus
              onChange={(e) => { setCurrentPw(e.target.value); setError(""); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-2"
              placeholder="Current password" />
            <input type="password" value={newPw}
              onChange={(e) => { setNewPw(e.target.value); setError(""); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-2"
              placeholder="New password" />
            <input type="password" value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-3"
              placeholder="Confirm new password" />
            {error && <p className="text-rose-600 dark:text-rose-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={busy || !currentPw || !newPw || !confirmPw}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
                {busy ? "Saving..." : "Save"}
              </button>
              <button onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content Editor -- live editing of the question bank, backed by Firestore.
// ---------------------------------------------------------------------------
function ContentEditor({ course, itemBank, onItemBankChange }) {
  const firstUnit = UNITS[course][0];
  const firstSegment = firstUnit?.segments[0];
  const [edUnit, setEdUnit] = useState(firstUnit?.id || "");
  const [edSegment, setEdSegment] = useState(firstSegment?.id || "");
  const [edTopic, setEdTopic] = useState(firstSegment?.topics[0] || "");
  const [edTier, setEdTier] = useState("basic");
  const [localItems, setLocalItems] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [confirmingRestore, setConfirmingRestore] = useState(false);

  useEffect(() => {
    const matches = itemBank.filter((it) => it.course === course && it.topic === edTopic && it.tier === edTier);
    setLocalItems(matches.map((it) => ({ ...it, choices: [...it.choices] })));
    setDirty(false);
    setSaveMsg("");
  }, [course, edTopic, edTier, itemBank]);

  const updateItem = (index, patch) => {
    setLocalItems((items) => items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
    setDirty(true);
    setSaveMsg("");
  };
  const updateChoice = (index, choiceIndex, value) => {
    setLocalItems((items) => items.map((it, i) => {
      if (i !== index) return it;
      const choices = [...it.choices];
      choices[choiceIndex] = value;
      return { ...it, choices };
    }));
    setDirty(true);
    setSaveMsg("");
  };
  const addItem = () => {
    const newItem = { id: `${edTopic}-custom-${Date.now()}`, course, topic: edTopic, tier: edTier, lo: "", prompt: "", choices: ["", "", "", ""], answer: 0, explanation: "" };
    setLocalItems((items) => [...items, newItem]);
    setDirty(true);
  };
  const deleteItem = (index) => {
    setLocalItems((items) => items.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleSave = async () => {
    const loc = findSegmentForTopic(course, edTopic);
    if (!loc) return;
    setSaving(true);
    const updatedBank = [
      ...itemBank.filter((it) => !(it.course === course && it.topic === edTopic && it.tier === edTier)),
      ...localItems,
    ];
    const segmentItems = updatedBank.filter((it) => it.course === course && loc.topics.includes(it.topic));
    await saveSegmentItems(course, loc.unitId, loc.segmentId, segmentItems);
    onItemBankChange(updatedBank);
    setSaving(false);
    setDirty(false);
    setSaveMsg("Saved.");
  };

  const handleImport = async () => {
    setImportMsg("");
    let parsed;
    try {
      parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error("not an array");
    } catch {
      setImportMsg("That doesn't look like valid JSON for a list of items.");
      return;
    }
    const bySegment = new Map();
    for (const item of parsed) {
      const loc = findSegmentForTopic(item.course || course, item.topic);
      if (!loc) continue;
      const key = `${item.course || course}:${loc.unitId}:${loc.segmentId}`;
      if (!bySegment.has(key)) bySegment.set(key, { segCourse: item.course || course, ...loc });
    }
    let updatedBank = [...itemBank];
    for (const item of parsed) {
      const idx = updatedBank.findIndex((it) => it.id === item.id);
      if (idx >= 0) updatedBank[idx] = item;
      else updatedBank.push(item);
    }
    for (const { segCourse, unitId, segmentId, topics } of bySegment.values()) {
      const segmentItems = updatedBank.filter((it) => it.course === segCourse && topics.includes(it.topic));
      await saveSegmentItems(segCourse, unitId, segmentId, segmentItems);
    }
    onItemBankChange(updatedBank);
    setImportMsg(`Imported ${parsed.length} item${parsed.length === 1 ? "" : "s"} across ${bySegment.size} segment${bySegment.size === 1 ? "" : "s"}.`);
    setImportText("");
  };

  const handleExportContent = () => {
    downloadJson(itemBank, `content-bank-${course}-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const restoreDefaults = () => {
    const defaults = STATIC_ITEM_BANK.filter((it) => it.course === course && it.topic === edTopic && it.tier === edTier);
    setLocalItems(defaults.map((it) => ({ ...it, choices: [...it.choices] })));
    setDirty(true);
    setSaveMsg("");
    setConfirmingRestore(false);
  };

  const currentSegment = getSegment(course, edUnit, edSegment);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <select value={edUnit} onChange={(e) => {
            const u = e.target.value;
            const firstSeg = getUnit(course, u)?.segments[0];
            setEdUnit(u); setEdSegment(firstSeg?.id || ""); setEdTopic(firstSeg?.topics[0] || "");
          }} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
          {UNITS[course].map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
        </select>
        <select value={edSegment} onChange={(e) => {
            const s = e.target.value;
            const seg = getUnit(course, edUnit)?.segments.find((x) => x.id === s);
            setEdSegment(s); setEdTopic(seg?.topics[0] || "");
          }} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
          {getUnit(course, edUnit)?.segments.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={edTopic} onChange={(e) => setEdTopic(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
          {currentSegment?.topics.map((t) => <option key={t} value={t}>Topic {t}</option>)}
        </select>
        <select value={edTier} onChange={(e) => setEdTier(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono">
          {TIER_ORDER.map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
        </select>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{localItems.length} item{localItems.length === 1 ? "" : "s"}</span>
        <button onClick={handleExportContent} className="ml-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
          <Download size={12} /> Export content bank
        </button>
        <button onClick={() => setShowImport((v) => !v)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {showImport ? "Hide import" : "Import JSON"}
        </button>
        <button onClick={() => setConfirmingRestore(true)} title="Replace this topic/tier's items with the bundled defaults shipped in the codebase"
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
          <RotateCcw size={12} /> Restore bundled defaults
        </button>
      </div>

      {confirmingRestore && (
        <div className="mb-4 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
          <p className="text-xs text-amber-800 dark:text-amber-300 mb-2">
            This replaces every item currently shown below (Topic {edTopic}, {TIER_LABELS[edTier]}) with the version bundled in the app's source code -- discarding any live edits made to this topic/tier in the Content Editor. Nothing is saved to Firestore until you click "Save changes" afterward.
          </p>
          <div className="flex items-center gap-2">
            <button onClick={restoreDefaults} className="px-3 py-1.5 rounded-lg bg-amber-600 dark:bg-amber-500 text-white text-xs">Yes, load bundled defaults</button>
            <button onClick={() => setConfirmingRestore(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
          </div>
        </div>
      )}

      {showImport && (
        <div className="mb-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Paste a JSON array of items. Each item's own topic/tier determines where it's saved -- it doesn't need to match the selection above. Matching an existing item's id updates it; a new id adds it.</p>
          <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={6}
            className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono mb-2" placeholder='[ { "id": "1.1-custom-1", "course": "csa", "topic": "1.1", "tier": "basic", "lo": "1.1.A", "prompt": "...", "choices": ["...","...","...","..."], "answer": 0, "explanation": "..." } ]' />
          <button onClick={handleImport} disabled={!importText.trim()} className="px-3 py-1.5 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-xs disabled:opacity-40">Import</button>
          {importMsg && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{importMsg}</p>}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        {localItems.map((item, i) => (
          <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{item.id}</span>
              <button onClick={() => deleteItem(i)} title="Delete item" className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400">
                <Trash2 size={14} />
              </button>
            </div>
            <textarea value={item.prompt} onChange={(e) => updateItem(i, { prompt: e.target.value })} rows={2}
              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm mb-2 font-mono" placeholder="Question prompt" />
            {item.choices.map((choice, ci) => (
              <div key={ci} className="flex items-center gap-2 mb-1.5">
                <input type="radio" checked={item.answer === ci} onChange={() => updateItem(i, { answer: ci })} title="Mark as the correct answer" />
                <input value={choice} onChange={(e) => updateChoice(i, ci, e.target.value)}
                  className={`flex-1 px-2 py-1 rounded-lg border text-sm ${item.answer === ci ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950" : "border-slate-200 dark:border-slate-700"}`} placeholder={`Choice ${ci + 1}`} />
              </div>
            ))}
            <textarea value={item.explanation} onChange={(e) => updateItem(i, { explanation: e.target.value })} rows={2}
              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm mt-2" placeholder="Explanation" />
          </div>
        ))}
        {localItems.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6 font-mono">No items yet for this topic/tier -- add one below.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={addItem} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 inline-flex items-center gap-1">
          <Plus size={14} /> Add item
        </button>
        <button onClick={handleSave} disabled={!dirty || saving}
          className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save changes
        </button>
        {saveMsg && <span className="text-xs text-emerald-600 dark:text-emerald-400">{saveMsg}</span>}
        {dirty && !saveMsg && <span className="text-xs text-amber-600 dark:text-amber-400">Unsaved changes</span>}
      </div>
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
    return <div className="flex items-center justify-center mt-16 text-slate-400 dark:text-slate-500"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      {hasPassword ? (
        <>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Teacher access</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-mono">Enter the teacher password</p>
          <input type="password" value={pw} autoFocus
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-3"
            placeholder="Password" />
          <button onClick={handleLogin} disabled={busy || !pw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
            {busy ? "Checking..." : "Unlock"}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Set up teacher access</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-mono">No password is set yet. Create one now (8+ characters) -- you'll enter this every time you open the Teacher tab.</p>
          <input type="password" value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-2"
            placeholder="New password" />
          <input type="password" value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSetup()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 mb-3"
            placeholder="Confirm password" />
          <button onClick={handleSetup} disabled={busy || !pw || !confirmPw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors">
            {busy ? "Saving..." : "Set password"}
          </button>
        </>
      )}
      {error && <p className="text-rose-600 dark:text-rose-400 text-xs mt-3 text-center">{error}</p>}
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
  const [itemBank, setItemBank] = useState([]);
  const [itemBankLoaded, setItemBankLoaded] = useState(false);
  // CS3 has no content of its own yet, so CS3 students can use AP CS A's
  // bank as a review tool (see StudentView). When course is already "csa"
  // this just mirrors itemBank/itemBankLoaded -- no extra fetch needed.
  const [reviewItemBank, setReviewItemBank] = useState([]);
  const [reviewItemBankLoaded, setReviewItemBankLoaded] = useState(false);
  // Dark mode: defaults to the device's system setting, but a manual toggle
  // (see the header button below) can override that -- once someone toggles,
  // their explicit choice is remembered on this device from then on, taking
  // priority over whatever the system setting says.
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem("csa-practice-theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
    } catch {
      // localStorage can throw in some private-browsing modes -- fall back
      // to the system setting below rather than crashing the app.
    }
    return typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Until someone explicitly toggles (see toggleDarkMode), keep following the
  // system setting live, so switching the OS theme while this tab is open
  // still updates the app -- matching how the teacher-facing course/section
  // bar and everything else already behaves without needing a page reload.
  useEffect(() => {
    let hasExplicitChoice = false;
    try {
      hasExplicitChoice = localStorage.getItem("csa-practice-theme") !== null;
    } catch {
      // ignore -- treat as no explicit choice stored
    }
    if (hasExplicitChoice || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDarkMode(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("csa-practice-theme", next ? "dark" : "light");
      } catch {
        // If localStorage is unavailable, the toggle still works for this
        // page view -- it just won't be remembered on the next visit.
      }
      return next;
    });
  };

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

  useEffect(() => {
    setItemBankLoaded(false);
    loadAllContent(UNITS[course], course).then((bank) => {
      setItemBank(bank);
      setItemBankLoaded(true);
    });
  }, [course]);

  useEffect(() => {
    if (course === "csa") {
      // Already loading via the effect above -- no separate fetch needed.
      setReviewItemBank(itemBank);
      setReviewItemBankLoaded(itemBankLoaded);
      return;
    }
    setReviewItemBankLoaded(false);
    loadAllContent(UNITS.csa, "csa").then((bank) => {
      setReviewItemBank(bank);
      setReviewItemBankLoaded(true);
    });
  }, [course, itemBank, itemBankLoaded]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" style={{ backgroundImage: `radial-gradient(circle, ${darkMode ? "#1e293b" : "#e2e8f0"} 1px, transparent 1px)`, backgroundSize: "18px 18px" }}>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500 tracking-widest uppercase">Adaptive Practice</p>
            <h1 className="font-mono text-lg font-semibold text-slate-800 dark:text-slate-100">{COURSES[course].label} &middot; {section}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
              <button onClick={() => setMode("student")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "student" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <GraduationCap size={15} /> Student
              </button>
              <button onClick={() => setMode("teacher")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "teacher" ? "bg-indigo-600 dark:bg-indigo-500 text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <Users size={15} /> Teacher
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <CourseSectionBar course={course} section={section} onCourse={changeCourse} onSection={setSection} studentCount={mode === "teacher" ? roster.length : undefined} />
        </div>

        {!rosterLoaded || !itemBankLoaded || (course === "cs3" && !reviewItemBankLoaded) ? (
          <div className="flex items-center justify-center mt-16 text-slate-400 dark:text-slate-500"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>
        ) : mode === "student" ? (
          <StudentView course={course} section={section} roster={roster} itemBank={itemBank} reviewItemBank={reviewItemBank} />
        ) : !teacherAuthed ? (
          <TeacherGate onUnlock={() => setTeacherAuthed(true)} />
        ) : (
          <TeacherView course={course} section={section} roster={roster} onRosterChange={setRoster} onLock={() => setTeacherAuthed(false)} itemBank={itemBank} onItemBankChange={setItemBank} />
        )}
      </div>
    </div>
  );
}
