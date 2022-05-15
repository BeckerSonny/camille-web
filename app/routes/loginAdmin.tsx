import type {
    ActionFunction,
    LinksFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    useActionData,
    Link,
    useSearchParams,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { login, createUserSession } from "~/utils/session.server";

function validateUsername(username: unknown) {
    if (typeof username !== "string" || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== "string" || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

function validateUrl(url: any) {
    console.log(url);
    let urls = ["/"];
    if (urls.includes(url)) {
        return url;
    }
return "/";
}

type ActionData = {
    formError?: string;
    fieldErrors?: {
        username: string | undefined;
        password: string | undefined;
    };
    fields?: {
        username: string;
        password: string;
    };
};

const badRequest = (data: ActionData) =>
    json(data, { status: 400 });


export const action: ActionFunction = async ({request,}) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = validateUrl(
        form.get("redirectTo") || "/"
    );
    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof redirectTo !== "string"
    ) {
        return badRequest({
        formError: `Form not submitted correctly.`,
        });
    }
    
    const fields = { username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };
    if (Object.values(fieldErrors).some(Boolean))
        return badRequest({ fieldErrors, fields });

    const user = await login({ username, password });
    console.log({ user })
    if (!user) {
        return badRequest({
        fields,
        formError: `Username/Password combination is incorrect`,
        });
    }
    return createUserSession(user.id, redirectTo);
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  return (
    <div className="flex justify-center">
      <div className="content" data-light="">
        <h2 className='text-2xl text-blue font-semibold text-center'>Admin Login</h2>
        <form method="post" className="flex flex-col my-2 text-base text-blue font-medium">
            <input
                type="hidden"
                name="redirectTo"
                value={
                searchParams.get("redirectTo") ?? undefined
                }
            />
            <label htmlFor="username-input" className=''>Username</label>
            <input
                type="text"
                id="username-input"
                name="username"
                className="rounded px-2 invalid:border-red-500"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(
                    actionData?.fieldErrors?.username
                )}
                aria-errormessage={
                    actionData?.fieldErrors?.username
                    ? "username-error"
                    : undefined
                }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="text-red-600 text-sm"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
            <label htmlFor="password-input">Password</label>
            <input
                id="password-input"
                name="password"
                type="password"
                className="rounded px-2 invalid:border-red-500"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(
                    actionData?.fieldErrors?.password
                )}
                aria-errormessage={
                    actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
            />
            {actionData?.fieldErrors?.password ? (
                <p
                    className="text-red-600 text-sm"
                    role="alert"
                    id="password-error"
                >
                    {actionData.fieldErrors.password}
                </p>
                ) : null}
          <button type="submit" className="transition-all duration-1000 rounded border-blue border-2 font-semibold hover:text-gold hover:font-bold hover:bg-blue my-2">
            Connection
          </button>
        </form>
      </div>
    </div>
  );
}