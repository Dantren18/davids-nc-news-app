## Test Output

​
Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.
​

### ESSENTIAL GET `/api/articles?topic=paper` -DONE

​
Assertion: expected 400 to equal 200
​
Hints:

- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the topic exists
  ​
  ​

### ESSENTIAL GET `/api/articles?topic=not-a-topic`-DONE

​
Assertion: expected 400 to equal 404
​
Hints:

- use a 404 status code, when provided a non-existent topic
- use a separate model to check whether the topic exists
  ​
  ​

### ESSENTIAL GET `/api/articles/1` -DONE

​
Assertion: expected [ Array(1) ] to be an object
​
Hints:

- send the article to the client in an object, with a key of `article`: `{ article: {} }`
- return the single article in an object, not in an array
- ensure there are no discrepancies between the README specification and your table column names
  ​
  ​

### ESSENTIAL GET `/api/articles/2` - I tested this it seems fine. I think this was due to it not being sent back as object which is now fixed

​
Assertion: expected undefined to equal 0
​
Hints:

- default the vote column to `0` in the seed
- article with article_id 2 has no comments, you may need to check your join
  ​
  ​

### ESSENTIAL GET `/api/articles/1` - I tested this it seems fine. I think this was due to it not being sent back as object which is now fixed

​
Assertion: Cannot read properties of undefined (reading 'toString')
​
Hints:

- ensure you have calculated a comment_count for the article
  ​
  ​

### ESSENTIAL PATCH `/api/articles/1` - again this one seems fine for me?

​
Assertion: expected [ Array(1) ] to be an object
​
Hints:

- send the updated article with a key of `article`
  ​
  ​

### ESSENTIAL PATCH `/api/articles/1`- again this one seems fine for me?

​
Assertion: expected undefined to equal 101
​
Hints:

- increment the `votes` of the specified article
  ​
  ​

### ESSENTIAL PATCH `/api/articles/1` - seems to be working fine now. Again I suspect to do with not being a key with value before

​
Assertion: expected undefined to equal 99
​
Hints:

- decrement the `votes` of the specified article
  ​
  ​

### ESSENTIAL PATCH `/api/articles/1` - was struggling to think of a way to fix this for now, so have left it for time being

​
Assertion: expected 422 to equal 200
​
Hints:

- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
  ​
  ​

### ESSENTIAL POST `/api/articles/1/comments` - key was called 'insertComment' - I have changed it to be 'comment' now.

​
Assertion: expected { Object (insertComment) } to contain key 'comment'
​
Hints:

- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README
  ​
  ​

### ESSENTIAL POST `/api/articles/1/comments`- this seems to be fine for me? again might be due to previously not being sent with a key. My response comes back as:

    {
    comment:
    {
    comment_id: 19,
    body: 'test comment',
    article_id: 1,
    author: 'icellusedkars',
    votes: 0,
    created_at: '2022-03-02T16:29:17.038Z'
    }

    }

I was just wondering if it instead has to be:

      {
      comment:
        {
          comment_id: 19,
          body: 'test comment',
          article_id: 1,
          author: 'icellusedkars',
          votes: 0,
          created_at: '2022-03-02T16:29:17.038Z'
        }

    }

    i.e. without the array?

​
Assertion: Cannot read properties of undefined (reading 'votes')
​
Hints:

- default `votes` to `0` in the migrations
- default `created_at` to the current time in the migrations
