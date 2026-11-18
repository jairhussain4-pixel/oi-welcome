import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CosmicShell } from "../components/CosmicShell";

export const Route = createFileRoute("/reading")({
  component: ReadingPage,
});

const vturbId = "vid-6ae8d8bab850e26f93ec425d";
const vturbScriptSrc =
  "https://scripts.converteai.net/b19b3a18-f0ae-4145-b71e-287227ee922b/players/6ae8d8bab850e26f93ec425d/v4/player.js";

function VTurbPlayer() {
  useEffect(() => {
    if (document.querySelector(`script[src="${vturbScriptSrc}"]`)) return;
    const script = document.createElement("script");
    script.src = vturbScriptSrc;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full">
      <div
        dangerouslySetInnerHTML={{
          __html: `<vturb-smartplayer id="${vturbId}" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"><div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 133.33333333333331% 0 0; z-index: 0; background-color: black;"></div></vturb-smartplayer>`,
        }}
      />
    </div>
  );
}

interface CommentUser {
  name: string;
  avatar: string;
}

const users: Record<string, CommentUser> = {
  jessica: { name: "Jessica M.", avatar: "/assets/avatar-jessica.jpg" },
  patricia: { name: "Patricia L.", avatar: "/assets/avatar-patricia.jpg" },
  marcus: { name: "Marcus T.", avatar: "/assets/avatar-marcus.jpg" },
  samantha: { name: "Samantha R.", avatar: "/assets/avatar-samantha.jpg" },
  robert: { name: "Robert K.", avatar: "/assets/avatar-robert.jpg" },
};

interface CommentItem {
  by: string;
  ago: string;
  likes: number;
  text: string;
  replies?: CommentItem[];
}

const comments: CommentItem[] = [
  {
    by: "jessica",
    ago: "2 days ago",
    likes: 47,
    text: "I was SO skeptical but I did this reading last month because a friend dared me to 😅. The cards said a financial surprise was coming my way within 30 days. I literally laughed it off. Then 18 days later I got a call from my old job — they owed me back pay I didn't even know about. $2,300 just showed up. I'm shaking typing this.",
    replies: [
      {
        by: "patricia",
        ago: "2 days ago",
        likes: 23,
        text: "This is EXACTLY what happened to me! Mine said unexpected money from a past connection and I got a tax refund I forgot I filed for. They know things 🔮",
      },
      {
        by: "jessica",
        ago: "1 day ago",
        likes: 11,
        text: "Right?? I keep telling people and they don't believe me lol. The cards don't lie 📜✨",
      },
    ],
  },
  {
    by: "marcus",
    ago: "4 days ago",
    likes: 61,
    text: "Not a spiritual person at all, my wife made me do this. The reading said I had been ignoring a health sign my body was giving me and that I needed to pay attention to it urgently. I honestly almost skipped that part. Two weeks later I went to the doctor for something unrelated and they found early stage something in my bloodwork. Caught it early because of that visit. I don't know what to believe anymore but I'm grateful.",
    replies: [
      {
        by: "samantha",
        ago: "3 days ago",
        likes: 38,
        text: "Marcus I got chills reading this. So glad you went to the doctor. These readings have a way of nudging us toward what we need to hear 🙏",
      },
      {
        by: "robert",
        ago: "3 days ago",
        likes: 19,
        text: "Man. This hits different. Mine also flagged something about my health that I'd been ignoring. Made an appointment after my reading. Turned out to be nothing serious but I wouldn't have gone otherwise.",
      },
      {
        by: "marcus",
        ago: "2 days ago",
        likes: 14,
        text: "Thanks everyone. Still processing it all honestly. Just grateful I paid attention.",
      },
    ],
  },
  {
    by: "samantha",
    ago: "6 days ago",
    likes: 89,
    text: "The Wheel of Fortune card came up in my reading and it said a stalled situation in my love life was about to shift dramatically. I had been talking to someone on and off for 2 years with no progress. I almost gave up. A week after my reading he texted me out of nowhere and asked me to meet. We've been together 3 weeks now and it feels different this time. I'm not jinxing it but... 🥰",
    replies: [
      {
        by: "patricia",
        ago: "5 days ago",
        likes: 31,
        text: "SAMANTHA. I'm crying for you!! Keep us updated please 🥹",
      },
      {
        by: "samantha",
        ago: "2 days ago",
        likes: 44,
        text: "Update: still going strong ✨ I come back to this page to remind myself to trust the process lol",
      },
    ],
  },
  {
    by: "patricia",
    ago: "1 week ago",
    likes: 52,
    text: "I've done a lot of readings over the years but this one was different. It pinpointed the exact block in my finances — it said I had been self-sabotaging opportunities out of fear without realizing it. That hit me HARD because it was 100% true. I started saying yes to things I used to decline. Within weeks I landed a freelance contract that doubled my income. The shift was internal first, then external. Powerful.",
    replies: [
      {
        by: "jessica",
        ago: "6 days ago",
        likes: 17,
        text: "Patricia this is what I needed to read today. The internal shift before the external one. Going to sit with that. Thank you 🤍",
      },
    ],
  },
  {
    by: "robert",
    ago: "1 week ago",
    likes: 34,
    text: "My reading said that a person from my past would re-enter my life and bring either a great opportunity or a lesson depending on how I handled it. My old business partner reached out about a new project. I approached it differently than I would have before — set clear boundaries, got everything in writing. We launched last month. Early numbers are really promising. I think this time it's the opportunity, not the lesson 😏",
    replies: [
      {
        by: "marcus",
        ago: "6 days ago",
        likes: 12,
        text: "Love this Robert. Rooting for you man. The cards giving us strategy not just predictions 👊",
      },
    ],
  },
];

function ReadingPage() {
  return (
    <CosmicShell widthClassName="max-w-[672px]">
      <h1 className="mt-9 text-center font-display text-[2.4rem] font-medium leading-[1.15] text-gold sm:text-[3.1rem]">
        Your 2026 Reading
        <br />
        Has Been Revealed
      </h1>

      <div className="mt-12 w-full max-w-[400px]">
        <VTurbPlayer />
      </div>

      <div className="mt-16 flex w-full items-center gap-4">
        <span className="h-px flex-1 bg-foreground/15" />
        <h2 className="font-display text-[15px] uppercase tracking-[0.3em] text-gold">
          What other people are saying
        </h2>
        <span className="h-px flex-1 bg-foreground/15" />
      </div>

      <div className="mt-8 flex w-full flex-col gap-8">
        {comments.map((comment, i) => (
          <div key={i} className="flex flex-col gap-5">
            <CommentCard comment={comment} />
            {comment.replies?.map((reply, j) => (
              <div key={j} className="pl-8">
                <CommentCard comment={reply} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </CosmicShell>
  );
}

function CommentCard({ comment }: { comment: CommentItem }) {
  const user = users[comment.by] || { name: comment.by, avatar: "/assets/avatar-jessica.jpg" };
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="font-display text-xl text-foreground">{user.name}</span>
      </div>
      <div className="ml-[52px] mt-1">
        <p className="border border-foreground/[0.07] bg-foreground/[0.03] px-4 py-3.5 text-base leading-[1.65] text-foreground/85">
          {comment.text}
        </p>
        <div className="mt-2.5 flex items-center gap-4 text-sm text-foreground/55">
          <span>{comment.ago}</span>
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            className={`font-medium hover:text-gold cursor-pointer ${
              liked ? "text-gold" : "text-foreground/70"
            }`}
          >
            Like
          </button>
          <button type="button" className="font-medium text-foreground/70 hover:text-gold cursor-pointer">
            Reply
          </button>
          <span className="ml-auto flex items-center gap-1.5 text-gold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-[10px]">
              ❤️
            </span>
            {comment.likes + (liked ? 1 : 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
