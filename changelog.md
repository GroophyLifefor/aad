# 1.1.0

- feat: Introduction Video

## 1.1.1

- fix: GitHub Username added three alternative ways before crash.

## 1.1.2

- fix: fixed the new widget add button running to the top.

## 1.1.3

- feat: renew cache in frameModal.

## 1.1.4

- feat: more modern drag and drop in UI.

## 1.1.5

- fix: Added custom id for firefox add-ons.

## 1.1.6

- feat: Requested unlimitedStorage permission to store everything(mostly) on your local.

## 1.1.7

- FireError with report
- Timing to notifications
- Network Layer Schema
- aadRender which able to render new aad components

## 1.1.8

- Change widget position save fixed.
- New 'entries not found' text rather than crash
- Error handling improvements
- Slightly bigger aad's custom scrollbar
- Some scrolls moved to aad's custom scrollbar

## 1.1.9

- Another bug when widget position save fixed.
- Better support to all themes
- Trending widget settings improvements

## 1.2.0

- Added border to common modals
- Settings fully changed
- Fixed some widget based bugs

## 1.2.1

- Added send metrics option to settings (by default true in whitelist but I want to keep the default off depending on 
the number of users)
- Metrics back-end improvements and most metrics will be public, actually already public right now too
- Now container max count changed 4 to 16 (I hope it's enough, I made because of ultra-wide monitors)
- Settings navigation are navigating now :D

## 1.2.2

- Now when you reach min version, you will see a notification about the new version.
- |-> and when you reach hard min version, you will see a modal to update. 
- In the entries widget, now you can filter by
- |-> specific label
- |-> specific assignee
- |-> specific CIStatus like success, failed, pending as mergeable or not mergeable
- |-> specific review status like approved, changes requested, review by specific user
- In the trending widget, now you can change initial render count in settings.
- New term added as quick look, like right now you can quick look to GitHub notifications with clicking the notification icon.
- Trending widget a little bit improved in UI so know not has a horizontal scrollbar and easier to customize.

## 1.2.3

- Quick look GitHub notifications crash fixed when empty notifications.
- Metrics changed to false by default.

## 1.2.4

- Entries label fixed and now supports multiple labels and space included labels.
- New settings option for who don't want anyway use PAT token.
- Profile widget now handle with no token with saying "not provided"
- New quick look GitHub Repositories added, to see your repositories quickly. You can open by classic way to move profile page, open sidebar, click "Your repositories" button.

## 1.2.5

- repository preview buggy part fixed
- mine repositories quick look buggy part fixed
- entries won't loading fixed
- recent activity won't loading fixed
- added repository based rendering to entries widget
- more todo widget stability
- repo/pr/issue preview opener in todo description | for other links open in new tab
- issue preview won't open fixed

## 1.2.6

- fixed query selector problems because of GitHub UI changes
- fixed modal preview problems in toggle-stuck elements

## 1.2.7

- Safe DOM utilities with graceful error handling added
- Centralized GitHub preview system added
- Unified link handling for GitHub URLs added
- Reduced duplicated code across widgets (~300 lines removed), refactored
- Better handling when GitHub changes their UI, refactored
- Consistent error reporting for developers, refactored

## 1.2.8

- mount notification manager before boot so early toasts work
- await container init before loading widgets; guard missing container storage
- clearFeed uses transition timeout fallback so boot never hangs on fade CSS
- GitHub UI change helper toasts with link to open a project issue (includes stack trace)
- username resolves via PAT /user when DOM fallbacks fail
- storage provider expiry keys and read path fixed; poll interval slowed to 30s
- serial storage queue prevents read-modify-write races on containers
- saveWidgetPosition merges existing widget config by UUID and debounces writes (lazy init fixes script load order)
- error handler notifications include Open issue action with stack trace
- skip PAT validation when empty; cache token validity for 5 minutes
- general settings button retries header mount with fallbacks instead of silent skip
- mount settings after feed swap; header MutationObserver re-mounts when GitHub navbar re-renders
- mount settings after widget load (main); body MutationObserver + delayed re-check catches late header swaps
- add missing `waitUntil` helper used by settings mount retries
- todo widget uses `waitUntil` instead of broken `aad_repeatlyCall` for listener binding
- widget picker images updated to official repo assets on GitHub
- hide unhydrated GitHub list skeleton metadata in recent activity and entries widgets
- issue/PR preview uses gh_v1 HTML when available; gh_v2 shows API comment loader
- API-loaded comments render with GitHub timeline markup (avatar, header, markdown-body)
- remove stuck PR merge box spinner from gh_v2 HTML previews

## 1.2.9

- quick look GitHub notifications: button selectors updated for new header IconButton; content selectors fall back through list variants
- notifications quick look uses document capture click so GitHub navbar re-renders no longer drop the handler
- general settings mount fallback finds `header a[href="/notifications"]` when old notifications button id is gone
- toast bus renamed to `aad:new-notification` with detail guard so foreign `onNewNotification` events no longer crash AAD
- entries widget settings show generated GitHub search URL (readonly; updates after save)
- entries/recent activity: clone scraped `/issues` list DOM (`data-listview-component` / aria hooks) with page CSS; use `?type=pr` / `?type=issue` instead of search URLs

## 1.2.10

- entries widget uses the GitHub Issues Search API with PAT authentication first.
- entries falls back to the existing HTML fetch when no PAT is available or the API fails.
- issue and pull request searches are settled independently so one failed query does not hide successful results.
- entries shows issue/PR state icons, repository information, compact metadata, and color-coded label badges.
- modern issue/PR previews automatically load comments through the GitHub API when a PAT is available.
- entries and preview access failures now show a clear user-facing error state.
