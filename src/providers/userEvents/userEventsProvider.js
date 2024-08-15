// let userEvents = [];

// function loadUserEvents() {
//   const myHeaders = new Headers();
//   myHeaders.append('Accept', 'application/vnd.github+json');

//   const requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//     redirect: 'follow',
//   };

//   APIRequest(`https://api.github.com/users/${GitHubUsername}/events`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => console.log(result))
//     .catch((error) => console.error(error));
// }

// document.addEventListener('onAADLoaded', loadUserEvents);