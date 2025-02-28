export function getToken() {
  if (typeof window === "undefined") return null;

  let token = "";
  try {
    const tokenItem = document.cookie
      .split(";")
      .find((item) => item.includes("token"));

    if (tokenItem) {
      token = tokenItem.split("=")[1];
    }

    if (!token) {
      window.location.assign("/sign-in");
      return null;
    }
  } catch (error) {
    console.log(error);
    window.location.assign("/sign-in");
  }
  return token;
}

export const logOutUser = () => {
  eraseCookie("token");
  window.location.assign("/sign-in");
};

function parseToken(token: string) {
  if (!token.includes(".")) {
    throw new Error("Invalid token");
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
}

export async function validateToken() {
  const token = getToken();

  if (!token) {
    return null;
  }

  let payload;
  try {
    payload = parseToken(token);
  } catch (error) {
    console.log(error);
    logOutUser();
    return null;
  }

  const now = new Date().getTime() / 1000;
  const tokenExpiration =
    new Date(parseInt(payload.exp) * 1000).getTime() / 1000;

  if (now > tokenExpiration) {
    logOutUser();
    return null;
  }

  let response;
  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/validate`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
    logOutUser();
    return null;
  }

  if (!response.ok) {
    logOutUser();
    return null;
  }

  return await response.json();
}
