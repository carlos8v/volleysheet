import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import { Page } from "@/components/Page";
import { signIn } from "next-auth/react";

import { getServerAuthSession } from "@volleysheet/auth";
import { db, eq } from "@volleysheet/db";
import * as schema from "@volleysheet/db/schema";

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user?.id) {
    const [userExists] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.user.id))
      .limit(1);

    if (userExists?.id) {
      return {
        redirect: {
          destination: "/score",
        },
        props: {},
      };
    }
  }

  return {
    props: {},
  };
};

export default function SignIn() {
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password) return;

    await signIn("credentials", {
      password,
    });
  }

  return (
    <Page>
      <Page.Title />
      <Page.Portal>
        <Page.Main>
          <Page.Content className="mx-auto h-fit max-w-2xl flex-col rounded bg-zinc-900 p-4">
            <form onSubmit={handleSignIn}>
              <fieldset className="mb-4 flex w-full flex-col">
                <label htmlFor="password" className="mb-1 text-zinc-200">
                  Senha secreta:
                </label>
                <input
                  required
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  id="password"
                  type="password"
                  name="password"
                  className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1"
                />
              </fieldset>
              <button
                type="submit"
                className="w-full cursor-pointer rounded bg-zinc-950 px-2 py-3 text-center font-medium text-white transition hover:bg-white hover:text-zinc-950"
              >
                Entrar
              </button>
            </form>
          </Page.Content>
        </Page.Main>
      </Page.Portal>
    </Page>
  );
}
