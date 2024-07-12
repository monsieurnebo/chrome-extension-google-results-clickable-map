/**
 * Either:
 * - Small map thumbnail: it appears on the right panel gathering information 
 * regarding a place (e.g. restaurant, theater, etc)
 * - Big map thumbnail: it appears right below the search bar, usually for a precise address
 */
const STATIC_MAP_THUMBNAIL_SELECTOR = '#lu_map'

/**
 * Interactive iframe map
 * It appears in results such as "city" and can be set fullscreen and interacted with
 */
const INTERACTIVE_MAP_CARD_SELECTOR = '.Lx2b0d'
const INTERACTIVE_MAP_LARGE_SELECTOR = '.PAq55d'

/**
 * Result types (image, news, ...) tabs container
 */
const RESULTS_TYPE_TABS_CONTAINER_SELECTOR = '.crJ18e'

/**
 * Generate the Google Maps URL, based on the Google results query
 */
function getMapsUrlWithQuery() {
  const link = window.location.href;
  const step = link.split('q=')[1];
  const query = step.split('&')[0];

  const url = `https://www.google.com/maps?q=${query}`;

  return url
}

/**
 * Add the "Maps" tab to the Google results page tabs
 */
function addMapsTab() {
  const tabsContainer = document.querySelector(RESULTS_TYPE_TABS_CONTAINER_SELECTOR)?.querySelector('[role="list"]')

  if (!tabsContainer) {
    console.warn('Impossible to find results tabs container')
    return null
  }

  const secondTab = tabsContainer.children[1]

  if (!secondTab) {
    console.warn('Impossible to find tabs')
    return null
  }

  const mapTab = secondTab.cloneNode(true) as Element // TODO: fix this dirty type casting

  if (!mapTab) {
    console.warn('Cannot create map tab')
    return null
  } 

  const mapTabLink = mapTab.querySelector('a')
  const mapTabLabel = mapTab.querySelector('div')

  if (!mapTabLink || !mapTabLabel) {
    console.warn('Cannot create map tab link / label')
    return null
  } 

  mapTabLink.setAttribute('href', getMapsUrlWithQuery());
  mapTabLabel.textContent = 'Maps'

  tabsContainer.insertBefore(mapTab, secondTab)

  console.log('Maps tab added')
}

/**
 * Find potential map thumbnail in the Google results page
 */
function getMapThumbnail() {
  const interactiveMap = document.querySelector(INTERACTIVE_MAP_CARD_SELECTOR) || document.querySelector(INTERACTIVE_MAP_LARGE_SELECTOR)
  if (interactiveMap) {
    console.log('Interactive map iframe found')

    return {
      type: 'interactiveMap',
      element: interactiveMap
    }
  }

  const staticMapThumbnail = document.querySelector(STATIC_MAP_THUMBNAIL_SELECTOR);
  if (staticMapThumbnail) {
    console.log('Static map thumbnail found')

    return {
      type: 'staticMapThumbnail',
      element: staticMapThumbnail
    }
  }

  return null
}

/**
 * 
 * Wrap a given element in a link to Google Maps
 */
function wrapElementInLinkToMaps(element) {
  // 1. Create the wrapper element
  const wrapperLink = document.createElement('a');

  // 2. Insert it before the targeted element
  element.parentNode.insertBefore(wrapperLink, element);

  // 3. Set the link target to Google Maps
  const url = getMapsUrlWithQuery();
  wrapperLink.setAttribute('href', url);
  wrapperLink.setAttribute('title', 'Open in Google Maps');

  // 4. Move the targeted element into the wrapper
  wrapperLink.appendChild(element);

  return wrapperLink
}

function main() {
  addMapsTab()

  console.log('Searching for a map thumbnail...')

  const mapThumbnail = getMapThumbnail();

  if (!mapThumbnail) {
    console.warn('No map thumbnail found in the Google results')

    return null
  }

  wrapElementInLinkToMaps(mapThumbnail.element)
}

main()


