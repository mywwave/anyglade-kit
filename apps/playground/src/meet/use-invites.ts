import { useState } from "react";

export type InviteTerm = "hour" | "day" | "week" | "never";

export interface Invite {
  code: string;
  term: InviteTerm;
  /** `null` means the link works until it is reset. */
  expiresAt: number | null;
}

const STORAGE_KEY = "anyglade-meet-invites";
const HASH_PREFIX = "#invite/";
const HOUR_MS = 3600000;

const termLengths = { hour: HOUR_MS, day: 24 * HOUR_MS, week: 168 * HOUR_MS };

export const inviteTerms: { id: InviteTerm; label: string }[] = [
  { id: "hour", label: "1 hour" },
  { id: "day", label: "1 day" },
  { id: "week", label: "7 days" },
  { id: "never", label: "Never" },
];

const issue = (term: InviteTerm, code = crypto.randomUUID().slice(0, 8)): Invite => ({
  code,
  term,
  expiresAt: term === "never" ? null : Date.now() + termLengths[term],
});

const isExpired = ({ expiresAt }: Invite) => expiresAt !== null && expiresAt <= Date.now();

/** Storage stands in for a server: another tab of this browser can open the link. */
function readInvites(): Record<string, Invite> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, Invite>;
  } catch {
    return {};
  }
}

function writeInvites(invites: Record<string, Invite>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
  } catch {
    // Without storage the link still works in this tab until a reload.
  }
}

export const isInviteHash = (hash: string) => hash.startsWith(HASH_PREFIX);

export const inviteLink = (channelId: string, invite: Invite) =>
  `${location.origin}${location.pathname}${HASH_PREFIX}${channelId}/${invite.code}`;

/** The channel a link leads to, or `null` when the link no longer works. */
export function resolveInvite(hash: string) {
  const [channelId, code] = hash.slice(HASH_PREFIX.length).split("/");
  const invite = channelId ? readInvites()[channelId] : undefined;
  return invite && invite.code === code && !isExpired(invite) ? (channelId ?? null) : null;
}

export function useInvites() {
  const [invites, setInvites] = useState(readInvites);

  function save(channelId: string, invite: Invite) {
    const next = { ...invites, [channelId]: invite };
    writeInvites(next);
    setInvites(next);
  }

  return {
    invites,
    /** A channel gets its link when someone first asks for it. */
    ensure(channelId: string) {
      const invite = invites[channelId];
      if (!invite || isExpired(invite)) {
        save(channelId, issue("day"));
      }
    },
    /** The code stays, so a link that was already sent keeps working. */
    setTerm(channelId: string, term: InviteTerm) {
      save(channelId, issue(term, invites[channelId]?.code));
    },
    reset(channelId: string) {
      save(channelId, issue(invites[channelId]?.term ?? "day"));
    },
    restore(channelId: string, invite: Invite) {
      save(channelId, invite);
    },
  };
}
