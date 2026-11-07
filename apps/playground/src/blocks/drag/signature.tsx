import { Box, Button, SignaturePad, Text, TextSwap, tokens } from "@anyglade/kit";
import { useEffect, useId, useRef, useState } from "react";
import { simulateRequest } from "../../simulate.ts";

const DAY = 24 * 60 * 60 * 1000;
/** The page date: the contract is drawn up on the day it is opened. */
const today = new Date();
const yesterday = new Date(today.getTime() - DAY);
const longDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const shortDate = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long" });
const stampDate = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const clauses = [
  "The contractor builds the website to the brief in Appendix 1.",
  "The fee is $4,800: 50% upfront on signing, the rest on acceptance.",
  "Delivery in 30 business days after the deposit. Revisions within 5 days.",
];

/** Height of `SignaturePad`, so the signed picture takes exactly its place. */
const PAD_HEIGHT = 160;
const STAMP_SIZE = 112;
const STAMP_TILT = "rotate(-12deg)";

const ms = (duration: string) => Number.parseFloat(duration);
const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The contractor signed yesterday: a quick hand, drawn once. */
function ContractorSignature() {
  return (
    <svg aria-hidden fill="none" height={36} viewBox="0 0 104 36" width={104}>
      <path
        d="M6 26c4-9 8-17 11-17 3 0-1 15 2 15s6-12 9-12-1 11 2 11 5-8 8-8c2 0 1 6 4 6 4 0 6-12 11-13 3 0 1 9 5 8 4-1 7-9 11-9 2 0 2 4 5 4 4 0 8-3 12-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
      />
      <path
        d="M14 31c20-3 46-4 76-2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.25}
      />
    </svg>
  );
}

/** A round company stamp: rings, the name along the edge, the word and the date inside. */
function Stamp({ date }: { date: string }) {
  const ring = useId();
  return (
    <svg aria-hidden fill="none" height={STAMP_SIZE} viewBox="0 0 112 112" width={STAMP_SIZE}>
      <defs>
        <path d="M56 56m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" id={ring} />
      </defs>
      <circle cx={56} cy={56} r={53} stroke="currentColor" strokeWidth={2.5} />
      <circle cx={56} cy={56} r={37} stroke="currentColor" strokeWidth={1} />
      <text fill="currentColor" fontSize={7.5} fontWeight={600} letterSpacing={1.2}>
        <textPath href={`#${ring}`}>VECTOR LLC • ELECTRONIC DOCUMENT •</textPath>
      </text>
      <text
        fill="currentColor"
        fontSize={8.5}
        fontWeight={700}
        letterSpacing={0.3}
        textAnchor="middle"
        x={56}
        y={55}
      >
        SIGNED
      </text>
      <text fill="currentColor" fontSize={7.5} fontWeight={500} textAnchor="middle" x={56} y={66}>
        {date}
      </text>
    </svg>
  );
}

export function SignatureBlock() {
  const [signature, setSignature] = useState<string | null>(null);
  const [signed, setSigned] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const paper = useRef<HTMLDivElement>(null);
  const stamp = useRef<HTMLDivElement>(null);

  // The stamp comes down onto the paper and the sheet gives a little under it.
  useEffect(() => {
    if (!signed || !stamp.current) {
      return;
    }
    if (isReducedMotion()) {
      stamp.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: ms(tokens.durations.base),
        easing: tokens.easings.standard,
      });
      return;
    }
    const press = ms(tokens.durations.slow);
    stamp.current.animate(
      [
        { opacity: 0, transform: "scale(1.5) rotate(-2deg)" },
        { opacity: 1, transform: `scale(0.96) ${STAMP_TILT}`, offset: 0.7 },
        { opacity: 1, transform: `scale(1) ${STAMP_TILT}` },
      ],
      { duration: press, easing: tokens.easings.decelerate },
    );
    paper.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(0.985)" }, { transform: "scale(1)" }],
      { duration: press, delay: press * 0.6, easing: tokens.easings.standard },
    );
  }, [signed]);

  async function sign() {
    await simulateRequest();
    setSigned(signature);
  }

  async function revoke() {
    const element = stamp.current;
    if (element) {
      const lift = isReducedMotion()
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { opacity: 1, transform: `scale(1) ${STAMP_TILT}` },
            { opacity: 0, transform: `scale(1.08) ${STAMP_TILT}` },
          ];
      await element.animate(lift, {
        duration: ms(tokens.durations.fast),
        easing: tokens.easings.accelerate,
        fill: "forwards",
      }).finished;
    }
    setSigned(null);
    setSignature(null);
    setRound(round + 1);
  }

  const status = signed
    ? "Signed by both parties"
    : signature
      ? "Signature ready"
      : "Awaiting your signature";

  return (
    <Box flexDirection="column" alignItems="center" gap="l" width="100%" maxWidth={300}>
      <Box
        ref={paper}
        position="relative"
        flexDirection="column"
        gap="l"
        width="100%"
        paddingHorizontal="xl"
        paddingTop="xl"
        backgroundColor="background-panel"
        borderRadius="l"
        boxShadow="l"
      >
        <Box flexDirection="column">
          <Text variant="title">Service agreement No. 48-S</Text>
          <Text variant="caption" color="muted">
            Austin, {longDate.format(today)}
          </Text>
        </Box>

        <Box as="ol" flexDirection="column" gap="xs">
          {clauses.map((clause, index) => (
            <Box key={clause} as="li" display="flex" gap="s">
              <Text variant="caption" color="subtle" tabularNums>
                {index + 1}.
              </Text>
              <Text variant="caption" color="muted">
                {clause}
              </Text>
            </Box>
          ))}
        </Box>

        <Box alignItems="end" justifyContent="between" gap="m">
          <Box flexDirection="column" minWidth={0}>
            <Text variant="caption" color="muted">
              Contractor
            </Text>
            <Text variant="caption">Vector LLC</Text>
            <Text variant="caption" color="muted">
              Alex Sawyer
            </Text>
          </Box>
          <Box flexDirection="column" alignItems="end" flexShrink={0}>
            <Box
              color="text-primary"
              borderBottomWidth={1}
              borderStyle="dashed"
              borderColor="border-control"
            >
              <ContractorSignature />
            </Box>
            <Text variant="caption" color="subtle">
              {shortDate.format(yesterday)}
            </Text>
          </Box>
        </Box>

        <Box flexDirection="column">
          <Box alignItems="end" justifyContent="between" gap="m">
            <Box flexDirection="column" minWidth={0}>
              <Text variant="caption" color="muted">
                Client
              </Text>
              <Text variant="caption">Olivia Moore</Text>
            </Box>
            {signed ? (
              <Box display="block" motion="fade">
                <Text variant="caption" color="subtle">
                  {shortDate.format(today)}
                </Text>
              </Box>
            ) : null}
          </Box>
          <Box display="block" marginHorizontal="-xl">
            {signed ? (
              <Box display="block" position="relative" height={PAD_HEIGHT}>
                <img alt="Client signature" height={PAD_HEIGHT} src={signed} width="100%" />
                <Box
                  position="absolute"
                  left={24}
                  right={24}
                  bottom={32}
                  borderBottomWidth={1}
                  borderStyle="dashed"
                  borderColor="border-control"
                />
              </Box>
            ) : (
              <SignaturePad
                key={round}
                clearLabel="Clear signature"
                label="Client signature"
                placeholder="Sign here"
                onChange={setSignature}
              />
            )}
          </Box>
        </Box>

        {signed ? (
          <Box
            ref={stamp}
            position="absolute"
            right={20}
            bottom={48}
            color="text-success"
            transform={STAMP_TILT}
            pointerEvents="none"
          >
            <Stamp date={stampDate.format(today)} />
          </Box>
        ) : null}
      </Box>

      <Text align="center" aria-live="polite" color={signed ? "success" : "muted"}>
        <TextSwap text={status} />
      </Text>

      <Box justifyContent="center" width="100%" minHeight={40}>
        {signed ? (
          <Box display="block" motion="fade">
            <Button variant="ghost" onPress={revoke}>
              Revoke signature
            </Button>
          </Box>
        ) : (
          <Button fullWidth isDisabled={!signature} onPress={sign}>
            Sign the agreement
          </Button>
        )}
      </Box>
    </Box>
  );
}

SignatureBlock.displayName = "Signature";
