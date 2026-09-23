"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useTransition } from "react";
import { Html5Player } from "@/components/video-player/html5-player";
import { reportLessonProgress, markLessonComplete } from "@/actions/progress";

const MuxPlayerWrapper = dynamic(
  () => import("@/components/video-player/mux-player-wrapper").then((m) => m.MuxPlayerWrapper),
  { ssr: false },
);

const REPORT_INTERVAL_MS = 7000;

export function VideoPlayer({
  lessonId,
  courseSlug,
  provider,
  assetId,
  initialWatchedSeconds,
  durationSeconds,
  initialCompleted,
}: {
  lessonId: string;
  courseSlug: string;
  provider: "html5" | "mux";
  assetId: string;
  initialWatchedSeconds: number;
  durationSeconds: number;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const lastReportRef = useRef(0);
  const latestRef = useRef({ current: initialWatchedSeconds, duration: durationSeconds });

  const flush = useCallback(() => {
    const { current, duration } = latestRef.current;
    startTransition(async () => {
      const result = await reportLessonProgress({
        lessonId,
        watchedSeconds: current,
        durationSeconds: duration || durationSeconds,
        courseSlug,
      });
      if (result.ok && result.completed) setCompleted(true);
    });
  }, [lessonId, courseSlug, durationSeconds]);

  const handleTimeUpdate = useCallback(
    (current: number, duration: number) => {
      latestRef.current = { current, duration };
      const now = Date.now();
      if (now - lastReportRef.current >= REPORT_INTERVAL_MS) {
        lastReportRef.current = now;
        flush();
      }
    },
    [flush],
  );

  function handleEnded() {
    flush();
  }

  function handleMarkComplete() {
    setCompleted(true);
    startTransition(async () => {
      await markLessonComplete({ lessonId, courseSlug });
    });
  }

  return (
    <div>
      {provider === "mux" ? (
        <MuxPlayerWrapper
          playbackId={assetId}
          initialTime={initialWatchedSeconds}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      ) : (
        <Html5Player
          src={assetId}
          initialTime={initialWatchedSeconds}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleMarkComplete}
          disabled={completed || isPending}
          className="flex items-center gap-2 rounded-[8px] border border-border px-4 py-2 text-sm font-medium text-text-body hover:border-teal disabled:opacity-60"
        >
          {completed ? (
            <>
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <circle cx="10" cy="10" r="9" fill="var(--color-teal)" />
                <path
                  d="M6 10.5 L9 13.5 L14 7.5"
                  stroke="var(--color-bg)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Completed
            </>
          ) : (
            "Mark as complete"
          )}
        </button>
      </div>
    </div>
  );
}
