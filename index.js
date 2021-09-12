import fetch from 'node-fetch'
import Twit from 'twit'
 
const T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

const token = '...'

const USER_ID = "";

const showTweets = async () => {

    /* end_time is optional but if you have a lot of tweets you can search for each month if you want. */
    const response = await fetch(`https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=100&end_time=2021-10-06T00:00:00Z`, {	
        headers:({
            'Authorization': 'Bearer ' + (token), 
            })
    })
    const json = await response.json().then(res => [...res.data])
    
    return json

}

const selectBadTweets = async () => {
    const tweets = await showTweets()
    /*Here you should put words or half-words that you want to delete */
    const badWords = []

    const checkWords = (tweet, badWords) => {
        let tweets =[];
        badWords.forEach(element => {
            if(tweet.text.indexOf(element) > -1 ){
                tweets.push(tweet)
            }
        })
        
        return tweets;  
    }
    const badTweets = tweets.map(element => checkWords(element, badWords)).filter(item => item.length !== 0);

   return badTweets
}

const deleteBadTweets = async () => {
    const badTweets = await selectBadTweets();
    badTweets.forEach(element => element.forEach(tweet => {
        T.post(`statuses/destroy/:id`,{id:tweet.id}, (err, data) => {
            if(err){
                console.log(err)
            }else{
                console.log(`Tweet id : ${data.id}. Tweet text : ${data.text}. Your tweet was deleted succesfully.`)
            }
        })
    }))
}
await deleteBadTweets()
//console.log(await selectBadTweets());
