## Earfed user data

- List of subscribed shows (urls)
- Episode user data: position in playlist, deleted/hidden
- Play status data: play progress of episodes (not started/position/end)

=> user data is synced to central server. Other data is only _cached_ on the devices.

## user data access patterns

show playlist: get_non_hidden_completed_of_subscribed_shows(with: hidden, progress)

episode playing: write back progress -> update single episode (maybe write an event)
start playing episode -> update single episode (maybe write an event)
pause episode -> update single episode (maybe write an event)
hide/delete episode -> update single episode (maybe write and event)

move episode -> save new order in some way??? Isn't order something about the
whole list? why not just save it as an ordered list of episode ids?

manage subscriptions -> add: save show url, delete: remove show url

=> access patterns:

- update single episode
- add/delete single show
- get all episodes (not: hidden, completed)
- change order of an episode

(current) episode status:
fields: episodeid, updated, status
status: deleted, playing, paused

(current) episode playback position
fields: episodeid, updated, positionseconds

show subscriptions
fields: show url, updated, status
status: subscribed, unsubscribed

found through apple: use artwork url from there
entered feed url: use artwork url from there

solutions
a) save showImageUrlOverride in user data if from apple
b) save where the show comes from (e.g. apple/rss) and implement different logic to get the url based on that

## Earfed non user data
episode info fallback (if cache result doesn't include the episode. might happen
if episode is long ago and cached or online episode list doesn't include it any
more because of paging):
fields: episodeid, episodeTitle, episodeUrl

This is necessary for episodes still on the playlist. Top be cleared when an
episode is removed from the playlist (by deleting it or when it's played to
end).

showSource:

- rss: { url } -> xml cached
- apple: { collectionId } -> json cached
- spotify: { whateverId } -> json cached
