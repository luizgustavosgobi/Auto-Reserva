export function getToken() {
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
      return;
    }
  } catch (error) {
    console.log(error);
    window.location.assign("/sign-in");
  }
  return token;
}

const logOutUser = () => {
  eraseCookie("token");
  window.location.assign("/sign-in");
}

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
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Max-Age=-99999999; path=/;";
}

export async function validateToken() {
  const token = getToken();

  if (!token) { return; }

  let payload;
  try {
    payload = parseToken(token);
  } catch (error) {
    console.log(error);
    logOutUser();
    return;
  }

  const now = new Date().getTime() / 1000;
  const tokenExpiration = new Date(parseInt(payload.exp) * 1000).getTime() / 1000;
  
  if (now > tokenExpiration) {
    logOutUser();
    return;
  }

  let response;
  try {
    response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/user/validate`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (error) {
    console.log(error);
    logOutUser();
    return;
  }

  if (!response.ok) {
    logOutUser();
    return;
  }

  return await response.json();
}