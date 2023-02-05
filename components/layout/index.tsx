import { FADE_IN_ANIMATION_SETTINGS, READ_PILOT_TOKEN } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import UserDropdown from "./user-dropdown";
import { useGoogleLogin } from "@react-oauth/google";
import { usePilotStore } from "@/lib/store";
import { googleLogin } from "service.ts/request";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const scrolled = useScroll(50);
  const { authToken, setAuthToken } = usePilotStore((state) => state);
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin({
          access_token: tokenResponse.access_token,
        });
        localStorage.setItem(READ_PILOT_TOKEN, res.data.access);
        setAuthToken(res.data.access);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <>
      <Meta {...meta} />
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.png"
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Read Pilot</p>
          </Link>
          <div className="flex items-center">
            <AnimatePresence>
              <motion.a
                className="mr-2 rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                href="https://twitter.com/Tisoga"
                target="_blank"
                {...FADE_IN_ANIMATION_SETTINGS}
              >
                Subscribe
              </motion.a>
              {!authToken ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  {...FADE_IN_ANIMATION_SETTINGS}
                  onClick={() => {
                    login();
                  }}
                >
                  Sign in
                </motion.button>
              ) : (
                <UserDropdown />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="text-gray-500">
          Powered by{" "}
          <a
            className="font-medium text-gray-800 underline transition-colors"
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
          &nbsp;and {""}
          <a
            className="font-medium text-gray-800 underline transition-colors"
            href="https://openai.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI
          </a>
        </p>
      </div>
    </>
  );
}
