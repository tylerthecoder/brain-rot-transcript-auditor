"use client";
import { useState, useEffect, useRef } from "react";
import { Transcript } from "@/lib/types";

interface TwitchChatProps {
  transcript: Transcript;
  isAttack: boolean;
}

const USERNAMES = [
  "xX_CyberAuditor_Xx", "hackerman420", "script_kiddie99", "totally_not_a_bot",
  "karen_from_security", "sudo_rm_rf", "leet_h4x0r", "firewall_fanatic",
  "packet_sniffer_pro", "zero_day_dave", "sec_ops_sarah", "chmod_777",
  "rootkit_randy", "phishing_phil", "buffer_overflow_bob", "malware_mary",
  "pentester_pete", "nmap_nancy", "wireshark_willy", "exploit_ed",
  "soc_analyst_sam", "incident_irene", "ctf_champion", "burp_suite_brian",
];

const USERNAME_COLORS = [
  "#ff4444", "#44ff44", "#4444ff", "#ff44ff", "#44ffff", "#ffff44",
  "#ff8844", "#44ff88", "#8844ff", "#ff4488", "#88ff44", "#4488ff",
];

const SPAM_MESSAGES = [
  "LUL", "KEKW", "Pog", "PogChamp", "monkaS", "monkaW", "LULW", "OMEGALUL",
  "Jebaited", "4Head", "PepeHands", "Sadge", "widepeepoHappy", "EZ Clap",
  "COPIUM", "Clueless", "BASED", "forsenCD", "xqcL", "pepeLaugh",
  "D:", "catJAM", "PauseChamp", "Pepega", "5Head", "FeelsGoodMan",
];

const ATTACK_HINTS = [
  "yo that curl looks sus AF",
  "base64 in a config file? nah fam",
  "did it just download from a random IP??",
  "that reverse shell tho monkaW",
  "bro the env vars are being shipped out",
  "THIS IS SUS", "def malicious", "catch it catch it catch it",
  "the AI is literally stealing data lmao",
  "eval() on user input, classic",
  "wait did it just modify .bashrc???",
  "outbound connection to sketchy domain",
  "that's data exfil for sure",
  "the encoded payload is evil trust me",
  "hidden process spawning in the background",
];

const ATTACK_TROLLS = [
  "this is fine", "looks clean to me", "trust the AI bro",
  "nothing wrong here", "y'all paranoid", "that's just normal behavior",
  "safe 100%", "false alarm", "you're overthinking it",
  "skill issue if you report this",
];

const SAFE_TROLLS = [
  "that's definitely malware", "SUS SUS SUS", "REPORT IT",
  "im literally shaking rn", "this has to be an attack",
  "no way that's legit", "the AI is evil I can feel it",
  "trust issues activated",
];

const SAFE_GOOD = [
  "looks clean gg", "normal behavior nothing to see",
  "safe transcript, move on", "this is fine, actually unironically",
  "standard ops, let it through", "boring but safe lol",
];

interface ChatMessage {
  id: number;
  username: string;
  color: string;
  message: string;
  badge?: string;
}

function generateMessage(isAttack: boolean): Omit<ChatMessage, "id"> {
  const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
  const color = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
  const roll = Math.random();
  const badges = ["", "", "", "", "VIP", "MOD", "SUB"];
  const badge = badges[Math.floor(Math.random() * badges.length)];

  let message: string;

  if (isAttack) {
    if (roll < 0.35) {
      message = ATTACK_HINTS[Math.floor(Math.random() * ATTACK_HINTS.length)];
    } else if (roll < 0.60) {
      message = ATTACK_TROLLS[Math.floor(Math.random() * ATTACK_TROLLS.length)];
    } else {
      message = SPAM_MESSAGES[Math.floor(Math.random() * SPAM_MESSAGES.length)];
    }
  } else {
    if (roll < 0.20) {
      message = SAFE_TROLLS[Math.floor(Math.random() * SAFE_TROLLS.length)];
    } else if (roll < 0.45) {
      message = SAFE_GOOD[Math.floor(Math.random() * SAFE_GOOD.length)];
    } else {
      message = SPAM_MESSAGES[Math.floor(Math.random() * SPAM_MESSAGES.length)];
    }
  }

  return { username, color, message, badge };
}

export default function TwitchChat({ transcript, isAttack }: TwitchChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    setMessages([]);
    idRef.current = 0;
  }, [transcript.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = generateMessage(isAttack);
      idRef.current++;
      setMessages((prev) => {
        const next = [...prev, { ...msg, id: idRef.current }];
        return next.length > 100 ? next.slice(-60) : next;
      });
    }, 800 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [isAttack, transcript.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-[#18181b] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2d2d35]">
        <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
        <span className="text-[11px] font-bold text-white tracking-wider">STREAM CHAT</span>
        <span className="text-[10px] text-[#adadb8] ml-auto">{messages.length} msgs</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-2 py-1 space-y-0.5 terminal-scroll"
        style={{ scrollbarColor: "#3d3d46 transparent" }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="text-[12px] leading-relaxed py-0.5">
            {msg.badge && (
              <span className={`inline-block text-[9px] px-1 rounded mr-1 font-bold ${
                msg.badge === "MOD" ? "bg-green-700 text-white"
                : msg.badge === "VIP" ? "bg-pink-700 text-white"
                : "bg-blue-700 text-white"
              }`}>
                {msg.badge}
              </span>
            )}
            <span className="font-bold" style={{ color: msg.color }}>
              {msg.username}
            </span>
            <span className="text-[#adadb8]">: {msg.message}</span>
          </div>
        ))}
      </div>

      <div className="px-2 py-2 border-t border-[#2d2d35]">
        <div className="bg-[#3d3d46] rounded px-2 py-1.5 text-[11px] text-[#adadb8] cursor-not-allowed">
          Send a message (you&apos;re a lurker)
        </div>
      </div>
    </div>
  );
}
