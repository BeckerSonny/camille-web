import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import Navbar from "./navbar"

import tailwindCss from "./styles/tailwind.css"
import generalCss from "./styles/general.css"
import navbarCss from "./styles/navbar.css"

import { getUser } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({
  request,
}) => {
  const user = await getUser(request);

  const data: LoaderData = {
    user,
  };
  return json(data);
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Camille Fakche",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [
    { rel: "stylesheet", href: tailwindCss },
    { rel: "stylesheet", href: generalCss },
    { rel: "stylesheet", href: navbarCss},
  ]
}

export default function App() {

  const data = useLoaderData<LoaderData>();
  console.log('data in root ==> ', data)
  
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className='bg-gray-400'>
        <Navbar user={data.user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
