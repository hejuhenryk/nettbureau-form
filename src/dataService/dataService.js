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
    const cors = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://heksemel.no/case/submit.php' //  serveren må inkludere "Access-Control-Allow-Origin"
    const dataPlus = {...data, applicant: 'Marcin Sawczuk-Szymkiewicz'}
    // const url = 'https://jsonplaceholder.typicode.com/posts' // Fake Online REST API for Testing and Prototyping
    return axios.post(`${cors}${url}`, dataPlus)
        .then( res => {
            console.log(res)
            return Fetched(res.data)
        })
        .catch( error => {
            return FailFetched({...error})
        })
}

//applicant