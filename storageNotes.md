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

episode:
tells which episodes are in the playlist and which are explicitly removed.
fields: episodeid, updated, status
status: added, deleted

positionseconds (if undefined: not played yet), date
status: listed/ended/deleted, date

episode playback position:
tells where the playback of each episode is at.
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

## IDs

Using uuids makes synchronizing between different devices difficult. For example
if device A puts episode E1 on the playlist while offline and device B does the
same while offline too, and then they are synchronized to the cloud, the uuids
generated on each device for the same episode are different. So the data must be
synchronized using some other key (e.g. the episode's guid if it's an rss episode).
So we just use this key as the key in earfed even though that has other issues.

But what if a system gives up it's structure entirely. For example apple
podcasts doesn't have a collectionid any more but something different? So, key = (provider, id_as_of_provider)
