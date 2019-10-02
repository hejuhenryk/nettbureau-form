import axios from 'axios';
// define and export fetching types
export const NotInitializedType = 'NotInitialized'
export const FetchingType = 'Fetching'
export const FetchedType = 'Fetched'
export const FailFetchedType = 'FailFetched'

export const NotInitialized = value => ({ type: NotInitializedType, value})
export const Fetching = value => ({ type: FetchingType, value})
export const Fetched = value => ({ type: FetchedType, value})
export const FailFetched = value => ({ type: FailFetchedType, value})

export const postData = data => {
    const cors = 'https://cors-anywhere.herokuapp.com/' // go around CORS
    const url = 'https://heksemel.no/case/submit.php' //   "Access-Control-Allow-Origin" needed on server side
    // const url = 'https://jsonplaceholder.typicode.com/posts' // Fake Online REST API for Testing and Prototyping
    const dataPlus = {...data, applicant: 'Marcin Sawczuk-Szymkiewicz'}
   
    return axios.post(`${cors}${url}`, dataPlus)
        .then( res => Fetched(res.data))
        .catch( error => FailFetched({...error}))
}
