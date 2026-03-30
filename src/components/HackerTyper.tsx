"use client";
import { useState, useEffect, useRef } from "react";

const SNIPPETS = [
  "root@kali:~# nmap -sV -O 192.168.1.0/24",
  "PORT     STATE SERVICE   VERSION",
  "22/tcp   open  ssh       OpenSSH 8.9",
  "80/tcp   open  http      nginx 1.18",
  "443/tcp  open  https     Apache 2.4",
  "3306/tcp open  mysql     MySQL 8.0",
  "SCANNING... TARGET ACQUIRED",
  "Injecting payload into buffer 0x7fff5fbff8c0",
  ">>> DECRYPTING RSA-4096 KEY <<<",
  "$ cat /etc/shadow | grep root",
  "ACCESS GRANTED - LEVEL 5 CLEARANCE",
  "Establishing reverse tunnel to 10.0.0.1:4444",
  "0x41414141 0xdeadbeef 0xcafebabe",
  "[*] Exploit completed, session opened",
  "Parsing 2,847 log entries...",
  "FIREWALL BYPASSED - INTRUSION DETECTED",
  "select * from users where admin=1;",
  "chmod 777 /var/www/html/backdoor.php",
  ">>> SIGNAL INTERCEPTED <<<",
  "Brute forcing... 147,392 attempts/sec",
  "MD5: d41d8cd98f00b204e9800998ecf8427e",
  "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3",
  "TRACE ROUTE: 14 hops, 47ms avg",
  "Decompiling binary... 67% complete",
  "WARNING: Stack buffer overflow detected",
  ">>> MAINFRAME CONNECTED <<<",
];

export default function HackerTyper() {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]];
        return next.length > 40 ? next.slice(-25) : next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[5] pointer-events-none overflow-hidden opacity-[0.07] font-mono text-accent-green text-[10px] leading-tight p-4"
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
