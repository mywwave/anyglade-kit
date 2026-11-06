import { toast } from "@anyglade/kit";
import { useCallback, useEffect, useRef, useState } from "react";

export type ScreenMode = "text" | "motion";

export type CameraState =
  | { status: "off" }
  | { status: "starting" }
  | { status: "on"; stream: MediaStream };

export type ScreenState =
  | { status: "off" }
  | {
      status: "on";
      stream: MediaStream;
      mode: ScreenMode;
      /** The browser asks about sound in its own dialog, so a share may come without it. */
      hasSound: boolean;
      isSoundOn: boolean;
    };

const screenModes = {
  text: { width: 1920, height: 1080, frameRate: 5, contentHint: "text" },
  motion: { width: 1280, height: 720, frameRate: 30, contentHint: "motion" },
} as const;

const cameraErrors: Record<string, string> = {
  NotAllowedError: "Браузер не дал доступ к камере. Разрешите её в настройках сайта.",
  NotFoundError: "Камера не найдена. Подключите её и попробуйте снова.",
  NotReadableError: "Камера занята другой программой. Закройте её и попробуйте снова.",
};

const stopTracks = (stream: MediaStream | null) => {
  for (const track of stream?.getTracks() ?? []) {
    track.stop();
  }
};

function applyMode(track: MediaStreamTrack | undefined, mode: ScreenMode) {
  if (track) {
    const { contentHint, ...constraints } = screenModes[mode];
    track.contentHint = contentHint;
    return track.applyConstraints(constraints).catch(() => undefined);
  }
  return Promise.resolve();
}

/** Only the display dialog can start a share, and phones do not have one. */
export const canShareScreen = () => "getDisplayMedia" in (navigator.mediaDevices ?? {});

/** The real camera and screen of this device. The rest of the call is simulated. */
export function useLocalMedia() {
  const [camera, setCamera] = useState<CameraState>({ status: "off" });
  const [screen, setScreen] = useState<ScreenState>({ status: "off" });
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState<string | null>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);
  const cameraRequest = useRef(0);

  const stopCamera = useCallback(() => {
    cameraRequest.current += 1;
    stopTracks(cameraStream.current);
    cameraStream.current = null;
    setCamera({ status: "off" });
  }, []);

  const startCamera = useCallback(async (deviceId: string | null = null) => {
    const request = (cameraRequest.current += 1);
    setCamera({ status: "starting" });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      if (request !== cameraRequest.current) {
        stopTracks(stream);
        return;
      }
      stopTracks(cameraStream.current);
      cameraStream.current = stream;
      setCamera({ status: "on", stream });
      setCameraId(stream.getVideoTracks()[0]?.getSettings().deviceId ?? null);
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((device) => device.kind === "videoinput"));
    } catch (error) {
      if (request === cameraRequest.current) {
        setCamera({ status: "off" });
        const reason = error instanceof DOMException ? error.name : "";
        toast.danger(cameraErrors[reason] ?? "Не получилось включить камеру. Попробуйте снова.");
      }
    }
  }, []);

  const stopScreen = useCallback(() => {
    stopTracks(screenStream.current);
    screenStream.current = null;
    setScreen({ status: "off" });
  }, []);

  /** Resolves to false when the person closes the browser dialog: that is a choice, not an error. */
  const startScreen = useCallback(
    async (mode: ScreenMode = "text") => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const video = stream.getVideoTracks()[0];
        await applyMode(video, mode);
        stopTracks(screenStream.current);
        screenStream.current = stream;
        // The browser's own "stop sharing" bar ends the track without going through the app.
        video?.addEventListener("ended", () => {
          if (screenStream.current === stream) {
            stopScreen();
          }
        });
        const hasSound = stream.getAudioTracks().length > 0;
        setScreen({ status: "on", stream, mode, hasSound, isSoundOn: hasSound });
        return true;
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
          toast.danger("Не получилось начать показ. Попробуйте снова.");
        }
        return false;
      }
    },
    [stopScreen],
  );

  const setScreenMode = useCallback((mode: ScreenMode) => {
    void applyMode(screenStream.current?.getVideoTracks()[0], mode);
    setScreen((state) => (state.status === "on" ? { ...state, mode } : state));
  }, []);

  const setScreenSound = useCallback((isSoundOn: boolean) => {
    for (const track of screenStream.current?.getAudioTracks() ?? []) {
      track.enabled = isSoundOn;
    }
    setScreen((state) => (state.status === "on" ? { ...state, isSoundOn } : state));
  }, []);

  const toggleCamera = useCallback(() => {
    if (cameraStream.current) {
      stopCamera();
    } else {
      void startCamera(cameraId);
    }
  }, [cameraId, startCamera, stopCamera]);

  useEffect(
    () => () => {
      cameraRequest.current += 1;
      stopTracks(cameraStream.current);
      stopTracks(screenStream.current);
    },
    [],
  );

  return {
    camera,
    cameraId,
    cameras,
    screen,
    setScreenMode,
    setScreenSound,
    startCamera,
    startScreen,
    stopCamera,
    stopScreen,
    toggleCamera,
  };
}
