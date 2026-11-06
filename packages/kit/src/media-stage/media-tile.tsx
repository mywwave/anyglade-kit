"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Text } from "../text/text.tsx";

export interface MediaTileProps {
  /** Who or what the tile shows. It stays readable over any picture. */
  name: string;
  /** The picture: `StreamVideo`, an image, or an avatar that stands in the middle. */
  children: ReactNode;
  /** `contain` shows a whole screen, `cover` fills the tile with a face. */
  fit?: "cover" | "contain";
  isSpeaking?: boolean;
  /** Short state icons next to the name. */
  status?: ReactNode;
  /** Buttons in the corner. Shown on hover and focus, always on touch. */
  actions?: ReactNode;
}

/** One participant or shared screen in a call. */
export function MediaTile({
  name,
  children,
  fit = "cover",
  isSpeaking = false,
  status,
  actions,
}: MediaTileProps) {
  return (
    <div className="ag-media-tile" data-fit={fit} data-speaking={isSpeaking ? "" : undefined}>
      {children}
      <span className="ag-media-tile__caption">
        <Text as="span" variant="caption" truncate>
          {name}
        </Text>
        {status}
      </span>
      {actions ? <div className="ag-media-tile__actions">{actions}</div> : null}
    </div>
  );
}

export interface StreamVideoProps {
  stream: MediaStream;
  /** Spoken name of the picture. */
  label: string;
  /** A person expects to see their own camera as a mirror. */
  isMirrored?: boolean;
}

/** A live picture. Sound stays off: your own voice must not come back to you. */
export function StreamVideo({ stream, label, isMirrored = false }: StreamVideoProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video.current) {
      video.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={video}
      autoPlay
      muted
      playsInline
      aria-label={label}
      data-mirrored={isMirrored ? "" : undefined}
    />
  );
}
