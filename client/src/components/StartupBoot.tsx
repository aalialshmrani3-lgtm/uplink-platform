import React, { useCallback, useState, type ReactNode } from "react";
import { StartupSplash } from "./StartupSplash";

type StartupBootProps = { children: ReactNode };

/** Keeps the real application and its deep-link route intact under the boot overlay. */
export function StartupBoot({ children }: StartupBootProps) {
  const [ready, setReady] = useState(false);
  const complete = useCallback(() => setReady(true), []);

  return (
    <>
      <div aria-hidden={!ready} className={ready ? "startup-application startup-application--ready" : "startup-application"}>
        {children}
      </div>
      {!ready && <StartupSplash onComplete={complete} />}
    </>
  );
}
