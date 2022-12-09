We often want to update cached data using multiple queries, for example,
updating the cache using spectate after looking up a game by id. To ensure that
data is consistent when combined from multiple queries, we use fragments from
this directory to ensure each operation returns the same shape of data.
