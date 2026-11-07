import { Avatar, Box, Button, Text, TextSwap, tokens } from "@anyglade/kit";
import { PauseFill, PlayFill } from "@anyglade/kit/icons";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { simulateRequest } from "../../simulate.ts";

/** Length of the recording, in seconds of audio. */
const DURATION = 11;
const BAR_COUNT = 40;
const WAVE_HEIGHT = 28;
const SPEEDS = [
  { rate: 1, label: "1×" },
  { rate: 1.5, label: "1.5×" },
  { rate: 2, label: "2×" },
] as const;
const TRANSCRIPT =
  "Hey, I’m at the door of the coffee shop on Elm Street, and the window table is free. I’ll get you a flat white, no sugar. Come over when you’re done.";
/** One word of the transcript appears every so often, as if the text were being recognised. */
const WORD_STREAM_MS = 45;

interface Word {
  text: string;
  start: number;
  end: number;
}

/**
 * Lays the words along the recording: a word lasts as long as it has letters,
 * a comma is a short breath, the end of a sentence a longer one.
 */
function buildTimeline(): Word[] {
  const parts = TRANSCRIPT.split(" ");
  const lengths = parts.map((part) => part.replaceAll(/[,.!?]/g, "").length + 1.5);
  const pauses = parts.map((part) => {
    if (/[.!?]$/.test(part)) {
      return 7;
    }
    return part.endsWith(",") ? 3 : 0.4;
  });
  const lead = 4;
  const total = lead + lengths.reduce((sum, value, index) => sum + value + (pauses[index] ?? 0), 0);
  const scale = DURATION / total;
  let cursor = lead;
  return parts.map((text, index) => {
    const start = cursor * scale;
    cursor += lengths[index] ?? 0;
    const end = cursor * scale;
    cursor += pauses[index] ?? 0;
    return { text, start, end };
  });
}

/** A fixed seed: the same recording draws the same wave on every render and in every theme. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1_103_515_245 + 12_345) % 2_147_483_648;
    return state / 2_147_483_648;
  };
}

/** The wave follows the speech: loud inside words, near silence in the pauses between sentences. */
function buildBars(words: readonly Word[]): number[] {
  const random = seeded(41);
  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const time = ((index + 0.5) / BAR_COUNT) * DURATION;
    const word = words.find((item) => time >= item.start - 0.05 && time <= item.end + 0.05);
    if (!word) {
      return 4;
    }
    const phase = Math.min(Math.max((time - word.start) / (word.end - word.start), 0), 1);
    const loudness = 0.3 + 0.7 * Math.sin(Math.PI * phase) ** 0.5 * (0.5 + 0.5 * random());
    return Math.max(4, Math.round(loudness * WAVE_HEIGHT));
  });
}

const WORDS = buildTimeline();
const BARS = buildBars(WORDS);

const clock = (seconds: number) => {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

const isReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The last word that has started by this moment, or -1 before the first one. */
const spokenUpTo = (time: number) => WORDS.findLastIndex((word) => word.start <= time);

function Bars({ isPlayed }: { isPlayed: boolean }) {
  return (
    <Box alignItems="center" gap="2xs" width="100%" height="100%">
      {BARS.map((height, index) => (
        <Box
          key={index}
          flexGrow={1}
          flexBasis={0}
          height={height}
          borderRadius="full"
          backgroundColor={isPlayed ? "background-inverse" : "background-emphasis"}
        />
      ))}
    </Box>
  );
}

type Transcript = "hidden" | "streaming" | "shown";

export function VoiceNoteBlock() {
  /** Where the playhead is, in seconds of audio. Kept out of state: it moves every frame. */
  const position = useRef(0);
  const isScrubbingRef = useRef(false);
  const glides = useRef<Animation[]>([]);
  const fillWindow = useRef<HTMLDivElement>(null);
  const fillContent = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [second, setSecond] = useState(0);
  const [remaining, setRemaining] = useState(clock(DURATION));
  const [wordIndex, setWordIndex] = useState(-1);
  const [isStarted, setIsStarted] = useState(false);
  const [isHeard, setIsHeard] = useState(false);
  const [transcript, setTranscript] = useState<Transcript>("hidden");
  const [revealed, setRevealed] = useState(0);
  const [isTranscribed, setIsTranscribed] = useState(false);

  const speed = SPEEDS[speedIndex] ?? SPEEDS[0];

  /** Moves the played colour to the playhead: a window and its content slide in opposite ways. */
  function paint(share = position.current / DURATION) {
    for (const glide of glides.current) {
      glide.cancel();
    }
    glides.current = [];
    if (fillWindow.current && fillContent.current) {
      fillWindow.current.style.transform = `translateX(${(share - 1) * 100}%)`;
      fillContent.current.style.transform = `translateX(${(1 - share) * 100}%)`;
    }
  }

  /** Only what a person can read goes through React: whole seconds and whole words. */
  function sync(rate: number = speed.rate) {
    const time = position.current;
    setSecond(Math.floor(time));
    setRemaining(clock((DURATION - time) / rate));
    setWordIndex(spokenUpTo(time));
  }

  function seek(time: number) {
    position.current = Math.min(Math.max(time, 0), DURATION);
    setIsStarted(true);
    paint();
    sync();
  }

  /** After the end the played colour drains back to the start, so the next play begins there. */
  function rewind() {
    const from = position.current / DURATION;
    position.current = 0;
    paint();
    sync();
    if (isReducedMotion() || !fillWindow.current || !fillContent.current) {
      return;
    }
    const timing = {
      duration: Number.parseFloat(tokens.durations.slower),
      easing: tokens.easings.standard,
    };
    glides.current = [
      fillWindow.current.animate(
        [{ transform: `translateX(${(from - 1) * 100}%)` }, { transform: "translateX(-100%)" }],
        timing,
      ),
      fillContent.current.animate(
        [{ transform: `translateX(${(1 - from) * 100}%)` }, { transform: "translateX(100%)" }],
        timing,
      ),
    ];
  }

  useLayoutEffect(() => {
    paint(0);
    // The fill is placed once before the first paint; later it moves with the playhead.
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    // Frame state lives in one object: the loop updates it between renders.
    const loop: { last: number | null; frame: number } = { last: null, frame: 0 };
    loop.frame = requestAnimationFrame(function tick(now) {
      if (!isScrubbingRef.current && loop.last !== null) {
        position.current = Math.min(
          position.current + ((now - loop.last) / 1000) * speed.rate,
          DURATION,
        );
      }
      loop.last = now;
      if (position.current >= DURATION) {
        setIsPlaying(false);
        setIsHeard(true);
        rewind();
        return;
      }
      paint();
      sync();
      loop.frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(loop.frame);
    // paint, sync and rewind only touch refs and setters.
  }, [isPlaying, speed.rate]);

  useEffect(() => {
    if (transcript !== "streaming") {
      return undefined;
    }
    const timer = setInterval(() => {
      setRevealed((count) => {
        if (count + 1 >= WORDS.length) {
          setTranscript("shown");
        }
        return Math.min(count + 1, WORDS.length);
      });
    }, WORD_STREAM_MS);
    return () => clearInterval(timer);
  }, [transcript]);

  function togglePlay() {
    if (!isPlaying && position.current >= DURATION) {
      position.current = 0;
    }
    setIsStarted(true);
    setIsPlaying(!isPlaying);
  }

  function cycleSpeed() {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    sync(SPEEDS[next]?.rate);
  }

  function timeAt(clientX: number) {
    const rect = wave.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      return position.current;
    }
    return ((clientX - rect.left) / rect.width) * DURATION;
  }

  function startScrub(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    isScrubbingRef.current = true;
    setIsScrubbing(true);
    seek(timeAt(event.clientX));
  }

  function moveScrub(event: PointerEvent<HTMLDivElement>) {
    if (isScrubbingRef.current) {
      seek(timeAt(event.clientX));
    }
  }

  function endScrub() {
    isScrubbingRef.current = false;
    setIsScrubbing(false);
  }

  function listenFrom(index: number) {
    const word = WORDS[index];
    if (!word) {
      return;
    }
    seek(word.start);
    setIsPlaying(true);
  }

  async function toggleTranscript() {
    if (transcript !== "hidden") {
      setTranscript("hidden");
      return;
    }
    if (isTranscribed) {
      setRevealed(WORDS.length);
      setTranscript("shown");
      return;
    }
    await simulateRequest(900);
    setIsTranscribed(true);
    setRevealed(0);
    setTranscript("streaming");
  }

  const isLifted = isScrubbing && !isReducedMotion();

  return (
    <Box alignItems="end" gap="s" width="100%" maxWidth={320}>
      <Box flexShrink={0}>
        <Avatar size="sm">
          <Avatar.Image alt="" src="https://i.pravatar.cc/80?img=5" />
          <Avatar.Fallback>VC</Avatar.Fallback>
        </Avatar>
      </Box>
      <Box flexDirection="column" gap="xs" flexGrow={1} minWidth={0}>
        <Box paddingHorizontal="m">
          <Text variant="caption" color="muted">
            Vera Cole
          </Text>
        </Box>
        <Box
          flexDirection="column"
          gap="s"
          paddingTop="m"
          paddingHorizontal="m"
          paddingBottom="s"
          backgroundColor="background-panel"
          borderRadius="l"
        >
          <Box alignItems="center" gap="m">
            <Button isIconOnly aria-label={isPlaying ? "Pause" : "Play"} onPress={togglePlay}>
              <Box key={String(isPlaying)} as="span" display="inline-flex" motion="pop">
                {isPlaying ? <PauseFill /> : <PlayFill />}
              </Box>
            </Button>
            <Box flexDirection="column" gap="xs" flexGrow={1} minWidth={0}>
              <Box
                ref={(element: HTMLDivElement | null) => {
                  wave.current = element;
                  if (element) {
                    // Horizontal drags scrub the recording, vertical ones still scroll the page.
                    element.style.touchAction = "pan-y";
                  }
                }}
                position="relative"
                height={WAVE_HEIGHT}
                cursor="pointer"
                userSelect="none"
                transform={
                  isLifted ? "scaleY(1.2)" : { base: "scaleY(1)", focusWithin: "scaleY(1.2)" }
                }
                transitionProperty="transform"
                transitionDuration="fast"
                ease="decelerate"
                onPointerCancel={endScrub}
                onPointerDown={startScrub}
                onPointerMove={moveScrub}
                onPointerUp={endScrub}
              >
                <Bars isPlayed={false} />
                <Box
                  ref={fillWindow}
                  position="absolute"
                  inset={0}
                  overflow="hidden"
                  // Parked off to the left, it would cover the play button and swallow its presses.
                  pointerEvents="none"
                  transform="translateX(-100%)"
                >
                  <Box ref={fillContent} width="100%" height="100%" transform="translateX(100%)">
                    <Bars isPlayed />
                  </Box>
                </Box>
                {/* The keyboard and screen readers seek with a native slider; the pointer seeks on the wave. */}
                <Box
                  position="absolute"
                  inset={0}
                  overflow="hidden"
                  opacity={0}
                  pointerEvents="none"
                >
                  <input
                    aria-label="Position in the voice message"
                    aria-valuetext={`${clock(second)} of ${clock(DURATION)}`}
                    max={DURATION}
                    min={0}
                    step={1}
                    type="range"
                    value={second}
                    onChange={(event) => seek(Number(event.currentTarget.value))}
                  />
                </Box>
              </Box>
              <Box alignItems="center" gap="s">
                <Text variant="caption" color="muted" tabularNums>
                  {remaining}
                </Text>
                {isHeard ? (
                  <Box display="block" motion="fade">
                    <Text variant="caption" color="subtle">
                      Played
                    </Text>
                  </Box>
                ) : null}
                {!isHeard && !isStarted ? (
                  <Box
                    width={6}
                    height={6}
                    borderRadius="full"
                    backgroundColor="background-emphasis"
                    aria-hidden
                  />
                ) : null}
              </Box>
            </Box>
          </Box>

          {transcript === "hidden" ? null : (
            <Box display="block" motion="fade">
              <Text as="p">
                {WORDS.slice(0, revealed).map((word, index) => (
                  <Fragment key={index}>
                    <Box
                      as="span"
                      color={index <= wordIndex ? "text-primary" : "text-secondary"}
                      cursor="pointer"
                      transitionProperty="colors"
                      transitionDuration="base"
                      motion={transcript === "streaming" ? "fade" : undefined}
                      onClick={() => listenFrom(index)}
                    >
                      {word.text}
                    </Box>{" "}
                  </Fragment>
                ))}
              </Text>
            </Box>
          )}

          <Box alignItems="center" justifyContent="between" gap="s">
            <Box alignItems="center" gap="xs" marginLeft="-xs">
              <Button
                size="sm"
                variant="secondary"
                aria-label={`Speed ${speed.label}`}
                onPress={cycleSpeed}
              >
                <TextSwap text={speed.label} />
              </Button>
              <Button size="sm" variant="ghost" onPress={toggleTranscript}>
                <TextSwap text={transcript === "hidden" ? "Transcribe" : "Hide text"} />
              </Button>
            </Box>
            <Text variant="caption" color="subtle" tabularNums>
              6:42 PM
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

VoiceNoteBlock.displayName = "Voice message";
