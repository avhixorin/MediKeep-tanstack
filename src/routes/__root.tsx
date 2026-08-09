import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import {
  TanStackRouterDevtoolsPanel,
} from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "@/styles/styles.css?url";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { ThemeProvider } from "next-themes";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MediKeep",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: RootComponent,

  shellComponent: RootDocument,
});

function RootComponent() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >
      <AuthInitializer>
        <Outlet />
      </AuthInitializer>
    </ThemeProvider>
  );
}

function RootDocument({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>

      <body>
        {children}

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: (
                <TanStackRouterDevtoolsPanel />
              ),
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  );
}