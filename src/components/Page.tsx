import Head from "next/head";
// import { Header } from "./Header";
// import { Sidebar } from "./Sidebar";
import { Fragment, type PropsWithChildren } from "react";

// import { Toaster } from "@server/components/ui/toaster";

/**
 * @component
 * @example
 * <Page>
 *  <Page.Title/>
 *  <Page.Portal>
 *    <Page.Header />
 *    <Page.Main>
 *      <Page.Sidebar />
 *      <Page.Content>
 *        <p>Hello World</p>
 *      </Page.Content>
 *    </Page.Main>
 *  </Page.Portal>
 * </Page>
 */
export function Page({ children }: React.PropsWithChildren) {
  return <Fragment>{children}</Fragment>;
}

Page.Title = function Title({ title }: { title?: string }) {
  return (
    <Head>
      <title>{title ? `VolleySheet | ${title}` : "VolleySheet"}</title>
      <meta
        name="description"
        content="Volleyball players stats open database"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

Page.Portal = function Portal({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      {children}
      {/* <Toaster /> */}
    </main>
  );
};

// Page.Header = Header;

Page.Main = function Main({ children }: PropsWithChildren) {
  return (
    <div className="mb-12 mt-8 flex w-full max-w-7xl flex-1 gap-24 px-4">
      {children}
    </div>
  );
};

Page.Content = function Content({
  className = "",
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`flex flex-1 flex-col ${className}`}>{children}</div>;
};

// Page.Sidebar = Sidebar;
