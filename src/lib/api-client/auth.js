export async function signup( userData ) {
  try {
        const response = await fetch(
          "https://tailsguide-production-53f0.up.railway.app/api/v1/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );
        if(response.ok){
          console.log("User registered successfully")
        }
        const result = await response.json();
        return ({response, result});
  } catch (error) {
    console.log(error);
  }
}

export async function signin( userData ) {
  try {
        const response = await fetch(
          "https://tailsguide-production-53f0.up.railway.app/api/v1/auth/authenticate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );
        if(response.ok){
          console.log("User logged in successfully")
        }
        const result = await response.json();
        return ({response, result});
  } catch (error) {
    console.log(error);
  }
}