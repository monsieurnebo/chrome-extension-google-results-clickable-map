/**
 * Small map thumbnail
 * It appears on the right panel gathering information regarding a place (e.g. restaurant, theater, etc)
 */
const SMALL_MAP_THUMBNAIL_SELECTOR = '#lu_map'

/**
 * Big map thumbnail
 * It appears right below the search bar, usually for a precise address
 */
const BIG_MAP_THUMBNAIL_SELECTOR = '#dimg_3'

/**
 * Interactive iframe map
 * It appears in results such as "city" and can be set fullscreen and interacted with
 */
const INTERACTIVE_MAP_SELECTOR = '.Lx2b0d'

/**
 * Results type tabs container
 */
const RESULTS_TYPE_TABS_CONTAINER_SELECTOR = '.crJ18e'

function getMapsUrlWithQuery() {
  const link = window.location.href;
  const step = link.split('q=')[1];
  const query = step.split('&')[0];

  const url = `https://www.google.com/maps?q=${query}`;

  return url
}

function addMapsTab() {
  const tabsContainer  = document.querySelector(RESULTS_TYPE_TABS_CONTAINER_SELECTOR);

  if (!tabsContainer) {
    console.warn('Impossible to find results tabs container')
    return null
  }

  const secondTab = tabsContainer.children[1]

  if (!secondTab) {
    console.warn('Impossible to find tabs')
    return null
  }

  const newMapTab = tabsContainer.children[1].cloneNode(true)

  if (!newMapTab) {
    console.warn('Cannot create map tab')
    return null
  }

  newMapTab.querySelector('div').textContent = 'Maps'
  newMapTab.querySelector('a').setAttribute('href', getMapsUrlWithQuery());
  
  tabsContainer.insertBefore(newMapTab, secondTab)

  console.log('Maps tab added')
}

function getMapThumbnail() {
  const interactiveMap = document.querySelector(INTERACTIVE_MAP_SELECTOR);
  if (interactiveMap) {
    console.log('Interactive map iframe found')

    return {
      type: 'interactiveMap',
      element: interactiveMap
    }
  }

  const smallMap = document.querySelector(SMALL_MAP_THUMBNAIL_SELECTOR);
  if (smallMap) {
    console.log('Small map thumbnail found')

    return {
      type: 'smallMap',
      element: smallMap
    }
  }

  const bigMap = document.querySelector(BIG_MAP_THUMBNAIL_SELECTOR);
  if (bigMap) {
    console.log('Big map thumbnail found')

    return {
      type: 'publicPlace',
      element: bigMap
    }
  }

  return null
}

function wrapElementInLink(element) {
  // 1. Create the wrapper element
  const wrapperLink = document.createElement('a');

  // 2. Insert it before the targeted element
  element.parentNode.insertBefore(wrapperLink, element);

  // 3. Move the targeted element into the wrapper
  wrapperLink.appendChild(element);

  return wrapperLink
}

function enableParentLink(element) {
  const url = getMapsUrlWithQuery();

  element.parentElement.setAttribute('href', url);
}


function main() {
  addMapsTab()

  console.log('Searching for a map thumbnail...')

  const mapThumbnail = getMapThumbnail();

  if (!mapThumbnail) {
    console.warn('No map thumbnail found in the Google results')

    return null
  }

  wrapElementInLink(mapThumbnail.element)
  enableParentLink(mapThumbnail.element)
}

main()


