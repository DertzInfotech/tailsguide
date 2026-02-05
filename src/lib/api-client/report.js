export async function submitReport( requestOptions ) {
  try {
        const response = await fetch(
        "https://tailsguide-production-53f0.up.railway.app/api/v1/pet/report", requestOptions
        );
        if(response.ok){
          console.log("Pet reported successfully")
        }
        const result = await response.json();
        return ({response, result});
  } catch (error) {
    console.log(error);
  }
}