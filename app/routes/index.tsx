import { json, LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTimelineEvents } from "~/models/timelineEvents.server";

import { getUser } from "~/utils/session.server";

import timelineCss from "../styles/timeline.css"

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: timelineCss }];
};

import Timeline from './timeline'

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  timelineEvents: Awaited<ReturnType<typeof getTimelineEvents>>;
};

export const loader = async ({request}) => {
  return json<LoaderData>({
      user: await getUser(request),
      timelineEvents: await getTimelineEvents(),
    });
};

export default function Index() {
  const { timelineEvents, user } = useLoaderData();
  // console.log('timelineEvents in index ==> ', timelineEvents)
  return (
    <div className='my-4 mx-4'>
      <Timeline timelineEvents={timelineEvents} user={user} />
    </div>
  );
}
