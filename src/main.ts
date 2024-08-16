const GOOGLE_BASE_URL = 'https://www.google.com'
const GOOGLE_MAPS_BASE_URL = `${GOOGLE_BASE_URL}/maps`

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
 * Exact address of a public place from its dedicated side panel
 */
const ADRESS_ATTRIBUTE = 'data-url'
const ADRESS_SELECTOR = 'gqkR3b hP3ybd'

/**
 * Retrieves the address from the Google results page side panel, if available
 * @returns {string|null} The Data-URL found on the page, or an empty string if no address is found. The Data-URL is the same as the one in the Google Maps URL.
 */
function getAddress() {
  const addressWrapper = document.getElementsByClassName(ADRESS_SELECTOR)[0]
  const addressElement = addressWrapper?.children[0]

  if (addressWrapper && addressElement) {
    const address = addressElement.getAttribute(ADRESS_ATTRIBUTE)

    if (address) {
      console.log('Address found:', address)

      return address
    }
  } 

  console.log("No address found")

  return null
}

/**
 * Generate the Google Maps URL
 * @param {string|null} address - The exact address of a public place, if available
 * @returns {string} - The 
 */
function getMapsUrlWithQuery(address) {
  // 1. If we got the exact address, use it
  if (address) {
    const url = `${GOOGLE_BASE_URL}${address}`

    return url
  }
  
  // 2. Otherwise, use the Google search query
  const link = window.location.href;
  const step = link.split('q=')[1];
  const query = step.split('&')[0];

  const url = `${GOOGLE_MAPS_BASE_URL}?q=${query}`;

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

  const tabs = tabsContainer.querySelectorAll('[role="listitem"]')

  if (!tabs) {
    console.warn('Impossible to find tabs')
    return null
  }

  const secondTab = tabs[1]
  const mapTab = secondTab.cloneNode(true)

  if (!mapTab) {
    console.warn('Cannot create map tab')
    return null
  } 

  const mapTabLink = mapTab.querySelector('[role="link"]')
  const mapTabLabel = mapTab.querySelector('div')

  if (!mapTabLink || !mapTabLabel) {
    console.warn('Cannot create map tab link / label')
    return null
  } 
  
  const adress = getAddress();

  mapTabLink.setAttribute('href', getMapsUrlWithQuery(adress));
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
function wrapMapThumbnailInLinkToMaps(element) {
  // 1. Create the wrapper element
  const wrapperLink = document.createElement('a');

  // 2. Insert it before the targeted element
  element.parentNode.insertBefore(wrapperLink, element);

  // 3. Try to get the exact address from the page side panel
  const adress = getAddress();

  // 4. Set the link target to Google Maps
  const url = getMapsUrlWithQuery(adress);
  wrapperLink.setAttribute('href', url);
  wrapperLink.setAttribute('title', 'Open in Google Maps');

  // 5. Move the targeted element into the wrapper
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

  wrapMapThumbnailInLinkToMaps(mapThumbnail.element)
}

main()