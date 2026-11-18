import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, Fragment } from "react";
import { CosmicShell, GoldButton } from "../components/CosmicShell";
import { QuestionVideoPlayer } from "../components/QuestionVideoPlayer";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

export interface Question {
  id: string;
  videoUrl?: string; // Insira aqui a URL do vídeo de cada pergunta (ex: "/assets/videos/pergunta1.mp4" ou link de CDN/VTurb)
  posterUrl?: string;
  simulatedDurationSeconds?: number;
  kicker?: string;
  lead?: string;
  title: [string, boolean?][];
  options: { emoji?: string; text: string }[];
}

// Configuração de cada vídeo e pergunta individual da VSL
export const questions: Question[] = [
  {
    id: "pergunta-1",
    videoUrl: "", // URL do vídeo da modelo para a pergunta 1
    posterUrl: "/assets/reader-portrait.jpg",
    simulatedDurationSeconds: 5,
    title: [
      ["Which of these sentences feels\nlike it was "],
      ["written about you", true],
      ["?"],
    ],
    options: [
      { emoji: "😮‍💨", text: "My life feels stuck, even though I'm doing everything right." },
      { emoji: "😔", text: "I have everything to be happy, yet I still feel empty inside." },
      { emoji: "🫥", text: "I'm facing an important decision and I don't know which path to take." },
      { emoji: "😯", text: "I feel something big is about to change, but I don't know what." },
    ],
  },
  {
    id: "pergunta-2",
    videoUrl: "", // URL do vídeo da modelo para a pergunta 2
    posterUrl: "/assets/reader-portrait.jpg",
    simulatedDurationSeconds: 5,
    title: [
      ["When you think about "],
      ["your relationships", true],
      ["...\nwhich sentence describes what you feel best?"],
    ],
    options: [
      { emoji: "💔", text: "I give everything to people, but when I need someone... I'm alone." },
      { emoji: "😥", text: "I feel like I carry it all while everyone else moves forward." },
      { emoji: "😢", text: "I've given so much of myself that I no longer know what's left for me." },
      { emoji: "🥺", text: "I feel my love, my effort and my energy are never enough." },
    ],
  },
  {
    id: "pergunta-3",
    videoUrl: "", // URL do vídeo da modelo para a pergunta 3
    posterUrl: "/assets/reader-portrait.jpg",
    simulatedDurationSeconds: 5,
    title: [
      ["If 2026 could bring "],
      ["one real\ntransformation", true],
      [" into your life,\nwhich would mean the most to you?"],
    ],
    options: [
      { text: "Finally escaping financial pressure and building real stability" },
      { text: "Meeting the right person for me — a love that truly lasts" },
      { text: "Waking up at peace with myself, without the constant noise in my head" },
      { text: "Discovering my purpose — where I belong and what I came here to do" },
    ],
  },
  {
    id: "pergunta-4",
    videoUrl: "", // URL do vídeo da modelo para a pergunta 4
    posterUrl: "/assets/reader-portrait.jpg",
    simulatedDurationSeconds: 5,
    title: [
      [
        "Has this happened to you? You look around\nand everyone seems to be moving forward...\nwhile you feel ",
      ],
      ["stuck in the same place", true],
      ["."],
    ],
    options: [
      { text: "Yes — that describes exactly where I am right now" },
      { text: "Sometimes, but I tell myself it's just a rough phase" },
      { text: "I feel it, but I can't explain why" },
    ],
  },
  {
    id: "pergunta-5",
    videoUrl: "", // URL do vídeo da modelo para a pergunta 5
    posterUrl: "/assets/reader-portrait.jpg",
    simulatedDurationSeconds: 6,
    kicker: "(Last question before your reading)",
    lead: "If the cards revealed TODAY what is blocking your life and showed you the exact path to unlock it...",
    title: [["Would you be ready to follow that guidance?"]],
    options: [
      { emoji: "✅", text: "Yes, I'm ready to receive it." },
      { emoji: "😔", text: "Yes, but I'm afraid of being let down again." },
      { emoji: "🤔", text: "I don't know, it depends on what the cards say." },
    ],
  },
];

type QuizState =
  | { kind: "question"; index: number }
  | { kind: "loading" }
  | { kind: "intro" }
  | { kind: "deck" };

function QuizPage() {
  const [state, setState] = useState<QuizState>({ kind: "question", index: 0 });
  const [isFading, setIsFading] = useState(false);

  const transitionTo = (next: QuizState) => {
    setIsFading(true);
    setTimeout(() => {
      setState(next);
      setIsFading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350);
  };

  return (
    <CosmicShell>
      <div className={`flex w-full flex-col items-center ${isFading ? "fade-out" : ""}`}>
        {state.kind === "question" && (
          <QuestionStep
            key={`q${state.index}`}
            index={state.index}
            question={questions[state.index]}
            totalQuestions={questions.length}
            onAnswer={() =>
              transitionTo(
                state.index + 1 < questions.length
                  ? { kind: "question", index: state.index + 1 }
                  : { kind: "loading" }
              )
            }
          />
        )}
        {state.kind === "loading" && (
          <LoadingStep key="loading" onDone={() => transitionTo({ kind: "intro" })} />
        )}
        {state.kind === "intro" && (
          <IntroStep key="intro" onContinue={() => transitionTo({ kind: "deck" })} />
        )}
        {state.kind === "deck" && <DeckStep key="deck" />}
      </div>
    </CosmicShell>
  );
}

function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`w-full max-w-[632px] ${className}`}>
      <div className="mb-2 text-right font-display text-xl text-gold">{value}%</div>
      <div className="relative h-px w-full bg-foreground/15">
        <div
          className="absolute left-0 bg-gold shadow-[0_0_8px_var(--gold)]"
          style={{ width: `${value}%`, height: 2, top: -0.5 }}
        />
      </div>
    </div>
  );
}

function QuestionStep({
  index,
  question,
  totalQuestions,
  onAnswer,
}: {
  index: number;
  question: Question;
  totalQuestions: number;
  onAnswer: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleVideoFinished = () => {
    setIsRevealed(true);
    // Smoothly scroll down so options are visible on smaller mobile devices
    setTimeout(() => {
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
  };

  const handleSelect = (optIndex: number) => {
    if (selected === null) {
      setSelected(optIndex);
      setTimeout(onAnswer, 650);
    }
  };

  const progress = Math.round(((index + 1) / 7) * 100);

  return (
    <>
      <ProgressBar value={progress} className="mt-12" />

      <div className="fade-in flex w-full flex-col items-center">
        {/* VSL Interactive Video Player for each specific question */}
        <QuestionVideoPlayer
          videoUrl={question.videoUrl}
          posterUrl={question.posterUrl}
          questionNumber={index + 1}
          totalQuestions={totalQuestions}
          simulatedDurationSeconds={question.simulatedDurationSeconds}
          onVideoEnd={handleVideoFinished}
          isRevealed={isRevealed}
          onSkip={handleVideoFinished}
        />

        {/* Dynamic Question Title and Options: only reveals when video finishes */}
        <div ref={optionsRef} className="w-full max-w-[632px]">
          {isRevealed ? (
            <div className="rise-in mt-8 flex flex-col items-center">
              {question.kicker && (
                <p className="text-center text-[13px] uppercase tracking-[0.3em] text-gold">
                  {question.kicker}
                </p>
              )}
              {question.lead && (
                <p className="mt-3 max-w-[520px] text-center text-base font-light leading-[1.8] text-foreground/75">
                  {question.lead}
                </p>
              )}
              <h1 className="mt-3 max-w-[632px] whitespace-pre-line text-center font-display text-[1.65rem] leading-[1.4] text-foreground sm:text-[1.95rem]">
                {question.title.map(([text, isGold], i) =>
                  isGold ? (
                    <span key={i} className="text-gold">
                      {text}
                    </span>
                  ) : (
                    <Fragment key={i}>{text}</Fragment>
                  )
                )}
              </h1>

              {/* Quadrados de resposta do quiz */}
              <div className="mt-8 grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2">
                {question.options.map((opt, i) => {
                  const isChosen = selected === i;
                  const isOther = selected !== null && !isChosen;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(i)}
                      className={`flex min-h-[92px] items-center gap-3.5 rounded-lg border bg-foreground/[0.03] p-4 text-left text-base text-foreground/90 transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                        isChosen
                          ? "border-gold/90 text-foreground shadow-option ring-1 ring-gold/40"
                          : "border-foreground/15 hover:border-gold/70 hover:bg-foreground/[0.06]"
                      } ${isOther ? "opacity-35" : "opacity-100"}`}
                    >
                      {opt.emoji && (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-background/80 text-[22px] shadow-sm">
                          {opt.emoji}
                        </span>
                      )}
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-foreground/50">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-ping rounded-full bg-gold/70" />
                Aguarde a modelo terminar de falar para desbloquear as respostas...
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LoadingStep({ onDone }: { onDone: () => void }) {
  const [val, setVal] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let animId: number;
    let timerId: any;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 4000);
      setVal(Math.round(p * 100));
      if (p < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        timerId = setTimeout(() => onDoneRef.current(), 400);
      }
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="fade-in flex w-full flex-col items-center">
      <ProgressBar value={val} className="mt-16" />
      <div className="mt-10 h-px w-40 bg-gold/20" />
      <p className="mt-16 text-center font-display text-[1.75rem] text-foreground/75">
        Tuning into your energy...
      </p>
    </div>
  );
}

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex w-full flex-col items-center">
      <ProgressBar value={100} className="mt-16" />
      <div className="mt-10 h-px w-40 bg-gold/20" />
      <div className="mt-14 flex max-w-[632px] flex-col gap-8 text-center font-display text-[1.3rem] leading-[1.9]">
        <p className="fade-in text-foreground" style={{ animationDelay: "0ms" }}>
          Based on everything you revealed to me...
        </p>
        <p className="fade-in text-foreground/70" style={{ animationDelay: "320ms" }}>
          The universe will filter thousands of possible combinations...
        </p>
        <p className="fade-in text-foreground" style={{ animationDelay: "640ms" }}>
          Down to the only <span className="text-gold">6 cards</span> able to speak directly to your
          energy in this exact moment.
        </p>
        <p className="fade-in text-foreground/70" style={{ animationDelay: "960ms" }}>
          Choose just <span className="text-gold">3</span> to discover the exact path that unlocks
          everything in <span className="text-gold">2026</span>.
        </p>
        <p className="fade-in text-[1.75rem] italic text-gold" style={{ animationDelay: "1280ms" }}>
          Get ready.
        </p>
      </div>
      <div
        className="fade-in mt-8 flex w-full justify-center"
        style={{ animationDelay: "1600ms" }}
      >
        <GoldButton reverse onClick={onContinue}>
          Choose my cards now
        </GoldButton>
      </div>
    </div>
  );
}

const cardNames = ["The Wheel of Fortune", "The Fool", "The Tower"];
const cardImages: Record<string, string> = {
  "The Wheel of Fortune": "/assets/card-wheel.jpg",
  "The Fool": "/assets/card-fool.jpg",
  "The Tower": "/assets/card-tower.jpg",
};

function DeckStep() {
  const navigate = useNavigate();
  const [chosen, setChosen] = useState<number[]>([]);
  const isDone = chosen.length === 3;

  const handlePick = (idx: number) => {
    if (isDone || chosen.includes(idx)) return;
    setChosen((prev) => [...prev, idx]);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <ProgressBar value={100} className="mt-12" />
      <div className="fade-in flex w-full flex-col items-center">
        <h1 className="mt-14 text-center font-display text-[2.15rem] text-gold">
          The deck is open for you
        </h1>
        <p className="mt-3 text-center font-display text-[1.45rem] italic text-foreground">
          Don't overthink it. <span className="text-gold">Just feel.</span>
        </p>
        <p className="mt-4 text-center text-base font-light text-foreground/70">
          Pick 3 cards, one at a time, in whatever order your instinct says:
        </p>
        <p className="mt-8 text-center text-sm uppercase tracking-[0.3em] text-gold">
          {chosen.length} of 3 cards chosen
        </p>

        <div className="mt-10 grid w-full max-w-[728px] grid-cols-3 gap-2.5 sm:gap-4">
          {Array.from({ length: 6 }).map((_, idx) => {
            const chosenOrder = chosen.indexOf(idx);
            const isFlipped = chosenOrder !== -1;
            const cardName = isFlipped ? cardNames[chosenOrder] : null;
            const dimmed = isDone && !isFlipped;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePick(idx)}
                disabled={isDone || isFlipped}
                aria-label={cardName ?? `Card ${idx + 1}`}
                data-flipped={isFlipped}
                className={`tarot-card relative aspect-[345/553] w-full transition-all duration-500 ${
                  dimmed ? "opacity-40" : "opacity-100"
                } ${!isDone && !isFlipped ? "cursor-pointer hover:-translate-y-1" : "cursor-default"}`}
              >
                <div className="tarot-card-inner">
                  <div className="tarot-face">
                    <img
                      src="/assets/card-back.jpg"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="tarot-face tarot-face-front border border-gold/80 shadow-gold-soft">
                    {cardName && (
                      <>
                        <img
                          src={cardImages[cardName]}
                          alt={cardName}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-background/70 py-1 text-center font-display text-[11px] text-foreground sm:text-sm">
                          {cardName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {isFlipped && (
                  <span className="absolute left-1/2 top-0 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-b-full bg-gold text-[11px] font-semibold text-primary-foreground">
                    {chosenOrder + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isDone ? (
          <GoldButton
            className="fade-in mt-10"
            onClick={() => navigate({ to: "/reading" })}
          >
            See my reading result
          </GoldButton>
        ) : (
          <p className="mt-10 text-center text-[15px] uppercase tracking-[0.25em] text-foreground/60">
            Tap the cards that call you
          </p>
        )}
      </div>
    </div>
  );
}
